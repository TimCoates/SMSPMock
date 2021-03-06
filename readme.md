## SMSP Mock

### Synopsis

This project provides a MOCK version of the NHS Digital Spine Mini Services Provider (SMSP) as described [here](https://developer.nhs.uk/library/systems/nhs-digital-smsp-pds/).

It's a [Serverless Framework](https://serverless.com/) service and runs as a set of AWS node.js Lambda functions, with a set of ***Synthetic*** patients included to be loaded (into DynamoDB).

The service provides both a Web UI, where Patients can be loaded, and browsed, as well as viewing logs of requests sent to and responded to by the underlying service.

***NB:*** The embedded Requirements Pack also describes a lot more details of the SMSP interface.


***NB:*** The serverless.yml file included here takes advantage of serverless-domain-manager, this allows us to retain a sensible URL see [this article](https://serverless.com/blog/serverless-api-gateway-domain/) for details on how to take advantage of this.

### Code Example

Once deployed, the service provides a Web homepage at e.g. https://something.something/prod/ (with serverless-domain-manager the /prod/ is removed) as well as offering a SOAP interface at e.g. https://something.something/prod/service

Standard SMSP SOAP requests can be made against the interface [some details here.](https://developer.nhs.uk/library/systems/nhs-digital-smsp-pds/).

### Motivation

Motivation was simply an interest in Lambdas and the Serverless Framework, and a challenge to provide an easier to use mock service than signing up for ['OpenTest'](https://digital.nhs.uk/spine/opentest) which can be deployed in minutes for zero or minimal cost, and removed with no overhead.

### Installation and use

Nothing is really required in order to install, simply:
* Clone the repo `git clone git@github.com:TimCoates/SMSPMock.git`.
* Run `npm install` in order to install the necessary node modules.
* Read the ***Dependencies*** section below!!!
* Deploy...

Deploy as a 'normal' Serverless Framework service, i.e. run `sls deploy` from the project root, and wait a minute or so for the deployment to complete, and list the provided ***endpoints***.

Open the ***.../prod/*** endpoint link in a web browser.

Click ***Load Data>>*** - this loads ~ 700 synthetic patient records.

Click ***Patients>>*** - to browse the loaded patient data.

Send one or more SOAP requests to the ***.../prod/service*** endpoint.

NB: To assist with this, a [SOAPUI](https://www.soapui.org/) project is included, which tests SOME of the provided services.

Once a Patient is selected, clicking their NHS Number will send a FHIR REST request to retrieve a FHIR Resource representing that Patient.

Click ***View logs>>*** to see a record of each request and response which was passed through.

***NB*** Logs are marked for purging after 2 days, and will be deleted within 48 hours of that (using DyanoDB's intrinsic TTL feature).

Running `sls remove` will delete all data from DynamoDB and remove all Lambdas etc, leaving no trace of the service.

### Dependencies
NB: Requires an AWS account, and the Account ID to be in a file named ***account.yml*** placed in the project root.
NB2: This value is now expected to be in an Environment Variable, to support a CD pipeline using BitBucket pipelines. This pipeline is described in bitbucket-pipelines.yml but runs in a private BitBucket repository.

Requires an AWS AIM Role named ***LambdaRole*** (though this can be changed at line 12 in serverless.yml)

Requires Serverless Framework (Tested with version 1.23.0), [set up with credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/) for an AWS Account.

Requires the following node modules (as identified in ***package.json***):
* async
* mustache
* uuid
* xmldom

### API Reference

See the [NHS Developer Network](https://developer.nhs.uk/library/systems/nhs-digital-smsp-pds/) for details of the SOAP API exposed by this service.

### Tests

None yet.

### Contributions

Suggestions, complaints, issues, contributions and pull requests are all welcomed, response may be either slow or very slow, apologies in advance for this.

### TODO

* Not all searches are properly implemented by the service.
* Incomplete rendering of Patient data.
* Better handling of different failure responses, eg multiple matches found etc.
* DONE ~~Better presentation of the XML when viewing logs. At the moment it's very basic.~~
* DONE ~~More details of how to send (or ideally the ability to send) in requests from the UI itself.~~
* Patient data is incomplete, for example only one address is ever stored, and this is assumed to be the home address.

### License

Licensed under the [Apache V2 License](https://www.apache.org/licenses/LICENSE-2.0)
