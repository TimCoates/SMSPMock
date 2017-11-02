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
var mustache = require("mustache");
const uuidv4 = require('uuid/v4');

module.exports.entrypoint = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Event: ", JSON.stringify(event));
    
    if(typeof event.Records != 'undefined') {
        callback(null, null);
    } else {

        var id = null;

        if(typeof event.queryStringParameters != 'undefined') {
            if(event.queryStringParameters != null) {
                if(typeof event.queryStringParameters.id != 'undefined') {
                    id = event.queryStringParameters.id;
                }
            }
        }

        console.log("Requesting ID: " + id);

        if(id == null) {

            var b64Data = "AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAGM7DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIiIiARERERERERIBEREREREREgERERERERESARERERERERD+HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwAAACAAAAAgAAAAIAAAACAAQAA";

        	var body = "<html><head>" +
        	"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">" +
        	"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
            "integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">" +
            "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>" +
            "<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">" +
            "<link rel=\"stylesheet\" href=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css\">" +
            "<script src=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>" +
        	"<title>SMSP Mock - Send tests</title></head><body>" +
        	"<div class=\"container\">\n" +
            " <form id='myForm' action='#'>\n" +
        	" <div class=\"jumbotron\"><h1><a href=\"Homepage\">Send tests</a></h1></div>\n" +
        	" <div class=\"py-5\">\n" +
            "  <div class='row'>\n" +
            "   <div class='col-xs-9'>\n" +
            // Here we have a code window
            "    <textarea style='font-size: x-small; background-color: #e0e0e0;' id='reqBody' rows='30' cols='80'></textarea>\n" +
            "   </div>\n" + // Ends the wide column
            "   <div class='col-xs-3' style='padding-left: 30px;'>\n" + // The narrow column for options
            // Here we have a list of radio buttons, plus a Submit button
            "    <div>\n" +
            "     <div><input type='radio' name='request' id='request' value='0'>" +
            "<label for='0' style='font-size: x-small;'>getPatientDetails Partial match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><input type='radio' name='request' id='request' value='1'>" +
            "<label for='0' style='font-size: x-small;'>getPatientDetails Full match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><input type='radio' name='request' id='request' value='2'>" +
            "<label for='0' style='font-size: x-small;'>getPatientDetails No match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><input type='radio' name='request' id='request' value='3'>" +
            "<label for='0' style='font-size: x-small;'>getPatientDetailsBySearch Match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><input type='radio' name='request' id='request' value='4'>" +
            "<label for='0' style='font-size: x-small;'>getPatientDetailsByNHSNumber Match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><input type='radio' name='request' id='request' value='5'>" +
            "<label for='0' style='font-size: x-small;'>getPatientDetailsByNHSNumber No match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><input type='radio' name='request' id='request' value='6'>" +
            "<label for='0' style='font-size: x-small;'>getNHSNumber Match</label></div>\n" +
            "     <div><hr></div>\n" +
            "     <div><input type='radio' name='request' id='request' value='7'>" +
            "<label for='0' style='font-size: x-small;'>verifyNHSNumber Match</label></div>\n" +
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
            "        case \"0\":\n" +
            "        case \"1\":\n" +
            "        case \"2\":\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getPatientDetails-v1-0';\n" +
            "            break;\n\n" +
            "        case \"3\":\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0';\n" +
            "            break;\n\n" +
            "        case \"4\":\n" +
            "        case \"5\":\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0';\n" +
            "            break;\n\n" +
            "        case \"6\":\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:getNHSNumber-v1-0';\n" +
            "            break;\n\n" +
            "        case \"7\":\n" +
            "            SOAPAction = 'urn:nhs-itk:services:201005:verifyNHSNumber-v1-0';\n" +
            "            break;\n" +
            "    }\n" +
            "    console.log(\"Adding SOAPAction header: \" + SOAPAction);\n" +
            "    $.ajaxSetup({\n" +
            "        headers: { 'SOAPAction': SOAPAction }\n" +
            "    });\n\n" +
            "    var svcURL = 'https://' + window.location.hostname + '/" + process.env.stageName + "/service'; \n" +
            "    console.log('POSTing to: ' + svcURL);\n" +
            "    $.ajax({\n" +
            "        url: svcURL,\n" +
            "        data: $('textarea#reqBody').val(),\n" +
            "        dataType: \"xml\", \n" +
            "        type: \"POST\",\n" +
            "        success: function(xml) {\n" +
            "            $(\"textarea[name='response']\").val(xml.firstChild.outerHTML);\n" +
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

            var dataToWrap = {
                msgID: msg_id,
                manifest_id: manifest_id,
                created: created,
                expires: expires
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