'use strict';
//Copyright 2017 Tim Coates
//
//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.
var AWS = require("aws-sdk");
var docClient = null;
var tblName = null;

module.exports.entrypoint = (event, context, callback) => {

	setup();

	console.log("Starting");
	console.log("Event: " + JSON.stringify(event));

	if(event.queryStringParameters == null) {
// Here we've been asked for all the data, as JSON
		var params = {
			TableName: tblName,
			ProjectionExpression: "nhs_number, family_name, given_name",
			Limit: 1000
		};
		console.log("Params: " + JSON.stringify(params));

		docClient.scan(params, function (err, result) {
			if(err) {
				console.log("Error: " + JSON.stringify(err));

				callback(err, "ERROR");
			} else {

				console.log("No error: " + JSON.stringify(result));

				var reply = {
			        "statusCode": 200,
			        "headers": { "Content-Type": "application/json" },
			        "body": JSON.stringify(result.Items)
			    };

			    console.log("Reply: " + JSON.stringify(reply));
				callback(null, reply);
			}
		});
	} else {
// Here we're detailing one log item...

// Here we need to go a getItem rather than a scan
		var params = {
			TableName: tblName,
			Key:{
		        "nhs_number": event.queryStringParameters.nhs_number
		    }
		};
		console.log("queryStringParameters: " + JSON.stringify(event.queryStringParameters.nhs_number));
		console.log("Params: " + JSON.stringify(params));

		docClient.get(params, function(err, data) {
		    if (err) {
		        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
		        callback(err, "Error");
		    } else {
		        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));

				var b64Data = "AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAGM7DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIiIiARERERERERIBEREREREREgERERERERESARERERERERD+HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwAAACAAAAAgAAAAIAAAACAAQAA";
				var body = "<html><head>" +
"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">" +
"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
"integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">" +
"<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>" +
"<link rel=\"stylesheet\" href=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css\">" +
"<script src=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>" +
"<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">" +
"<title>SMSP Mock - Patient: " + data.Item.nhs_number + "</title></head><body>" +
"<div class=\"container\">" +
"<div class=\"jumbotron\"><h1><a href=\"Homepage\">Patient details: " + data.Item.nhs_number + "</a></h1></div>" +
"<div><h2>NHS Number</h2>" + data.Item.nhs_number + "</div>" +
"<div><h2>Name</h2>" + data.Item.given_name + " " + data.Item.family_name + "</div>" +
"<div><h2>Address</h2>" + makeAddress(data) + "</div>" +
makeDOB(data) +
gender(data) + 
makeContacts(data) +
"</div></body>" +
"</html>";

				var reply = {
			        "statusCode": 200,
			        "headers": { "Content-Type": "text/html" },
			        "body": body
			    };

			    console.log("Reply: " + JSON.stringify(reply));
				callback(null, reply);
		    }
		});


	}
}

// Function to parse the input into a json object
function parseQuery(qstr) {
    console.log("parseQuery called on: " + qstr);
    var query = {};
    var a = qstr.substr(0).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

function makeAddress(data) {
	var reply = "";
	if(typeof data.Item.address1 != 'undefined') {
		reply = reply + "<div>" + data.Item.address1 +"</div>\n";
	}
	if(typeof data.Item.address2 != 'undefined') {
		reply = reply + "<div>" + data.Item.address2 +"</div>\n";
	}
	if(typeof data.Item.address3 != 'undefined') {
		reply = reply + "<div>" + data.Item.address3 +"</div>\n";
	}
	if(typeof data.Item.address4 != 'undefined') {
		reply = reply + "<div>" + data.Item.address4 +"</div>\n";
	}
	if(typeof data.Item.address5 != 'undefined') {
		reply = reply + "<div>" + data.Item.address5 +"</div>\n";
	}
	if(typeof data.Item.postcode != 'undefined') {
		reply = reply + "<div>" + data.Item.postcode +"</div>\n";
	}
	return reply;
}

function gender(data) {
	console.log("In gender() with: " + JSON.stringify(data));
	var gender = "";
	if(typeof data.Item.gender != 'undefined') {
		gender = "<div><h2>Gender</h2>";
		switch(data.Item.gender) {
			case 0:
			gender = gender + "Not known";
			break;

			case 1:
			gender = gender + "Male";
			break;

			case 2:
			gender = gender + "Female";
			break;

			case 9:
			gender = gender + "Not specified";
			break;
		}
		
		gender = gender + "</div>";
	}
	return gender;
}

function makeDOB(data) {
	console.log("In makeDOB() with: " + JSON.stringify(data));
	var dob = "";
	if(typeof data.Item.dob != 'undefined') {
		dob = "<div><h2>DOB</h2>";
		dob = dob + data.Item.dob.substr(6, 2) + "/";
		dob = dob + data.Item.dob.substr(4, 2) + "/";
		dob = dob + data.Item.dob.substr(0, 4);
		dob = dob + "</div>";
	}
	return dob;
}

function makeContacts(data) {
	console.log("In makeContacts() with: " + JSON.stringify(data));
	var contacts = "";

	if(typeof data.Item.telecom != 'undefined') {
		contacts = "<div><h2>Contacts</h2>";
		for(var i = 0; i < data.Item.telecom.length; i++) {
			var type = "";
			switch(data.Item.telecom[i].use) {
				case "BAD":
				type = "Bad / Useless";
				break;

				case "CONF":
				type = "Confidential";
				breal;

				case "H":
				type = "Home address";
				break;

				case "HP":
				type = "Primary Home";
				break;

				case "HV":
				type="Home (Vacation)";
				break;

				case "OLD":
				type="No longer in use";
				break;

				case "TMP":
				type="Temporary address";
				break;

				case "WP":
				type="Workplace";
				break;

				case "DIR":
				type="Direct";
				break;

				case "PUB":
				type="Public";
				break;

				case "PHYS":
				type="Physical visit address";
				break;

				case "PST":
				type="Postal address";
				break;

				case "AS":
				type="Answering Service";
				break;

				case "EC":
				type="Emergency contact";
				break;

				case "MC":
				type="Mobile contact";
				break;

				case "PG":
				type="Pager";
				break;

			}
			contacts = contacts + "<div><strong>Type: </strong>" + type + "&nbsp;&nbsp;";

			var value = "";
			if(data.Item.telecom[i].value.substr(0, 4) == "tel:") {
				value = "Telephone: " + data.Item.telecom[i].value.substr(4, 13);
			}
			if(data.Item.telecom[i].value.substr(0, 4) == "fax:") {
				value = "Fax: " + data.Item.telecom[i].value.substr(4, 13);
			}
			if(data.Item.telecom[i].value.substr(0, 7) == "mailto:") {
				value = "Email: " + data.Item.telecom[i].value.substr(7, data.Item.telecom[i].value.length);
			}

			contacts = contacts + "<strong>Value: </strong>" + value + "</div>";
		}
		contacts = contacts + "</div>";
	}
	return contacts;
}

function setup() {
	if(docClient == null) {
		docClient = new AWS.DynamoDB.DocumentClient();
	}
	if(tblName == null) {
		tblName = process.env.stageName + '-pds-data';
	}
}
