var responseTemplates = [];
var requestTemplates = [];
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
responseTemplates["urn:nhs-itk:services:201005:verifyNHSNumber-v1-0"] = "<verifyNHSNumberResponse-v1-0 \nxmlns=\"urn:hl7-org:v3\" "+
"\nxmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" \nxsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000013GB01.xsd\" \nmoodCode=\"EVN\" classCode=\"OBS\">\n" +
"	<id root=\"{{message_id}}\"/>\n" +
"	<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"verifyNHSNumberResponse-v1-0\"/>\n" +
"	<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"SMSP-0000\"/>\n" +
"	<component typeCode=\"COMP\">\n" +
"		<validIdentifier moodCode=\"EVN\" classCode=\"OBS\">\n" +
"		<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.287\" code=\"VI\"/>\n" +
"		<value value=\"{{validity}}\"/>\n" +
"			<subject typeCode=\"SBJ\">\n" +
"				<patient classCode=\"PAT\">\n" +
"					<id root=\"2.16.840.1.113883.2.1.4.1\" extension=\"{{nhs_number}}\"/>\n" +
"				</patient>\n" +
"			</subject>\n" +
"		</validIdentifier>\n" +
"	</component>\n" +
"</verifyNHSNumberResponse-v1-0>\n";

// Requires:
// message_id
// nhs_number
responseTemplates["urn:nhs-itk:services:201005:getNHSNumber-v1-0"] = "<getNHSNumberResponse-v1-0 xmlns=\"urn:hl7-org:v3\"" +
" \nxmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" \nxsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000014GB01.xsd\" \nmoodCode=\"EVN\" classCode=\"OBS\">\n" +
"	<id root=\"{{message_id}}\"/>\n" +
"	<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getNHSNumberResponse-v1-0\"/>\n" +
"	<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"SMSP-0000\"/>\n" +
"	<subject typeCode=\"SBJ\">\n" +
"		<patient classCode=\"PAT\">\n" +
"			<id root=\"2.16.840.1.113883.2.1.4.1\" extension=\"{{nhs_number}}\"/>\n" +
"		</patient>\n" +
"	</subject>\n" +
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
"		<id root=\"{{message_id}}\"/>\n" +
"			<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsResponse-v1-0\"/>\n" +
"			<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"SMSP-0000\"/>\n" +
"			<subject typeCode=\"SBJ\">\n" +
"				<patient classCode=\"PAT\">\n<id root=\"2.16.840.1.113883.2.1.4.1\" extension=\"{{nhs_number}}\"/>\n" +
"				<name>\n<given>{{given_name}}</given>\n<family>{{family_name}}</family>\n</name>\n" +
"				<addr use=\"H\">\n"+
"					<postalCode>{{postcode}}</postalCode>\n" +
"					<streetAddressLine>{{address1}}</streetAddressLine>\n" +
"					<streetAddressLine>{{address2}}</streetAddressLine>\n" +
"					<streetAddressLine>{{address3}}</streetAddressLine>\n" +
"					<streetAddressLine>{{address4}}</streetAddressLine>\n" +
"					<streetAddressLine>{{address5}}</streetAddressLine>\n"+
"				</addr>\n" +
"				<patientPerson determinerCode=\"INSTANCE\" classCode=\"PSN\">\n" +
"				<administrativeGenderCode code=\"{{gender}}\" codeSystem=\"2.16.840.1.113883.2.1.3.2.4.16.25\"/>\n" +
"				<birthTime value=\"{{dob}}\"/>\n" +
"				<gPPractice classCode=\"SDLOC\">\n" +
"				<addr>\n"+
"					<postalCode></postalCode>\n" +
"					<streetAddressLine></streetAddressLine>\n" +
"					<streetAddressLine></streetAddressLine>\n" +
"					<streetAddressLine></streetAddressLine>\n" +
"					<streetAddressLine/><streetAddressLine/>\n"+
"				</addr>\n" +
"					<locationOrganization determinerCode=\"INSTANCE\" classCode=\"ORG\">\n" +
"						<id root=\"2.16.840.1.113883.2.1.3.2.4.19.2\" extension=\"{{primary_care_code}}\"/>\n" +
"						<name></name>\n"+
"					</locationOrganization>\n"+
"				</gPPractice>\n" +
"			</patientPerson>\n"+
"		</patient>\n"+
"	</subject>\n"+
"</getPatientDetailsResponse-v1-0>\n";

