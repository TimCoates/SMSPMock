'use strict';
//Copyright 2018 Tim Coates
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
var utility = require("./utility.js");
var mime = "application/json";

module.exports = {
	entrypoint: entrypoint
};

/**
Function to do a SEARCH
 */
function entrypoint(event, context, callback) {

	context.callbackWaitsForEmptyEventLoop = false;
	console.log("Event: ", JSON.stringify(event));

    var baseURL = event.headers["X-Forwarded-Proto"] + "://" + event.headers.Host + event.requestContext.path;

    mime = utility.getMimeType(event);

	var response = JSON.stringify(event);
	var reply = {
		statusCode: 404,
		headers: { "Content-Type": "text/plain" },
		body: response
	};

	var dob = null;
	if('queryStringParameters' in event) {
		console.log("queryStringParameters exists");
	} else {
		console.log("queryStringParameters not here??");
	}
	if('birthdate' in event.queryStringParameters) {
        dob = event.queryStringParameters["birthdate"].slice(0, 4) + event.queryStringParameters["birthdate"].slice(5, 7) + event.queryStringParameters["birthdate"].slice(8);
        console.log("Searching on DOB: " + dob);
	}

	var family_name = null;
	if('family' in event.queryStringParameters) {
        family_name = event.queryStringParameters["family"];
        console.log("Searching on family_name: " + family_name);
	}

	var postcode = null;
	if('address-postalcode' in event.queryStringParameters) {
        postcode = event.queryStringParameters["address-postalcode"].replace(" ","");
        console.log("Searching on postcode: " + postcode);
	}

	if(dob != null && family_name != null && postcode != null) {
        console.log("We have query params");
		var indexval = family_name + postcode + dob;
		var params = {
			TableName: "prod-pds-data",
			IndexName: "traceindex",
			KeyConditionExpression: "traceindex = :term",
			ExpressionAttributeValues: {
				":term": indexval
			}
		};

		console.log("params: " + JSON.stringify(params));

		if(docClient == null) {
			docClient = new AWS.DynamoDB.DocumentClient();
		}
		docClient.query(params, function(err, data) {
			if(err) {
				console.log("err: " + JSON.stringify(err));
				reply.body = utility.makeBundle(null, baseURL, mime);
			} else {
				console.log("Got some data.");
				if(data.Count == 1) {
					console.log("Got exactly one match.");
                    reply.body = utility.makeBundle(data.Items[0], baseURL, mime);
                    reply.statusCode = 200;
                    reply.headers = { "Content-Type": "application/json" };
				} else {
					console.log("Got multiple matches.");
					reply.body = utility.makeBundle(null, baseURL, mime);
				}
				console.log("Response will be: " + reply.body);
			}
			callback(null, reply);
		});
	} else {
        console.log("We didn't get all 3 query parameteres required.");
		// Here we'll just send a default (TBC) empty bundle.
		reply.body = utility.makeBundle(null, baseURL, mime);
		callback(null, reply);
	}
}