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
var sns = null;

module.exports.entrypoint = (event, context, callback) => {

	context.callbackWaitsForEmptyEventLoop = false;
	console.log("Event: ", JSON.stringify(event));

	var wakeUp = "Wake up sleepy head!";

	putOnQueue(wakeUp, "awaken", function(err, data) {
		if(err) {
			callback(err, "Error returned from call to SNS.");
		} else {
			var b64Data = "AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAGM7DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIiIiARERERERERIBEREREREREgERERERERESARERERERERD+HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwAAACAAAAAgAAAAIAAAACAAQAA";
			var body = "<html><head>" +
			"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">" +
			"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
			"integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">" +
			"<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">" +
			"<title>SMSP Mock</title></head><body>" +
			"<div class=\"container\">" +
			"<div class=\"jumbotron\"><h1>SMSP Mock</h1></div>" +
			"<div class=\"row\">" +
			"<h4>Available from <a href='https://github.com/TimCoates/SMSPMock'>https://github.com/TimCoates/SMSPMock</a></h4>" +
			"</div>" +
			"<div class=\"row\">" +
			"<div class=\"col\"><h2>Load data</h2>" +
			"Go here to load some synthetic data into the synthetic PDS database which backs up this service.</div>" +
			"<div class=\"col\"><h2>PDS Data</h2>" +
			"Go here to see patients in the synthetic data.<br /></div>" +
			"<div class=\"col\"><h2>Logs</h2>" +
			"Go here to view detailed logs of interactions with this service.<br /></div>" +
			"<div class=\"col\"><h2>Test</h2>" +
			"Go here to submit calls to the SOAP service.<br /></div>" +
			"</div><div class=\"row\">" +
			"<div class=\"col\"><a class=\"btn btn-secondary\" href=\"LoadData\" role=\"button\">Load data &raquo;</a></div>" +
			"<div class=\"col\"><a class=\"btn btn-secondary\" href=\"Patient\" role=\"button\">Patients &raquo;</a></div>" +
			"<div class=\"col\"><a class=\"btn btn-secondary\" href=\"Logs\" role=\"button\">View logs &raquo;</a></div>" +
			"<div class=\"col\"><a class=\"btn btn-secondary\" href=\"Test\" role=\"button\">Submit tests &raquo;</a></div>" +
			"</div>" +
		    "</div></body></html>";

		    var reply = {
		        "statusCode": 200,
		        "headers": { "Content-Type": "text/html" },
		        "body": body
		    };
		    callback(null, reply);		
		}
	});
};

function putOnQueue(data, queue, callback) {

	// If we haven't been recently been run...
	if(sns == null) {
	    sns = new AWS.SNS();
	    var snsTopicARN = "arn:aws:sns:" + process.env.regionName + ":" + process.env.accountID + ":" + process.env.stageName + "-" + queue;
	    var SNSparams = {
	        Message: data,
	        Subject: "SNS Wakeup mesdsage sent from homepage",
	        TopicArn: snsTopicARN
	    };
	    console.log('Sending: ' + JSON.stringify(data) + ' to SNS topic: ' + snsTopicARN);
	    sns.publish(SNSparams, callback);
	} else {
		callback(null, "No need to wake all Lambdas up");
	}
}