responseTemplates["urn:nhs-itk:services:201005:getPatientDetailsByNHSNumber-v1-0"] = responseTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"];
responseTemplates["urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0"] = responseTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"];

// Array of error templates, one per SOAPAction
// Requires:
// message_id
// error_code
var errorTemplates = [];
errorTemplates["urn:nhs-itk:services:201005:verifyNHSNumber-v1-0"] = "<verifyNHSNumberResponse-v1-0 xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000013GB01.xsd\" moodCode=\"EVN\" classCode=\"OBS\">\n" +
"	<id root=\"{{message_id}}\"/>\n" +
"	<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"verifyNHSNumberResponse-v1-0\"/>\n" +
"	<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"{{error_code}}\"/>\n" +
"</verifyNHSNumberResponse-v1-0>\n";

// Requires:
// message_id
// error_code
errorTemplates["urn:nhs-itk:services:201005:getNHSNumber-v1-0"] = "<getNHSNumberResponse-v1-0 xmlns=\"urn:hl7-org:v3\"" +
" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
" xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000014GB01.xsd\" moodCode=\"EVN\" classCode=\"OBS\">\n" +
"	<id root=\"{{message_id}}\"/>\n" +
"	<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getNHSNumberResponse-v1-0\"/>\n" +
"	<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"{{error_code}}\"/>\n" +
"</getNHSNumberResponse-v1-0>\n";

// Template for an error response, insert the values:
// message_id (A guid)
// error_code (eg SMSP-0000 or others)
errorTemplates["urn:nhs-itk:services:201005:getPatientDetails-v1-0"] = "<getPatientDetailsResponse-v1-0 xmlns=\"urn:hl7-org:v3\"" +
" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"" +
"	xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/COMT_MT000016GB01.xsd\"" +
"	moodCode=\"EVN\" classCode=\"OBS\">\n" +
"	<id root=\"{{message_id}}\"/>\n<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsResponse-v1-0\"/>\n" +
"	<value codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.285\" code=\"{{error_code}}\"/>\n" +
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
"	<soap:Header>\n" +
"		<wsa:MessageID>{{message_id}}</wsa:MessageID>\n" +
"		<wsa:Action>{{profile_urn}}</wsa:Action>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"	<itk:DistributionEnvelope>\n" +
"		<itk:header service=\"{{profile_urn}}\" trackingid=\"{{tracking_id}}\">\n" +
"			<itk:manifest count=\"1\">\n" +
"				<itk:manifestitem id=\"uuid_{{message_id}}\"" +
" mimetype=\"text/xml\"" +
" profileid=\"{{profile_urn}}\"" +
" base64=\"false\"" +
" compressed=\"false\"" +
" encrypted=\"false\"/>\n" +
"			</itk:manifest>\n</itk:header>\n<itk:payloads count=\"1\">\n<itk:payload id=\"uuid_{{message_id}}\">\n{{{response_body}}}\n</itk:payload>\n</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>\n";

