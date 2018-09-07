var mustache = require("mustache");
var msgTemplate = require("./PatientTemplate.json");
var bundleTemplate = require("./BundleTemplate.json");

module.exports = {
	makePatient: makePatient,
	makeBundle: makeBundle
};

/** Function to create a Patient FHIR Resource based on a database record
 * 
 * @param {*} patientData 
 */
function makePatient(patientData) {
	switch (patientData.gender) {
		case 0:
			patientData.gender = "Not known";
			break;

		case 1:
			patientData.gender = "Male";
			break;

		case 2:
			patientData.gender = "Female";
			break;

		case 9:
			patientData.gender = "Not specified";
			break;
	}
	if (patientData.dob.length == 8) {
		patientData.birthdate = patientData.dob.slice(0, 4) + "-" + patientData.dob.slice(4, 6) + "-" + patientData.dob.slice(6);
	} else {
		if (patientData.dob.length > 4) {
			patientData.birthdate = patientData.dob.slice(0, 4) + "-" + patientData.dob.slice(4, 6) + "-01";
		} else {
			patientData.birthdate = patientData.dob.slice(0, 4) + "-01-01";
		}
	}
	console.log("Modified Patient to: " + JSON.stringify(patientData));
	console.log("Templatefile: " + JSON.stringify(msgTemplate));
	var template = JSON.stringify(msgTemplate);
	console.log("Template: " + template);
	var patientResource = mustache.render(template, patientData);
	return patientResource;
}

/** Function to make a Bundle FHIR resource of type Searchset, based on a found database record.
 * 
 * @param {*} patientData 
 */
function makeBundle(patientData, baseURL) {
	var bundle = bundleTemplate;

	if(patientData != null) {
		bundle.entry[0].resource = JSON.parse(makePatient(patientData));
		bundle.entry[0].fullUrl = baseURL + "/" + patientData.nhs_number;
	} else {
		bundle.total = 0;
		bundle.entry = [];
	}
	bundle.meta.lastUpdated = new Date().toISOString();
	return JSON.stringify(bundle);
}