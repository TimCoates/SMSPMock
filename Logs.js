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

            // This is the favicon
            var b64Data = "AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/"+
"4QAAGM7DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIgAAAAAAARESAAAAAAABERIAAAAAAA"+
"EREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIiIiARERERERERIBEREREREREgE"+
"RERERERESARERERERERD+HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwAAACAAAAAgAAAAIAAAACAAQAA";

        // The html page, with embedded JavaScript.
    	var body = "<html>\n<head>\n" +
    	"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n" +
    	"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
        "integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">\n" +
        "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>\n" +
        "<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">\n" +
        "<link rel=\"stylesheet\" href=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css\">\n" +
        "<script src=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>\n" +
    	"<title>SMSP Mock - Logs</title>\n"+
        "</head>\n"+
        "<body>\n" +
    	"<div class=\"container\">" +
    	" <div class=\"jumbotron\"><h1><a href=\"Homepage\">Logs<a/></h1></div>\n" + 
    	" <table class=\"display table table-bordered table-condensed\" style='font-size: small;'>\n" +
    	"  <thead>\n" +
    	"   <tr>\n" +
    	"    <th data-field=\"id\">id</th>\n" +
    	"    <th data-field=\"SOAPAction\">SOAPAction</th>\n" +
    	"    <th data-field=\"Timestamp\">request_time</th>\n" +
    	"   </tr>\n" +
    	"  </thead>\n" +
        "  <tbody id=\"tbl\"></tbody>\n" +
    	" </table>\n" +
    	"</div>\n"+
        "</body>\n\n" +
        "<script>\n" +
        "function loadlogs() {\n" +
        "   $(\"#tbl\").empty();\n" +
        "   $.ajax({\n" +
        "       url: 'logdata',\n" +
        "       dataType: 'json',\n" +
        "       success: function(data) {\n" +
        "           for (var i = 0; i < data.length; i++) {\n" +
        "               var markup = \"<tr><td><a href='logdata?id=\"+ data[i].id +\"'>\" + data[i].id + \"</a></td><td>\" + data[i].SOAPAction + \"</td><td>\" + data[i].request_time + \"</td></tr>\";\n" +
        "               $(\"#tbl\").append(markup);\n" +
        "           }\n" +
        "       },\n" +
        "       error: function(e) {\n" +
        "           console.log(e.responseText);\n" +
        "       }\n" +
        "   });\n" +
        "}\n\n" +
        "loadlogs();\n\n" + // When page loads, this is called...
        "setInterval(function(){\n" + // Sets a loop to reload list of logs every 10 seconds
        "   loadlogs();\n" +
        "}, 10000);\n" +
        "</script>" +
        "</html>";

        // Generate the response object
        var reply = {
            "statusCode": 200,
            "headers": { "Content-Type": "text/html" },
            "body": body
        };
        callback(null, reply);
    }
};