requestTemplates[0] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>{{msgID}}</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getPatientDetails-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"{{msgID}}\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:getPatientDetails-v1-0\" trackingid=\"{{msgID}}\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"				<itk:manifest count=\"1\">\n" +
"					<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-en:profile:getNHSNumberRequest-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"				</itk:manifest>\n" +
"				<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"uuid_{{manifest_id}}\">\n" +
"                <getPatientDetails-v1-0 xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
"moodCode=\"EVN\" classCode=\"CACT\">\n" +
"                    <id root=\"{{manifest_id}}\"/>\n" +
"                    <code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsRequest-v1-0\"/>\n" +
"                    <queryEvent>\n" +
"                        <Person.DateOfBirth>\n" +
"                            <value value=\"19551103\"/>\n" +
"                            <semanticsText>Person.DateOfBirth</semanticsText>\n" +
"                        </Person.DateOfBirth>\n" +
"                        <Person.NHSNumber>\n" +
"                            <value root=\"2.16.840.1.113883.2.1.4.1\" extension=\"9449304718\"/>\n" +
"                            <semanticsText>Person.NHSNumber</semanticsText>\n" +
"                        </Person.NHSNumber>\n" +
"                        <Person.Name>\n" +
"                            <value>\n" +
"                                <given>CHINA</given>\n" +
"                                <family>BOOMSA</family>\n" +
"                            </value>\n" +
"                            <semanticsText>Person.Name</semanticsText>\n" +
"                        </Person.Name>\n" +
"                        <Person.Postcode>\n" +
"                            <value>\n" +
"                                <postalCode>KT17 2QN</postalCode>\n" +
"                            </value>\n" +
"                            <semanticsText>Person.Postcode</semanticsText>\n" +
"                        </Person.Postcode>\n" +
"                    </queryEvent>\n" +
"                </getPatientDetails-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>";

// Request for getPatientDetails FULL MATCH
requestTemplates[1] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>{{msgID}}</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getPatientDetails-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"{{msgID}}\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:getPatientDetails-v1-0\" trackingid=\"{{msgID}}\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"				<itk:manifest count=\"1\">\n" +
"					<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-en:profile:getNHSNumberRequest-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"				</itk:manifest>\n" +
"				<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"uuid_{{manifest_id}}\">\n" +
"                <getPatientDetails-v1-0 xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
"moodCode=\"EVN\" classCode=\"CACT\">\n" +
"                    <id root=\"{{ manifest_id }}\"/>\n" +
"                    <code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsRequest-v1-0\"/>\n" +
"                    <queryEvent>\n" +
"                        <Person.DateOfBirth>\n" +
"                            <value value=\"20010801\"/>\n" +
"                            <semanticsText>Person.DateOfBirth</semanticsText>\n" +
"                        </Person.DateOfBirth>\n" +
"                        <Person.NHSNumber>\n" +
"                            <value root=\"2.16.840.1.113883.2.1.4.1\" extension=\"9449305277\"/>\n" +
"                            <semanticsText>Person.NHSNumber</semanticsText>\n" +
"                        </Person.NHSNumber>\n" +
"                        <Person.Name>\n" +
"                            <value>\n" +
"                                <given>BARRIE</given>\n" +
"                                <family>KELSALL</family>\n" +
"                            </value>\n" +
"                            <semanticsText>Person.Name</semanticsText>\n" +
"                        </Person.Name>\n" +
"                        <Person.Postcode>\n" +
"                            <value>\n" +
"                                <postalCode>KT18 6PP</postalCode>\n" +
"                            </value>\n" +
"                            <semanticsText>Person.Postcode</semanticsText>\n" +
"                        </Person.Postcode>\n" +
"                    </queryEvent>\n" +
"                </getPatientDetails-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>";

