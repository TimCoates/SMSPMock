var mustache = require("mustache");
var patJSONTemplate = require("./PatientTemplate.json");
var patXMLTemplate = require("./PatientTemplate.xml");
var bundleJSONTemplate = require("./BundleTemplate.json");
var bundleXMLTemplate = require("./BundleTemplate.xml");

module.exports = {
	makePatient: makePatient,
    makeBundle: makeBundle,
    getMimeType: getMimeType
};

/** Function to create a Patient FHIR Resource based on a database record
 *
 * @param {*} patientData
 */
function makePatient(patientData, mimeType) {
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

    var template;
    var patientResource;

    if(mimeType == "application/xml") {
        console.log("Templatefile: " + JSON.stringify(patXMLTemplate));
        template = JSON.stringify(patXMLTemplate);
        console.log("Template: " + template);
    } else {
        console.log("Templatefile: " + JSON.stringify(patJSONTemplate));
        template = JSON.stringify(patJSONTemplate);
        console.log("Template: " + template);
    }
    patientResource = mustache.render(template, patientData);
	return patientResource;
}

/** Function to make a Bundle FHIR resource of type Searchset, based on a found database record.
 *
 * @param {*} patientData
 */
function makeBundle(patientData, baseURL, mimeType) {

    var response = "EMPTY";
    if(mimeType == "application/xml") {
// TODO
    } else {
        var bundle = bundleJSONTemplate;

        if(patientData != null) {
            bundle.entry[0].resource = JSON.parse(makePatient(patientData, mimeType));
            bundle.entry[0].fullUrl = baseURL + "/" + patientData.nhs_number;
        } else {
            bundle.total = 0;
            bundle.entry = [];
        }
        bundle.meta.lastUpdated = new Date().toISOString();
        response = JSON.stringify(bundle);
    }
    return response;
}

/** Function to determine the accepted mime type based on both the QueryString and Accept headers
 *
 * @param {*} event An incoming http event.
 */
function getMimeType(event) {

    // Set a default
    var mime = "application/json";

    // Set mime type based on Accept headers...
    if(event.headers.Accept.indexOf("application/xml") > -1) {
        mime = "application/xml";
    }
    if(event.headers.Accept.indexOf("application/json") > -1) {
        mime = "application/json";
    }

    // Override Accept header with _format querystring parameter
    if('_format' in event.queryStringParameters) {
        if(event.queryStringParameters._format.includes("xml")) {
            mime = "application/xml";
        }
        if(event.queryStringParameters._format.includes("json")) {
            mime = "application/json";
        }
    }
    return mime;
}