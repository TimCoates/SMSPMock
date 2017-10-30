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

module.exports.entrypoint = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Event: ", JSON.stringify(event));
    
    if(typeof event.Records != 'undefined') {
        callback(null, null);
    } else {
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
        " <div class='row'><form action='#'>\n" +
        "  <div class='col-sm-9'>\n" +
        // Here we have a code window
        "   <pre id= 'reqBlock' class='.pre-scrollable'></pre>" +
        "  </div>" // Ends the wide column
        "  <div class='col-sm-3'>\n" +
        // Here we have a list of radio buttons, plus a Submit button
        "   <div>\n" +
        "    <input type='radio' name='request' id='request' value='0'>Request 0<br />\n" +
        "    <input type='radio' name='request' id='request' value='1'>Request 1<br />\n" +
        "    <input type='radio' name='request' id='request' value='2'>Request 2<br />\n" +
        "    <input type='radio' name='request' id='request' value='3'>Request 3<br />\n" +
        "</div>\n" +
        "   <div><button id='selectRequest' type='button'>Submit!</button></div>\n" +
        "   </form>\n" +
        "  </div>\n" // Ends the narrow column
        " </div>\n" + // Ends row
    	"</div>\n" + // Ends Container
        "</body>\n" +
        "</html>";

        var reply = {
            "statusCode": 200,
            "headers": { "Content-Type": "text/html" },
            "body": body
        };
        callback(null, reply);
    }
};