// Request for getPatientDetails No match
requestTemplates[2] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>{{msgID}}</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getPatientDetails-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"{{msgID}}\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:getPatientDetails-v1-0\" trackingid=\"{{msgID}}\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"				<itk:manifest count=\"1\">\n" +
"					<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-en:profile:getNHSNumberRequest-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"				</itk:manifest>\n" +
"				<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"uuid_{{manifest_id}}\">\n" +
"                <getPatientDetails-v1-0 xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
"moodCode=\"EVN\" classCode=\"CACT\">\n" +
"                    <id root=\"{{manifest_id}}\"/>\n" +
"                    <code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsRequest-v1-0\"/>\n" +
"                    <queryEvent>\n" +
"                        <Person.DateOfBirth>\n" +
"                            <value value=\"20010101\"/>\n" +
"                            <semanticsText>Person.DateOfBirth</semanticsText>\n" +
"                        </Person.DateOfBirth>\n" +
"                        <Person.NHSNumber>\n" +
"                            <value root=\"2.16.840.1.113883.2.1.4.1\" extension=\"9449305276\"/>\n" +
"                            <semanticsText>Person.NHSNumber</semanticsText>\n" +
"                        </Person.NHSNumber>\n" +
"                        <Person.Name>\n" +
"                            <value>\n" +
"                                <given>ADAM</given>\n" +
"                                <family>FINDLESS</family>\n" +
"                            </value>\n" +
"                            <semanticsText>Person.Name</semanticsText>\n" +
"                        </Person.Name>\n" +
"                        <Person.Postcode>\n" +
"                            <value>\n" +
"                                <postalCode>KT18 6PP</postalCode>\n" +
"                            </value>\n" +
"                            <semanticsText>Person.Postcode</semanticsText>\n" +
"                        </Person.Postcode>\n" +
"                    </queryEvent>\n" +
"                </getPatientDetails-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>";

// Request for getPatientDetailsBySearch MATCHES
requestTemplates[3] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>B72F7785-534C-11E6-ADCA-29C651A3BE62</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"D6CD5232-14CF-11DF-9423-1F9A910D4703\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:getPatientDetailsBySearch-v1-0\" " +
"trackingid=\"B72F9E96-534C-11E6-ADCA-29C651A3BE6F\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"				<itk:manifest count=\"1\">\n" +
"					<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-en:profile:getPatientDetailsBySearch-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"				</itk:manifest>\n" +
"				<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"uuid_{{manifest_id}}\">\n" +
"					<getPatientDetailsBySearchRequest-v1-0 xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
"xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/QUPA_MT000004GB01.xsd\" moodCode=\"EVN\" classCode=\"CACT\">\n" +
"						<id root=\"{{manifest_id}}\"/>\n" +
"						<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsBySearchRequest-v1-0\"/>\n" +
"						<queryEvent>\n" +
"							<Person.DateOfBirth>\n" +
"								<value value=\"20110727\"/>\n" +
"								<semanticsText>Person.DateOfBirth</semanticsText>\n" +
"							</Person.DateOfBirth>\n" +
"							<Person.Gender>\n" +
"								<value code=\"1\" codeSystem=\"2.16.840.1.113883.2.1.3.2.4.16.25\"/>\n" +
"								<semanticsText>Person.Gender</semanticsText>\n" +
"							</Person.Gender>\n" +
"							<Person.Name>\n" +
"								<value>\n" +
"									<given>ABRAHAM</given>\n" +
"									<family>CHARALAMBOUS</family>\n" +
"								</value>\n" +
"								<semanticsText>Person.Name</semanticsText>\n" +
"							</Person.Name>\n" +
"						</queryEvent>\n" +
"					</getPatientDetailsBySearchRequest-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>\n";


// getPatientDetailsByNHSNumberRequest NO MATCH
requestTemplates[4] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>{{msgID}}</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getPatientDetailsByNHSNumberRequest-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"{{msgID}}\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:getPatientDetailsByNHSNumberRequest-v1-0\" trackingid=\"{{msgID}}\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"				<itk:manifest count=\"1\">\n" +
"					<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-en:profile:getPatientDetailsBySearch-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"				</itk:manifest>\n" +
"				<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"{{manifest_id}}\">\n" +
"					<getPatientDetailsByNHSNumberRequest-v1-0 xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/QUPA_MT000003GB01.xsd\" " +
"moodCode=\"EVN\" classCode=\"CACT\" xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"						<id root=\"{{msgID}}\"/>\n" +
"					<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsByNHSNumberRequest-v1-0\"/>\n" +
"						<queryEvent>\n" +
"							<Person.DateOfBirth>\n" +
"								<value value=\"19960530\"/>\n" +
"								<semanticsText>Person.DateOfBirth</semanticsText>\n" +
"							</Person.DateOfBirth>\n" +
"							<Person.NHSNumber>\n" +
"								<value root=\"2.16.840.1.113883.2.1.4.1\" extension=\"9449310580\"/>\n" +
"								<semanticsText>Person.NHSNumber</semanticsText>\n" +
"							</Person.NHSNumber>\n" +
"						</queryEvent>\n" +
"					</getPatientDetailsByNHSNumberRequest-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>";

