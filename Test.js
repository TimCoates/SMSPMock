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
var templates = require ('./templates.js');
var favicon = require ('./favicon.js');

var mustache = require("mustache");
const uuidv4 = require('uuid/v4');

module.exports.entrypoint = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;
    console.log("Event: ", JSON.stringify(event));
    
    // Check if this was just a wakeup SNS trigger...
    if(typeof event.Records != 'undefined') {
        callback(null, null);
    } else {

        // No, so assume it was a real request


        // If we had query parameter of ?id=xyz then this will fetch that template request, otherwise it shows the page
        var id = null;

        if(typeof event.queryStringParameters != 'undefined') {
            if(event.queryStringParameters != null) {
                if(typeof event.queryStringParameters.id != 'undefined') {
                    id = event.queryStringParameters.id;
                }
            }
        }


        // Determine which we're doing
        console.log("Requesting ID: " + id);
        if(id == null) {
            // We're showing the test page

            // This is the favicon
            var b64Data = favicon.b64Data;

            // Here's the page html
        	var body = "<html><head>\n" +
        	"<meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>\n" +
        	"<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css' " +
            "integrity='sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M' crossorigin='anonymous'>\n" +
            "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js'></script>\n" +
            "<link id='favicon' rel='shortcut icon' type='image/png' href='data:​image/png;base64," + b64Data + "'>\n" +
            "<link rel='stylesheet' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css'>\n" +
            "<script src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js'></script>\n" +
        	"<title>SMSP Mock - Send tests</title>\n</head>\n"+
            "<body>\n" +
        	"<div class='container'>\n" +
            " <form id='myForm' action='#'>\n" +
        	" <div class='jumbotron'><h1><a href='Homepage'>Send tests</a></h1></div>\n" +
        	" <div class='py-5'>\n" +
            "  <div class='row'>\n" +
            "   <div class='col-xs-9'>\n" +
            // Here we have a code window
            "    <textarea style='font-size: x-small; background-color: #e0e0e0;' id='reqBody' rows='30' cols='80'></textarea>\n" +
            "   </div>\n" + // Ends the wide column
            "   <div class='col-xs-3' style='padding-left: 30px;'>\n" + // The narrow column for options
            // Here we have a list of radio buttons, plus a Submit button
            "    <div>\n" +
            "     <div><label for='r0' style='font-size: x-small;'><input type='radio' name='request' id='r0' value='0'>" +
            "getPatientDetails Partial match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><label for='r1' style='font-size: x-small;'><input type='radio' name='request' id='r1' value='1'>" +
            "getPatientDetails Full match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><label for='r2' style='font-size: x-small;'><input type='radio' name='request' id='r2' value='2'>" +
            "getPatientDetails No match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><label for='r3' style='font-size: x-small;'><input type='radio' name='request' id='r3' value='3'>" +
            "getPatientDetailsBySearch Match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><label for='r4' style='font-size: x-small;'><input type='radio' name='request' id='r4' value='4'>" +
            "getPatientDetailsByNHSNumber Match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><label for='r5' style='font-size: x-small;'><input type='radio' name='request' id='r5' value='5'>" +
            "getPatientDetailsByNHSNumber No match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><label for='r6' style='font-size: x-small;'><input type='radio' name='request' id='r6' value='6'>" +
            "getNHSNumber Match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><label for='r7' style='font-size: x-small;'><input type='radio' name='request' id='r7' value='7'>" +
            "verifyNHSNumber Match</label></div>\n" +
            "     <div><hr></div>\n" +
            "    </div>\n" +
            "   </div>\n" + // Ends the narrow column
            "   <div class='col-xs-3'>\n" +
            "    <div><button id='selectRequest' type='button'>Submit!</button></div>\n" +
            "   </div>\n" + // Ends the narrow column
            "  </div>\n" + // Ends row
            "  <div class='row'>\n" + // New row
            "    <div class='col-xs-9'>\n" +
            "     <textarea style='font-size: x-small; background-color: #e0e0e0;' id='response' name='response' rows='20' cols='80'></textarea>" +
            "   </div>\n" + // Ends the wide column
            "  </div>\n" + // Ends row
            " </div>\n" + // Ends py-5
            " </form>\n" +
        	"</div>\n" + // Ends Container
            "</body>\n" +
            "<script>\n" +
            "var id = 0;\n\n" +
            "$('#myForm input').on('change', function() {\n" +
            "   id = $('input[name=request]:checked', '#myForm').val()\n;" + 
            "   var theUrl = window.location.href + '?id=' + id;\n" +
            "   console.log('Fetching: ' + window.location.href + '?id=' + id);\n" +
            "   $('#reqBody').load(theUrl);\n" +
            "});\n" +
            "\n" +
            "$('#selectRequest').click(function() {\n" +
            "    var SOAPAction = null;\n" +
            "    switch(id) {\n" +
            "        case '0':\n" +
            "        case '1':\n" +
            "        case '2':\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getPatientDetails-v1-0';\n" +
            "            break;\n\n" +
            "        case '3':\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0';\n" +
            "            break;\n\n" +
            "        case '4':\n" +
            "        case '5':\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0';\n" +
            "            break;\n\n" +
            "        case '6':\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getNHSNumber-v1-0';\n" +
            "            break;\n\n" +
            "        case '7':\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:verifyNHSNumber-v1-0';\n" +
            "            break;\n" +
            "    }\n" +
            "    console.log('Adding SOAPAction header: ' + SOAPAction);\n" +
            "    $.ajaxSetup({\n" +
            "        headers: { 'SOAPAction': SOAPAction }\n" +
            "    });\n\n" +
            "    var svcURL = 'https://' + window.location.hostname + '/" + process.env.stageName + "/service'; \n" +
            "    console.log('POSTing to: ' + svcURL);\n" +
            "    $.ajax({\n" +
            "        url: svcURL,\n" +
            "        data: $('textarea#reqBody').val(),\n" +
            "        dataType: 'xml', \n" +
            "        type: 'POST',\n" +
            "        success: function(xml) {\n" +
            "            $('textarea[name=\"response\"]').val(xml.firstChild.outerHTML);\n" +
            "            console.log(JSON.stringify(xml.firstChild.outerHTML));\n" +
            "        }\n" +
            "    });\n" +
            "});\n" +
            "</script>\n" +
            "</html>\n";

            var reply = {
                "statusCode": 200,
                "headers": { "Content-Type": "text/html" },
                "body": body
            };
            callback(null, reply);
        } else {
            var tpl = templates.requestTemplates[id];

            var msg_id = uuidv4();
            var manifest_id = uuidv4();

            var d = new Date();
            var created = d.toISOString();

            var days = 2;
            var newDate = new Date(d.setTime( d.getTime() + days * 86400000 ));
            var expires = newDate.toISOString();

            var from_addr = null;
            var to_addr = null;
            if(typeof event.headers['Referer'] != 'undefined') {
                from_addr = event.headers['Referer'];
                var posn = from_addr.indexOf("/Test");
                to_addr = from_addr.substring(0, posn) + "/service"; 
            }

            var dataToWrap = {
                msgID: msg_id,
                manifest_id: manifest_id,
                created: created,
                expires: expires,
                from: from_addr,
                to:to_addr
            };

            var body = mustache.render(tpl, dataToWrap);
            var reply = {
                "statusCode": 200,
                "headers": { "Content-Type": "application/xml" },
                "body": body
            };
            callback(null, reply);
        }
    }
};