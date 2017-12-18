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

var favicon = require ('./favicon.js');

module.exports.entrypoint = (event, context, callback) => {

    context.callbackWaitsForEmptyEventLoop = false;

    console.log("Event: ", JSON.stringify(event));
    
    if(typeof event.Records != 'undefined') {
        callback(null, null);
    } else {
            // This is the favicon
        var b64Data = favicon.b64Data;

    	var body = "<html><head>" +
    	"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">" +
    	"<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" " +
        "integrity=\"sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M\" crossorigin=\"anonymous\">" +
        "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>" +
        "<link id=\"favicon\" rel=\"shortcut icon\" type=\"image/png\" href=\"data:​image/png;base64," + b64Data + "\">" +
        "<link rel=\"stylesheet\" href=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css\">" +
        "<script src=\"https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js\"></script>" +
    	"<title>SMSP Mock - PDS sample data</title></head><body>" +
    	"<div class=\"container\">" +
    	"<div class=\"jumbotron\"><h1><a href=\"Homepage\">PDS Sample data</a></h1></div>" +
        
    	"<table class=\"display table table-bordered table-condensed\">" +
    	"    <thead>" +
    	"        <tr>" +
    	"            <th data-field=\"nhs_number\">NHS Number</th>" +
    	"            <th data-field=\"SOAPAction\">Given name</th>" +
    	"            <th data-field=\"Timestamp\">Family name</th>" +
    	"        </tr>" +
    	"    </thead>" +
        "    <tbody id=\"tbl\"></tbody>" +
    	"</table>" +

    	"</div></body>" +
        "<script>" +
        "function loadpds() {" +
        "   $(\"#tbl\").empty();" +
        "   $.ajax({" +
        "       url: 'pdsdata'," +
        "       dataType: 'json'," +
        "       success: function(data) {" +
        "           for (var i = 0; i < data.length; i++) {" +
        "               var markup = \"<tr><td><a href='pdsdata?nhs_number=\"+ data[i].nhs_number +\"'>\" + data[i].nhs_number + \"</a></td><td>\" + data[i].given_name + \"</td><td>\" + data[i].family_name + \"</td></tr>\";" +
        "               $(\"#tbl\").append(markup);" +
        "           }" +
        "       }," +
        "       error: function(e) {" +
        "           console.log(e.responseText);" +
        "       }" +
        "   });" +
        "}" +

        "loadpds();" +

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
