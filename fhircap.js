'use strict';
//Copyright 2018 Tim Coates
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

var capTemplate = require("./CapTemplate.json");

module.exports = {
	entrypoint: entrypoint
};

/**
Function to do a READ
 */
function entrypoint(event, context, callback) {

	context.callbackWaitsForEmptyEventLoop = false;
	console.log("Event: ", JSON.stringify(event));

	var baseURL = event.headers["X-Forwarded-Proto"] + "://" + event.headers.Host + event.requestContext.path;
	capTemplate.url = baseURL + "/Capability";
	capTemplate.date = "2018-09-10";

	var response = JSON.stringify(capTemplate);


	var reply = {
		statusCode: 200,
		headers: { "Content-Type": "application/json" },
		body: response
	};
	callback(null, reply);
}