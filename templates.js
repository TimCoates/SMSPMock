var responseTemplates = [];
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

// Requires:
// message_id
// validity (true/false)
// nhs_number
responseTemplates["urn:nhs-itk:services:201005:verifyNHSNumber-v1-0"] = "<verifyNHSNumberResponse-v1-0 \nxmlns=\"urn:hl7-org:v3\" \nxmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" \nxsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000013GB01.xsd\" \nmoodCode=\"EVN\" classCode=\"OBS\">\n" +
"<id root=\"{{message_id}}\"/>\n" +
"<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"verifyNHSNumberResponse-v1-0\"/>\n" +
"<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"SMSP-0000\"/>\n" +
"<component typeCode=\"COMP\">\n" +
"<validIdentifier moodCode=\"EVN\" classCode=\"OBS\">\n" +
"<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.287\" code=\"VI\"/>\n" +
"<value value=\"{{validity}}\"/>\n" +
"<subject typeCode=\"SBJ\">\n" +
"<patient classCode=\"PAT\">\n" +
"<id root=\"2.16.840.1.113883.2.1.4.1\" extension=\"{{nhs_number}}\"/>\n" +
"</patient>\n" +
"</subject>\n" +
"</validIdentifier>\n" +
"</component>\n" +
"</verifyNHSNumberResponse-v1-0>\n";

// Requires:
// message_id
// nhs_number
responseTemplates["urn:nhs-itk:services:201005:getNHSNumber-v1-0"] = "<getNHSNumberResponse-v1-0 xmlns=\"urn:hl7-org:v3\"" +
" \nxmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" \nxsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000014GB01.xsd\" \nmoodCode=\"EVN\" classCode=\"OBS\">\n" +
"<id root=\"{{message_id}}\"/>\n" +
"<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getNHSNumberResponse-v1-0\"/>\n" +
"<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"SMSP-0000\"/>\n" +
"<subject typeCode=\"SBJ\">\n" +
"<patient classCode=\"PAT\">\n" +
"<id root=\"2.16.840.1.113883.2.1.4.1\" extension=\"{{nhs_number}}\"/>\n" +
"</patient>\n" +
"</subject>\n" +
"</getNHSNumberResponse-v1-0>\n";

// Template for a response, insert the values:
// message_id
// family_name
// given_name
// dob
// gender
// nhs_number
// postcode
responseTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"] = "<getPatientDetailsResponse-v1-0 xmlns=\"urn:hl7-org:v3\" \nxmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" \nxsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000016GB01.xsd\" \nmoodCode=\"EVN\" classCode=\"OBS\">" +
"<id root=\"{{message_id}}\"/>\n" +
"<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsResponse-v1-0\"/>\n" +
"<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"SMSP-0000\"/>\n" +
"<subject typeCode=\"SBJ\">\n" +
"<patient classCode=\"PAT\">\n<id root=\"2.16.840.1.113883.2.1.4.1\" extension=\"{{nhs_number}}\"/>\n" +
"<name>\n<given>{{given_name}}</given>\n<family>{{family_name}}</family>\n</name>\n" +
"<addr use=\"H\">\n<postalCode>{{postcode}}</postalCode>\n" +
"<streetAddressLine>{{address1}}</streetAddressLine>\n" +
"<streetAddressLine>{{address2}}</streetAddressLine>\n" +
"<streetAddressLine>{{address3}}</streetAddressLine>\n" +
"<streetAddressLine>{{address4}}</streetAddressLine>\n" +
"<streetAddressLine>{{address5}}</streetAddressLine>\n</addr>\n" +
"<patientPerson determinerCode=\"INSTANCE\" classCode=\"PSN\">\n" +
"<administrativeGenderCode code=\"{{gender}}\" codeSystem=\"2.16.840.1.113883.2.1.3.2.4.16.25\"/>\n" +
"<birthTime value=\"{{dob}}\"/>\n" +
"<gPPractice classCode=\"SDLOC\">\n" +
"<addr>\n<postalCode></postalCode>\n" +
"<streetAddressLine></streetAddressLine>\n" +
"<streetAddressLine></streetAddressLine>\n" +
"<streetAddressLine></streetAddressLine>\n" +
"<streetAddressLine/><streetAddressLine/>\n</addr>\n" +
"<locationOrganization determinerCode=\"INSTANCE\" classCode=\"ORG\">\n" +
"<id root=\"2.16.840.1.113883.2.1.3.2.4.19.2\" extension=\"{{primary_care_code}}\"/>\n" +
"<name></name>\n</locationOrganization>\n</gPPractice>\n" +
"</patientPerson>\n</patient>\n</subject>\n</getPatientDetailsResponse-v1-0>\n";

