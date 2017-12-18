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

const AWS = require('aws-sdk');
var favicon = require ('./favicon.js');
// This lives outside the lambda function, so stays here for warm starts
var sns = null;

module.exports.entrypoint = (event, context, callback) => {

	context.callbackWaitsForEmptyEventLoop = false;

	// For debugging help, we log the incoming event
	console.log("Event: ", JSON.stringify(event));

	// Here we instantiate SNS, (if necessary) and wake up all the other Lambdas (as they subscribe to the SNS Topic) 
	setup(function(err, data) {
		if(err) {
			callback(err, "Error returned from call to SNS.");
		} else {
			// This is the favicon
			var b64Data = favicon.b64Data;

			// The html for the page...
			var body = "<html><head>\n" +
			"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n" +
			"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
			"integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">\n" +
			"<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">\n" +
			"<title>SMSP Mock</title>\n</head>\n<body>\n" +
			"<div class=\"container\">\n" +
			" <div class=\"jumbotron\"><h1>SMSP Mock</h1></div>\n" +
			" <div class=\"row\">\n" +
			"  <h4>Available from <a href='https://github.com/TimCoates/SMSPMock#readme'>https://github.com/TimCoates/SMSPMock</a></h4>\n" +
			" </div>\n" +
			" <div class=\"row\">\n" +
			"  <div class=\"col\">\n"+
			"   <h2>Load data</h2>\n" +
			"Go here to load some synthetic data into the synthetic PDS database which backs up this service.</div>\n" +
			"  <div class=\"col\">\n"+
			"   <h2>PDS Data</h2>\n" +
			"Go here to see patients in the synthetic data.<br /></div>\n" +
			"  <div class=\"col\">\n"+
			"   <h2>Logs</h2>\n" +
			"Go here to view detailed logs of interactions with this service.<br /></div>\n" +
			"  <div class=\"col\">\n"+
			"   <h2>Test</h2>\n" +
			"Go here to submit calls to the SOAP service.<br /></div>\n" +
			" </div>\n"+ // End of the row
			" <div class=\"row\">\n" +
			"  <div class=\"col\">\n"+
			"   <a class=\"btn btn-secondary\" href=\"LoadData\" role=\"button\">Load data &raquo;</a></div>\n" +
			"  <div class=\"col\">\n"+
			"   <a class=\"btn btn-secondary\" href=\"Patient\" role=\"button\">Patients &raquo;</a></div>\n" +
			"  <div class=\"col\">\n"+
			"   <a class=\"btn btn-secondary\" href=\"Logs\" role=\"button\">View logs &raquo;</a></div>\n" +
			"  <div class=\"col\">\n"+
			"   <a class=\"btn btn-secondary\" href=\"Test\" role=\"button\">Submit tests &raquo;</a></div>\n" +
			" </div>\n" +
		    "</div>\n"+
		    "</body>\n"+
		    "</html>";

		    // Build a response object
		    var reply = {
		        "statusCode": 200,
		        "headers": { "Content-Type": "text/html" },
		        "body": body
		    };
		    callback(null, reply);		
		}
	});
};

// Function which instantiates the SNS client if it's not already there,
// if it's not, then we're cold, so it then sends a wake up message to an SNS topic
function setup(callback) {

	// If we haven't been recently been run...
	if(sns == null) {
	    sns = new AWS.SNS();
	    var snsTopicARN = "arn:aws:sns:" + process.env.regionName + ":" + process.env.accountID + ":" + process.env.stageName + "-awaken";
	    var SNSparams = {
	        Message: "Wake up sleepy head!",
	        Subject: "SNS Wakeup mesdsage sent from homepage",
	        TopicArn: snsTopicARN
	    };
	    console.log('Sending: Wake up sleepy head! to SNS topic: ' + snsTopicARN);
	    sns.publish(SNSparams, callback);
	} else {
		callback(null, "No need to wake all Lambdas up");
	}
}
