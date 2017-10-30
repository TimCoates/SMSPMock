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

var async = require('async');
var templater = require('./makeTemplate.js');
var AWS = require("aws-sdk");
var docClient = null;
var tblName = null;
var dataTblName = null;

module.exports.entrypoint = (event, context, callback) => {

    // Do a warmup thing...
    setup();

    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Event: ", JSON.stringify(event));
    if(typeof event.Records != 'undefined') {
        console.log("Just a warmup!");
        callback(null, null);
    } else {

    	async.waterfall([
    		async.constant(event),    // Feeds event into our chain of functions...
    		getMessageID,             // Returns: error(null), message_id, event
            getSOAPAction,            // Returns: error(null), SOAPAction, message_id, event
    		saveRequest,              // Returns: error(null), SOAPAction, message_id, event
    		getPerson,                // Returns: error(null), SOAPAction, message_id, person
    		findPerson,               // Returns: error(null), SOAPAction, message_id, person
    		makeResponse,             // Returns: error(null), SOAPAction, message_id, responsebody
    		saveResponse              // Returns: error(null), message
    		], function (err, result) {
    			if(err) {
    				callback(err, "ERROR");
    			} else {
    				callback(null, result);
    			}
    		}
    	);
    }
};


// Gets the incoming message_id we'll correlate everything against
// Returns: error(null), message_id, event
function getMessageID(event, callback) {
	// Here we need to get the message_id
	// First we get the http body we had passed in, should be an XML document as a string
	var XMLString = event.body;

	// Now we call the function in makeTemplate.js which does all of the necessary XPath stuff.
	var message_id = templater.getMsgID(XMLString);
    console.log("Got message: " + message_id);

	// Then save incoming message against the message_id

	// And return it in args...
	callback(null, message_id, event);
}

// Gets the SOAPAction
// Returns: error(null), SOAPAction, message_id, event
function getSOAPAction(message_id, event, callback) {
    var SOAPAction;

    // Case insensitive getting of SOAPAction header
    if (typeof event.headers.SOAPAction != 'undefined') {
        SOAPAction = event.headers.SOAPAction;
    } else {
        if (typeof event.headers.soapaction != 'undefined') {
            SOAPAction = event.headers.soapaction;
        } else {
            SOAPAction = null;
        }
    }

    if (SOAPAction != null) {
        // We've got a SOAPAction header, get rid of any quotes
        console.log("SOAPAction: " + SOAPAction);
        SOAPAction = SOAPAction.replace("\"","");
        SOAPAction = SOAPAction.replace("\"","");
        console.log("SOAPAction: " + SOAPAction);

        var actions = [
            "urn:nhs-itk:services:201005:verifyNHSNumber-v1-0",
            "urn:nhs-itk:services:201005:getNHSNumber-v1-0",
            "urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0",
            "urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0",
            "urn:nhs-itk:services:201005:getPatientDetails-v1-0"
        ];

        if(actions.indexOf(SOAPAction) == -1) {
            console.log("ERROR");
            console.log("ERROR: Unrecognised SOAPAction: " + SOAPAction);
            console.log("ERROR");
            callback("Wrong SOAPAction", SOAPAction, message_id, event);
        } else {
            callback(null, SOAPAction, message_id, event);
        }
    }   
}

// Saves the request message into DynamoDB, keyed on message_id
// Returns: error(null), SOAPAction, message_id, event
function saveRequest(SOAPAction, message_id, event, callback) {

	var now = new Date().toISOString();
	var message = event.body;

    // Set when records added now will expire (2 days)
    var expiryDate = getExpiryDate();

    var params = {
        TableName: tblName,
        Key: { id : message_id },
        UpdateExpression: 'SET #b = :t, #c = :u, #d = :v, #e = :w',
        ExpressionAttributeNames: {
            '#b' : 'request_time',
            '#c' : 'request',
            '#d' : 'expires',
            '#e' : 'SOAPAction'
        },
        ExpressionAttributeValues: {
            ':t' : now,
            ':u' : message,
            ':v' : expiryDate,
            ':w' : SOAPAction
        }
    };

    docClient.update(params, function(err, data) {
    	if(err) {
    		callback(err, SOAPAction, message_id, event);
    	} else {
    		callback(null, SOAPAction, message_id, event);
    	}
    });
}

// Gets the person object from the passed event, actually from the payload body XML document
// Returns: error(null), SOAPAction, message_id, person
function getPerson(SOAPAction, message_id, event, callback) {

	// First we get the http body we had passed in, should be an XML document as a string
	var XMLString = event.body;

	// Now we call the function in makeTemplate.js which does all of the necessary XPath stuff.
	var person = templater.getPerson(XMLString, SOAPAction);
	callback(null, SOAPAction, message_id, person);
}