// getPatientDetailsByNHSNumber NO MATCH
requestTemplates[5] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>{{msgID}}</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getPatientDetailsByNHSNumberRequest-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"{{msgID}}\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:getPatientDetailsByNHSNumberRequest-v1-0\" trackingid=\"{{msgID}}\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"				<itk:manifest count=\"1\">\n" +
"					<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-en:profile:getPatientDetailsBySearch-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"				</itk:manifest>\n" +
"				<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"{{manifest_id}}\">\n" +
"					<getPatientDetailsByNHSNumberRequest-v1-0 xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/QUPA_MT000003GB01.xsd\" " +
"moodCode=\"EVN\" classCode=\"CACT\" xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"						<id root=\"{{msgID}}\"/>\n" +
"						<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getPatientDetailsByNHSNumberRequest-v1-0\"/>\n" +
"						<queryEvent>\n" +
"							<Person.DateOfBirth>\n" +
"								<value value=\"19960530\"/>\n" +
"								<semanticsText>Person.DateOfBirth</semanticsText>\n" +
"							</Person.DateOfBirth>\n" +
"							<Person.NHSNumber>\n" +
"								<value root=\"2.16.840.1.113883.2.1.4.1\" extension=\"9449310581\"/>\n" +
"								<semanticsText>Person.NHSNumber</semanticsText>\n" +
"							</Person.NHSNumber>\n" +
"						</queryEvent>\n" +
"					</getPatientDetailsByNHSNumberRequest-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>";

// getNHSNumber MATCH
requestTemplates[6] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>{{msgID}}</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getNHSNumber-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"{{msgID}}\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:getNHSNumber-v1-0\" " +
"trackingid=\"{{msgID}}\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"				<itk:manifest count=\"1\">\n" +
"					<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-en:profile:getNHSNumberRequest-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"				</itk:manifest>\n" +
"				<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"{{manifest_id}}\">\n" +
"					<getNHSNumberRequest-v1-0 xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
"xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/QUPA_MT000002GB01.xsd\" moodCode=\"EVN\" classCode=\"CACT\">\n" +
"						<id root=\"{{manifest_id}}\"/>\n" +
"						<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"getNHSNumberRequest-v1-0\"/>\n" +
"						<queryEvent>\n" +
"							<Person.DateOfBirth>\n" +
"								<value value=\"194305191212\"/>\n" +
"								<semanticsText>Person.DateOfBirth</semanticsText>\n" +
"							</Person.DateOfBirth>\n" +
"							<Person.Gender>\n" +
"								<value code=\"2\" codeSystem=\"2.16.840.1.113883.2.1.3.2.4.16.25\"/>\n" +
"								<semanticsText>Person.Gender</semanticsText>\n" +
"							</Person.Gender>\n" +
"							<Person.Name>\n" +
"								<value>\n" +
"									<given>COMFORT</given>\n" +
"									<family>AINDOW</family>\n" +
"								</value>\n" +
"								<semanticsText>Person.Name</semanticsText>\n" +
"							</Person.Name>\n" +
"						</queryEvent>\n" +
"					</getNHSNumberRequest-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>";