responseTemplates["urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0"] = responseTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"];
responseTemplates["urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0"] = responseTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"];

// Array of error templates, one per SOAPAction
// Requires:
// message_id
// error_code
var errorTemplates = [];
errorTemplates["urn:nhs-itk:services:201005:verifyNHSNumber-v1-0"] = "<verifyNHSNumberResponse-v1-0 xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000013GB01.xsd\" moodCode=\"EVN\" classCode=\"OBS\">\n" +
"<id root=\"{{message_id}}\"/>\n" +
"<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"verifyNHSNumberResponse-v1-0\"/>\n" +
"<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"{{error_code}}\"/>\n" +
"</verifyNHSNumberResponse-v1-0>\n";

// Requires:
// message_id
// error_code
errorTemplates["urn:nhs-itk:services:201005:getNHSNumber-v1-0"] = "<getNHSNumberResponse-v1-0 xmlns=\"urn:hl7-org:v3\"" +
" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000014GB01.xsd\" moodCode=\"EVN\" classCode=\"OBS\">\n" +
"<id root=\"{{message_id}}\"/>\n" +
"<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getNHSNumberResponse-v1-0\"/>\n" +
"<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"{{error_code}}\"/>\n" +
"</getNHSNumberResponse-v1-0>\n";

// Template for an error response, insert the values:
// message_id (A guid)
// error_code (eg SMSP-0000 or others)
errorTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"] = "<getPatientDetailsResponse-v1-0 xmlns=\"urn:hl7-org:v3\"" +
" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000016GB01.xsd\"" +
" moodCode=\"EVN\" classCode=\"OBS\">\n" +
"<id root=\"{{message_id}}\"/>\n<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsResponse-v1-0\"/>\n" +
"<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"{{error_code}}\"/>\n" +
"</getPatientDetailsResponse-v1-0>\n";
errorTemplates["urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0"] = errorTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"];
errorTemplates["urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0"] = errorTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"];

var profiles = [];
profiles["urn:nhs-itk:services:201005:verifyNHSNumber-v1-0"] = "urn:nhs-en:profile:verifyNHSNumberResponse-v1-0";
profiles["urn:nhs-itk:services:201005:getNHSNumber-v1-0"] = "urn:nhs-en:profile:getNHSNumberResponse-v1-0";
profiles["urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0"] = "urn:nhs-en:profile:getPatientDetailsResponse-v1-0";
profiles["urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0"] = "urn:nhs-en:profile:getPatientDetailsResponse-v1-0";
profiles["urn:nhs-itk:services:201005:getPatientDetails-v1-0"] = "urn:nhs-en:profile:getPatientDetailsResponse-v1-0";

// This template just needs
// message_id
// tracking_id
// response_body
// profile_urn
var envelopeTemplate = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"" +
" xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"" +
" xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\"" +
" xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\"" +
" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" xmlns:itk=\"urn:nhs-itk:ns:201005\"" +
" xmlns:hl7=\"urn:hl7-org:v3\">\n" +
"<soap:Header>\n" +
"<wsa:MessageID>{{message_id}}</wsa:MessageID>\n" +
"<wsa:Action>{{profile_urn}}</wsa:Action>\n" +
"</soap:Header>\n" +
"<soap:Body>\n" +
"<itk:DistributionEnvelope>\n" +
"<itk:header service=\"{{profile_urn}}\" trackingid=\"{{tracking_id}}\">\n" +
"<itk:manifest count=\"1\">\n" +
"<itk:manifestitem id=\"uuid_{{message_id}}\"" +
" mimetype=\"text/xml\"" +
" profileid=\"{{profile_urn}}\"" +
" base64=\"false\"" +
" compressed=\"false\"" +
" encrypted=\"false\"/>\n" +
"</itk:manifest>\n</itk:header>\n<itk:payloads count=\"1\">\n<itk:payload id=\"uuid_{{message_id}}\">\n{{{response_body}}}\n</itk:payload>\n</itk:payloads>\n" +
"</itk:DistributionEnvelope>\n" +
"</soap:Body>\n" +
"</soap:Envelope>\n";


module.exports = {
	responseTemplates:responseTemplates,
	errorTemplates:errorTemplates,
	profiles:profiles,
	envelopeTemplate:envelopeTemplate
}