// Matches the patient passed in against a stored patient. Returns a stored patient, or an empty object if no match
// Returns a person where nhsNumber and DOB both match...
// Returned person is the person from our database, or null if not matched.
// Returns: error(null), SOAPAction, message_id, person
function findPerson(SOAPAction, message_id, persontoFind, callback) {

    console.log("In findPerson()");
    console.log("Looking for: " + JSON.stringify(persontoFind));

    var person = null;

    // Here decide whether we're searching or getting...

    var getActions = [
            "urn:nhs-itk:services:201005:verifyNHSNumber-v1-0",
            "urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0"
    ];

    // So we have should have both DOB and NHS Number    
    if(getActions.indexOf(SOAPAction) != -1) {
        console.log("We should be doing a GET not a SEARCH...");
        var nhsNumberToFind = persontoFind.nhs_number;
        var dobToFind = persontoFind.dob;
        var candidate = {};

        var params = {
            TableName : dataTblName,
            Key:{ "nhs_number": nhsNumberToFind }
        };

        docClient.get(params, function(err, data) {
            if (err) {
                console.log("Unable to read item. Error JSON:" + JSON.stringify(err, null, 2));
                callback(err, SOAPAction, message_id, person);
            } else {
                if(data.Item != null) {
                    console.log("Found a match on NHS Number...");

                    // Now strip back stored dob to length of the supplied one...
                    var checkDOB = data.Item.dob.substring(0, dobToFind.length);
                    if(checkDOB == dobToFind) {
                        console.log("...and DOB matches");
                        person = data.Item;
                        callback(null, SOAPAction, message_id, person);
                    } else {
                        console.log("NHS Number found, but DOB didn't match");
                        callback(null, SOAPAction, message_id, person);
                    }
                } else {
                    console.log("Not found...");
                    callback(null, SOAPAction, message_id, person);
                }
            }
        });
    } else {
        console.log("We will be doing a SEARCH...");
        // Here we need to do what we can based on what we've got...
        var nhsNFlag = false;
        if(typeof persontoFind.nhs_number != 'undefined') {
            var nhsNumberToFind = persontoFind.nhs_number;
            nhsNFlag = true;
        }

        var dobFlag = false;
        if(typeof persontoFind.dob != 'undefined') {
            var dobToFind = persontoFind.dob;
            dobFlag = true;
        }

        var fNameFlag = false;
        if(typeof persontoFind.family_name != 'undefined') {
            var sNameToFind = persontoFind.family_name;
            fNameFlag = true;   
        }

        var genderFlag = false;
        if(typeof persontoFind.gender != 'undefined') {
            var genderToFind = persontoFind.gender;
            genderFlag = true;
        }

        var params = {
            TableName: dataTblName
        };

        console.log("We've got the flags, now to build params");

        // Based on what fields, populate params object appropriately...
        if((nhsNFlag == true) && (dobFlag == true)) {
                params.KeyConditionExpression = "#nhsn = :nhs_number",,
                params.ExpressionAttributeValues = { ":nhsn": nhsNumberToFind }
        } else {
            if((fNameFlag == true) && (genderFlag == true) && (dobFlag == true)) {
                params.IndexName = "name",
                params.KeyConditionExpression = "family_name = :fname and dob = :dob",
                params.ExpressionAttributeValues = {
                    ":fname": sNameToFind,
                    ":dob": dobToFind
                };
            } else {
                callback("ERROR Querying DynamoDB , not enough parameters supplied!", "ERROR");
            }
        }

        console.log("params: " + JSON.stringify(params));

        docClient.query(params, function(err, data) {
            if(err) {
                console.log("ERROR querying DynamoDB: " + JSON.stringify(err));
                callback(null, SOAPAction, message_id, null);
            } else {
                console.log("Got data back from querying DynamoDB");
                if(data.Items.length == 1) {
                        person = data.Items[0];
                        console.log("Found one match");
                        if(person.gender == genderToFind) {
                            callback(null, SOAPAction, message_id, person);
                        } else {
                            callback(null, SOAPAction, message_id, null);
                        }
                } else {
                    if(data.Items.length == 0) {
                        console.log("Found no match");
                        callback(null, SOAPAction, message_id, null);
                    } else {
                        console.log("Found more than one match");
                        // Here need to step through and copy over only those with right gender, and see whether we only get one :-)
                        var ItemsWithRightGender = [];
                        for(var i = 0; i < data.Items.length; i++) {
                            if(data.Items[i].gender == genderToFind) {
                                console.log("Item: " + i + " was correct gender");
                                ItemsWithRightGender.push(data.Items[i]);
                            } else {
                                console.log("Item: " + i + " was incorrect gender");
                            }
                        }
                        if(ItemsWithRightGender.length == 1) {
                            console.log("We reduced it to 1 match");
                            person = ItemsWithRightGender[0];
                            callback(null, SOAPAction, message_id, person);
                        } else {
                            console.log("We still have >1 match");
                            callback(null, SOAPAction, message_id, null);
                        }
                    }
                }
            }
        });
    }
}

// Generates an XML response from a person object
// Returns: error(null), SOAPAction, message_id, responsebody
function makeResponse(SOAPAction, message_id, person, callback) {
	var responseBody = templater.makeResponse(person, SOAPAction);
	// Here we need to save the response against the key message_id
	callback(null, SOAPAction, message_id, responseBody);
}

// Saves the response message into DynamoDB
// Returns: error(null), message
function saveResponse(SOAPAction, message_id, message, callback) {

	var now = new Date().toISOString();
	    // Set when records added now will expire (2 days)
    var expiryDate = getExpiryDate();

    var params = {
        TableName: tblName,
        Key: { id : message_id },
        UpdateExpression: 'SET #b = :t, #c = :u',
        ExpressionAttributeNames: {
            '#b' : 'response_time',
            '#c' : 'response'
        },
        ExpressionAttributeValues: {
            ':t' : now,
            ':u' : message.body
        }
    };

    docClient.update(params, function(err, data) {
    	if(err) {
    		callback(err, "ERROR saving response message");
    	} else {
    		callback(null, message);
    	}
    });
}

// Gets an expiry date 2 days from now, to allow log entries to be expired
function getExpiryDate() {
    // Set when records added now will expire (2 days)
    var dt = new Date();
    var days = 2;
    var newDate = new Date(dt.setTime( dt.getTime() + days * 86400000 ));
    var ep2 = newDate.getTime() / 1000;
    return parseInt(ep2);
}


function setup() {
    if(docClient == null) {
        docClient = new AWS.DynamoDB.DocumentClient();
    }
    if(tblName == null) {
        tblName = process.env.stageName + '-pds-messages';
    }
    if(dataTblName == null) {
        dataTblName = process.env.stageName + "-pds-data";
    }
}