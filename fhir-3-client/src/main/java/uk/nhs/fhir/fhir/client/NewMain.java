/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uk.nhs.fhir.fhir.client;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import java.util.logging.Logger;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Patient;

/**
 *
 * @author dev
 */
public class NewMain {

    private static final Logger LOG = Logger.getLogger(NewMain.class.getName());

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {

        // This needs to be set following the deployment
        String serverBase = "https://icyd7b2h7c.execute-api.eu-west-2.amazonaws.com/prod/fhir";


        FhirContext ctx = FhirContext.forDstu3();
        IGenericClient client = ctx.newRestfulGenericClient(serverBase);

        String ID = "9449304106";
        try {
            Patient singlePat = client.read().resource(Patient.class).withId(ID).execute();
            LOG.info("Name: " + singlePat.getNameFirstRep().getFamily());

            // Perform a search
            Bundle results = client
                    .search()
                    .forResource(Patient.class)
                    .where(Patient.FAMILY.matches().value("LEGASSICK"))
                    .and(Patient.ADDRESS_POSTALCODE.matches().values("KT11 2QG"))
                    .and(Patient.BIRTHDATE.exactly().day("1994-03-19"))
                    .returnBundle(Bundle.class)
                    .execute();

            LOG.info("Found " + results.getEntry().size() + " patients named 'LEGASSICK' with DOB of '1994-03-19' and postcode of 'KT11 2QG'");

            if(results.getTotal() == 1) {
                Patient p = (Patient) results.getEntry().get(0).getResource();
                LOG.info("Full URL is: " + p.getId());
            }
        } catch(ca.uhn.fhir.rest.server.exceptions.InternalErrorException ex) {
            LOG.warning(ex.getMessage());
        }
    }

}
