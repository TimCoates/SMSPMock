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

    // See: https://stackoverflow.com/questions/33247486/bootstrap-table-json-from-ajax
        var b64Data = "AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAGM7DwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIAAAAAAAEREgAAAAAAARESAAAAAAABERIiIiARERERERERIBEREREREREgERERERERESARERERERERD+HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwfAAD8HwAA/B8AAPwAAACAAAAAgAAAAIAAAACAAQAA";
    	var body = "<html><head>" +
    	"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">" +
    	"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
        "integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">" +
        "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>" +
        "<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">" +
        "<link rel=\"stylesheet\" href=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css\">" +
        "<script src=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>" +
    	"<title>SMSP Mock - Logs</title></head><body>" +
    	"<div class=\"container\">" +
    	"<div class=\"jumbotron\"><h1><a href=\"Homepage\">Logs<a/></h1></div>" +
        
    	"<table class=\"display table table-bordered table-condensed\" style='font-size: small;'>" +
    	"    <thead>" +
    	"        <tr>" +
    	"            <th data-field=\"id\">id</th>" +
    	"            <th data-field=\"SOAPAction\">SOAPAction</th>" +
    	"            <th data-field=\"Timestamp\">request_time</th>" +
    	"        </tr>" +
    	"    </thead>" +
        "    <tbody id=\"tbl\"></tbody>" +
    	"</table>" +

    	"</div></body>" +
        "<script>" +
        "function loadlogs() {" +
        "   $(\"#tbl\").empty();" +
        "   $.ajax({" +
        "       url: 'logdata'," +
        "       dataType: 'json'," +
        "       success: function(data) {" +
        "           for (var i = 0; i < data.length; i++) {" +
        "               var markup = \"<tr><td><a href='logdata?id=\"+ data[i].id +\"'>\" + data[i].id + \"</a></td><td>\" + data[i].SOAPAction + \"</td><td>\" + data[i].request_time + \"</td></tr>\";" +
        "               $(\"#tbl\").append(markup);" +
        "           }" +
        "       }," +
        "       error: function(e) {" +
        "           console.log(e.responseText);" +
        "       }" +
        "   });" +
        "}" +

        "loadlogs();" +

        "setInterval(function(){" +
        "   loadlogs();" +
        "}, 10000);" +
        "</script>" +
        "</html>";

        var reply = {
            "statusCode": 200,
            "headers": { "Content-Type": "text/html" },
            "body": body
        };
        callback(null, reply);
    }
};
