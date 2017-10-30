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
        	" <div class=\"jumbotron\"><h1><a href=\"Homepage\">Send tests</a></h1></div>\n" +
            " <div class='row'><form id='myForm' action='#'>\n" +
            "  <div class='col' style='width:80%'>\n" +
            // Here we have a code window
            "   <figure class='highlight'><pre id='reqBody' class='.pre-scrollable'>" +
            "   </pre></figure>" +
            "  </div>" + // Ends the wide column
            "  <div class='col' style='width:20%'>\n" +
            // Here we have a list of radio buttons, plus a Submit button
            "   <div>\n" +
            "    <input type='radio' name='request' id='request' value='0'>getPatientDetails Partial match<br />\n" +
            "    <input type='radio' name='request' id='request' value='1'>getPatientDetails Full match<br />\n" +
            "    <input type='radio' name='request' id='request' value='2'>getPatientDetails No match<br />\n" +
            "    <input type='radio' name='request' id='request' value='3'>getPatientDetailsBySearch Match<br />\n" +
            "    <input type='radio' name='request' id='request' value='4'>getPatientDetailsByNHSNumber Match<br />\n" +
            "    <input type='radio' name='request' id='request' value='5'>getPatientDetailsByNHSNumber No match<br />\n" +
            "    <input type='radio' name='request' id='request' value='6'>getNHSNumber Match<br />\n" +
            "    <input type='radio' name='request' id='request' value='7'>verifyNHSNumber Match<br />\n" +
            "</div>\n" +
            "   <div><button id='selectRequest' type='button'>Submit!</button></div>\n" +
            "   </form>\n" +
            "  </div>\n" + // Ends the narrow column
            " </div>\n" + // Ends row
        	"</div>\n" + // Ends Container
            "</body>\n" +
            "<script>\n" +
            "$('#myForm input').on('change', function() {\n" +
//            "   alert($('input[name=request]:checked', '#myForm').val());\n" +
            "   var id = $('input[name=request]:checked', '#myForm').val()\n;" + 
            "   var theUrl = window.location.href + '?id=' + id;\n" +
//            "   console.log(theUrl);\n" +
//            "   $.ajax({\n" +
//            "       method: 'GET',\n" +
//            "       url: theUrl\n" +
//            "   })\n" +
//            "   .done(function(msg) {\n" +
//            "       console.log('Message: ' + msg);" +
//            "       $('#reqBody').html = msg;\n" +
//            "   });\n" +
            "   $('#reqBody').load(theUrl);" +
            "});\n" +
            "</script>" +
            "</html>";

            var reply = {
                "statusCode": 200,
                "headers": { "Content-Type": "text/html" },
                "body": body
            };
            callback(null, reply);
        } else {
            var tpl = templates.requestTemplates[id];

            var msg_id = uuidv4();
            var dataToWrap = {
                msgID: msg_id
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