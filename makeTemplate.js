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
var mustache = require("mustache");
const uuidv4 = require('uuid/v4');
var dom = require('xmldom').DOMParser;
var templates = require ('./templates.js');

// Array of templates, one per SOAPAction

// Pulls out the message_id from the soap:Envelope
function getMsgID(xmlString) {
    var doc = new dom().parseFromString(xmlString, "application/xml");
    var message_id = doc.getElementsByTagName("wsa:MessageID").item(0).childNodes[0].data;
    console.log("message_id: " + message_id);
    return message_id;
}


// Constructs a person from the incoming ITK message...
// Returns a person object or null
function getPerson(xmlString, SOAPAction) {

    var person = null;
    var doc = new dom().parseFromString(xmlString);

    if(typeof doc != 'undefined') {
        console.log("Got a doc!");

        person = {};
        var node;
        var innerNode;

        node = doc.getElementsByTagName("Person.NHSNumber").item(0);
        if(typeof node != 'undefined') {
            person.nhs_number = doc.getElementsByTagName("Person.NHSNumber").item(0).getElementsByTagName("value").item(0).getAttribute("extension");
        }

        node = doc.getElementsByTagName("Person.DateOfBirth").item(0);
        if(typeof node != 'undefined') {
            person.dob = doc.getElementsByTagName("Person.DateOfBirth").item(0).getElementsByTagName("value").item(0).getAttribute("value");
        }

        node = doc.getElementsByTagName("Person.Name").item(0);
        if(typeof node != 'undefined') {
            innerNode = doc.getElementsByTagName("Person.Name").item(0).getElementsByTagName("given").item(0);
            if(typeof innerNode != 'undefined') {
                person.given_name = doc.getElementsByTagName("Person.Name").item(0).getElementsByTagName("given").item(0).childNodes[0].data;
            }
            innerNode = doc.getElementsByTagName("Person.Name").item(0).getElementsByTagName("family").item(0);
            if(typeof innerNode != 'undefined') {
                person.family_name = doc.getElementsByTagName("Person.Name").item(0).getElementsByTagName("family").item(0).childNodes[0].data;
            }
        }

        node = doc.getElementsByTagName("Person.Postcode").item(0);
        if(typeof node != 'undefined') {
            person.postcode = doc.getElementsByTagName("Person.Postcode").item(0).getElementsByTagName("postalCode").item(0).childNodes[0].data;            
        }

        node = doc.getElementsByTagName("Person.Gender").item(0);
        if(typeof node != 'undefined') {
            person.gender = doc.getElementsByTagName("Person.Gender").item(0).getElementsByTagName("value").item(0).getAttribute("code");
        }



    } else {
        console.log("doc == undefined!");
    }
    return person;
}



// Makes a response based on the supplied person object, and the original SOAPAction
// Correctly returns error response with DEMOG-9999 for no match
function makeResponse(person, SOAPAction) {

    //console.log(JSON.stringify(person));
    var response;
    var msg_id = uuidv4();
    if(person == null) {
        console.log("Person was null, so we have an empty response value...");
        //Person wasn't found, so we have an empty response value...
        var obj = {
            message_id: msg_id,
            error_code: "DEMOG-9999"
        };
        response = mustache.render(templates.errorTemplates[SOAPAction], obj);
    } else {
        // Person has been found, generate a response...
        person.message_id = msg_id;
        response = mustache.render(templates.responseTemplates[SOAPAction], person);
    }
    console.log("Response; [" + response + "]");

    var dataToWrap = {
        tracking_id: uuidv4(),
        message_id: msg_id,
        response_body: response,
        profile_urn: templates.profiles[SOAPAction]
    };

    var wrappedResponse = mustache.render(templates.envelopeTemplate, dataToWrap);

    var reply = {
        "statusCode": 200,
        "headers": { "Content-Type": "application/soap+xml" },
        "body": wrappedResponse
    };
    return reply;
}


module.exports = {
    getPerson: getPerson,
    makeResponse: makeResponse,
    getMsgID: getMsgID
};

