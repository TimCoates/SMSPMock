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

	// Instantiate any static stuff for speed
	setup();

	// Log our incoming event for ease of debugging
	console.log("Event: " + JSON.stringify(event));

	// Check whether the event was just a wakeup from SNS (to warm this lambda up)
    if(typeof event.Records != 'undefined') {
    	// It was, we've done setup, so now quit quickly.
    	context.callbackWaitsForEmptyEventLoop = false;
	    callback(null, null);
	} else {

		// It's a real request
		if(event.queryStringParameters == null) {

			// Here we've been asked for all the data, as JSON
			var params = {
				TableName: tblName,
				ProjectionExpression: "id, SOAPAction, request_time",
				Limit: 1000
			};
			console.log("Params: " + JSON.stringify(params));

			docClient.scan(params, function (err, result) {
				if(err) {
					console.log("Error: " + JSON.stringify(err));
					callback(err, "ERROR");
				} else {

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

	// Here we're detailing one log item, so we need to go a getItem rather than a scan
			var params = {
				TableName: tblName,
				Key:{ "id": event.queryStringParameters.id }
			};

			console.log("Params: " + JSON.stringify(params));

			docClient.get(params, function(err, data) {
			    if (err) {
			        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
			        callback(err, "Error");
			    } else {

					var b64Data = "AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/"+
"4QAAGM7DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIgAAAAAAARESAAAAAAABERIAAAAAAA"+
"EREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIiIiARERERERERIBEREREREREgE"+
"RERERERESARERERERERD+HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwAAACAAAAAgAAAAIAAAACAAQAA";


					var body = "<html><head>\n" +
"<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>\n" +
"<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css' " +
"integrity='sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M' crossorigin='anonymous'>\n" +
"<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>\n" +
"<link rel='stylesheet' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css'>\n" +
"<script src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js'></script>\n" +
"<link id='favicon' rel='shortcut icon' type='image/png' href='data:​image/png;base64," + b64Data + "'>\n" +
"<title>SMSP Mock - Log item: " + data.Item.id + "</title>\n"+
"</head>\n"+
"<body>\n" +
"<div class='container'>\n" +
" <div class='jumbotron'><h1><a href='Homepage'>Log Item: " + data.Item.id + "</a></h1></div>\n" +
" <div><h2>ID:</h2>" + data.Item.id + "</div>\n" +
" <div><h2>SOAP Action:</h2>" + data.Item.SOAPAction + "</div>\n" +
" <div><h2>Request time:</h2>" + data.Item.request_time + "</div>\n" +
" <div><h2>Request:</h2><figure class='highlight'><pre class='.pre-scrollable' style='font-size: x-small;'>" + htmlEntities(data.Item.request) + "</pre></figure></div>\n" +
" <div><h2>Response time:</h2>" + data.Item.response_time + "</div>\n" +
" <div><h2>Response:</h2><figure class='highlight'><pre class='.pre-scrollable' style='font-size: x-small;'>" + htmlEntities(data.Item.response) + "</pre></figure></div>\n" +
"</div>\n"+
"</body>\n" +
"</html>";

					// Generate the response object
					var reply = {
				        "statusCode": 200,
				        "headers": { "Content-Type": "text/html" },
				        "body": body
				    };
					callback(null, reply);
			    }
			});
		}
	}
}

// Helper function to make XML safe to display in html
function htmlEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Here we create some global stuff, eg DynamoDB Client, to improve warm performance.
function setup() {
	if(docClient == null) {
		docClient = new AWS.DynamoDB.DocumentClient();
	}
	if(tblName == null) {
		tblName = process.env.stageName + '-pds-messages';
	}
}