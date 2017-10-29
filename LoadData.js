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
var data_file = require('./PDS_Full_Data.json');
var AWS = require("aws-sdk");
var docClient = null;
var tblName = null;

module.exports.entrypoint = (event, context, callback) => {

	// We do this regardless, it only does anything if this Lambda is being cold started.
	setup();	

	console.log("Event: ", JSON.stringify(event));
    if(typeof event.Records != 'undefined') {
    	context.callbackWaitsForEmptyEventLoop = false;
	    callback(null, null);
	} else {

		doLoad();
		var b64Data = "AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAGM7DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIiIiARERERERERIBEREREREREgERERERERESARERERERERD+HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwAAACAAAAAgAAAAIAAAACAAQAA";

		var body = "<html><head>" +
		"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">" +
		"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
		"integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">" +
		"<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">" +
		"<title>SMSP Mock - Load data</title></head><body>" +
		"<div class=\"container\">" +
		"<div class=\"jumbotron\"><h1><a href=\"Homepage\">Load data</a></h1></div>Records loaded</div></body></html>";

	    var reply = {
	        "statusCode": 200,
	        "headers": { "Content-Type": "text/html" },
	        "body": body
	    };
	    callback(null, reply);
	}
};

function doLoad() {

	docClient = new AWS.DynamoDB.DocumentClient();
	tblName = process.env.stageName + "-pds-data";
	
	console.log("Loading data into: " + tblName);

	console.log("Got: " + data_file.length + " records to be loaded...");

	data_file.forEach(function(person) {

	    var params = {
	        TableName: tblName,
	        Item: {
				"nhs_number": person.nhs_number,
				"dob": person.dob,
				"dod": person.dod,
				"family_name": person.family_name,
				"given_name": person.given_name,
				"other_given_name": person.other_given_name,
				"title": person.title,
				"gender": person.gender,
				"address1": person.address1,
				"address2": person.address2,
				"address3": person.address3,
				"address4": person.address4,
				"address5": person.address5,
				"sensitiveflag": person.sensitiveflag,
				"primary_care_code": person.primary_care_code,
				"postcode": person.postcode,
				"telecom": person.telecom
	        }
	    };

	    docClient.put(params, function(err, data) {
	       if (err) {
	           console.error("Unable to add person", person.nhs_number, ". Error JSON:", JSON.stringify(err, null, 2));
	       } else {
	           //console.log("PutItem succeeded:", person.nhs_number);
	       }
	    });
	});
}

function setup() {
	if(docClient == null) {
		docClient = new AWS.DynamoDB.DocumentClient();
	}
	if(tblName == null) {
		tblName = process.env.stageName + "-pds-data";
	}
}