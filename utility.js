var mustache = require("mustache");
var patJSONTemplate = require("./PatientTemplate.json");
var templates = require("./templates.js");
var bundleJSONTemplate = require("./BundleTemplate.json");

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
			patientData.gender = "unknown";
			break;

		case 1:
			patientData.gender = "male";
			break;

		case 2:
			patientData.gender = "female";
			break;

		case 9:
			patientData.gender = "unknown";
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
        template = templates.responseTemplates["patientResource"];
        console.log("Template: " + template);
        patientResource = mustache.render(template, patientData);
    } else {
        console.log("Templatefile: " + JSON.stringify(patJSONTemplate));
        patJSONTemplate.text = {
            status: "generated"
        };
        patJSONTemplate.text.div = maketextDIV(patientData);
        patJSONTemplate.id = patientData.nhs_number;
        patJSONTemplate.identifier.value = patientData.nhs_number;
        patJSONTemplate.name[0].family = patientData.family_name;
        patJSONTemplate.name[0].given = [];
        patJSONTemplate.name[0].given.push(patientData.given_name);
        if('other_given_name' in patientData) {
            patJSONTemplate.name[0].given.push(patientData.other_given_name);
        }
        patJSONTemplate.name[0].prefix = patientData.title;
        patJSONTemplate.gender = patientData.gender;
        patJSONTemplate.birthDate = patientData.birthdate;

        var address = {
            "use": "home",
            "line": []
        };
        if('postcode' in patientData) {
            address.postalCode = patientData.postcode;
        }
        if('address1' in patientData) {
            address.line.push(patientData.address1);
        }
        if('address2' in patientData) {
            address.line.push(patientData.address2);
        }
        if('address3' in patientData) {
            address.line.push(patientData.address3);
        }
        if('address4' in patientData) {
            address.line.push(patientData.address4);
        }
        if('address5' in patientData) {
            address.line.push(patientData.address5);
        }

        patJSONTemplate.address = [];
        patJSONTemplate.address.push(address);

        patientResource = JSON.stringify(patJSONTemplate);
    }

	return patientResource;
}

/** Function to make a Bundle FHIR resource of type Searchset, based on a found database record.
 *
 * @param {*} patientData
 */
function makeBundle(patientData, baseURL, mimeType) {

    var response = "EMPTY";
    var bundle;

    if(mimeType == "application/xml") {
        bundle = template = templates.responseTemplates["bundleResource"];
// TODO
    } else {
        bundle = bundleJSONTemplate;

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

    console.log("in getMimeType() Event: " + JSON.stringify(event));

    // Set mime type based on Accept headers...
    if(event.headers.Accept.indexOf("application/xml") > -1) {
        mime = "application/xml";
    }
    if(event.headers.Accept.indexOf("application/json") > -1) {
        mime = "application/json";
    }

    // Override Accept header with _format querystring parameter
    if('queryStringParameters' in event) {
        if(event.queryStringParameters != null) {
            if('_format' in event.queryStringParameters) {
                if(event.queryStringParameters._format.includes("xml")) {
                    mime = "application/xml";
                }
                if(event.queryStringParameters._format.includes("json")) {
                    mime = "application/json";
                }
            }
        }
    }
    return mime;
}

function maketextDIV(patientData) {
    var div = "";

    div = div + "<div xmlns=\"http://www.w3.org/1999/xhtml\"><h1>Patient: " + patientData.nhs_number + "</h1>\n";
    div = div + "<h2>" + patientData.title + " " + patientData.given_name;
    if('other_given_name' in patientData) {
        div = div + " " + patientData.other_given_name;
    }
    div = div + " " + patientData.family_name + "</h2>\n";
    div = div + "Gender: " + patientData.gender + "<br />\n";
    div = div + "DOB: " + patientData.birthDate + "<br />\n";
    div = div + "</div>";
    return div;
}