// Request for verifyNHSNumber MATCH
requestTemplates[7] = "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
"xmlns:wsa=\"http://www.w3.org/2005/08/addressing\" xmlns:itk=\"urn:nhs-itk:ns:201005\">\n" +
"	<soap:Header>\n" +
"		<wsa:MessageID>{{msgID}}</wsa:MessageID>\n" +
"		<wsa:Action>urn:nhs-itk:services:201005:getNHSNumber-v1-0</wsa:Action>\n" +
"		<wsa:To>{{to}}</wsa:To>\n" +
"		<wsa:From>\n" +
"			<wsa:Address>{{from}}</wsa:Address>\n" +
"		</wsa:From>\n" +
"		<wsse:Security xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n" +
"			<wsu:Timestamp xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" " +
"wsu:Id=\"D6CD5232-14CF-11DF-9423-1F9A910D4703\">\n" +
"				<wsu:Created>{{created}}</wsu:Created>\n" +
"				<wsu:Expires>{{expires}}</wsu:Expires>\n" +
"			</wsu:Timestamp>\n" +
"			<wsse:UsernameToken>\n" +
"				<wsse:Username>SMSPMock Tester</wsse:Username>\n" +
"			</wsse:UsernameToken>\n" +
"		</wsse:Security>\n" +
"	</soap:Header>\n" +
"	<soap:Body>\n" +
"		<itk:DistributionEnvelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"			<itk:header service=\"urn:nhs-itk:services:201005:verifyNHSNumberRequest-v1-0\" trackingid=\"{{msgID}}\">\n" +
"				<itk:auditIdentity>\n" +
"					<itk:id type=\"1.2.826.0.1285.0.2.0.107\" uri=\"868000003114\"/>\n" +
"				</itk:auditIdentity>\n" +
"			<itk:manifest count=\"1\">\n" +
"				<itk:manifestitem id=\"uuid_{{manifest_id}}\" mimetype=\"text/xml\" " +
"profileid=\"urn:nhs-itk:services:201005:verifyNHSNumber-v1-0\" base64=\"false\" compressed=\"false\" encrypted=\"false\"/>\n" +
"			</itk:manifest>\n" +
"			<itk:senderAddress uri=\"urn:nhs-uk:addressing:kind:of:add:here\"/>\n" +
"			</itk:header>\n" +
"			<itk:payloads count=\"1\">\n" +
"				<itk:payload id=\"uuid_{{manifest_id}}\">\n" +
"					<verifyNHSNumberRequest-v1-0 xsi:schemaLocation=\"urn:hl7-org:v3 ../../Schemas/QUPA_MT000001GB01.xsd\" " +
"moodCode=\"EVN\" classCode=\"CACT\" xmlns=\"urn:hl7-org:v3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
"						<id root=\"{{manifest_id}}\"/>\n" +
"						<code codeSystem=\"2.16.840.1.113883.2.1.3.2.4.17.284\" code=\"verifyNHSNumberRequest-v1-0\"/>\n" +
"						<queryEvent>\n" +
"							<Person.DateOfBirth>\n" +
"								<value value=\"20081216\"/>\n" +
"								<semanticsText>Person.DateOfBirth</semanticsText>\n" +
"							</Person.DateOfBirth>\n" +
"							<Person.NHSNumber>\n" +
"								<value root=\"2.16.840.1.113883.2.1.4.1\" extension=\"9449307342\"/>\n" +
"								<semanticsText>Person.NHSNumber</semanticsText>\n" +
"							</Person.NHSNumber>\n" +
"						</queryEvent>\n" +
"					</verifyNHSNumberRequest-v1-0>\n" +
"				</itk:payload>\n" +
"			</itk:payloads>\n" +
"		</itk:DistributionEnvelope>\n" +
"	</soap:Body>\n" +
"</soap:Envelope>";

module.exports = {
	responseTemplates:responseTemplates,
	requestTemplates:requestTemplates,
	errorTemplates:errorTemplates,
	profiles:profiles,
	envelopeTemplate:envelopeTemplate
}