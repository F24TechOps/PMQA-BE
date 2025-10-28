//main page that organises and manages the processing

import compareFields from "./fieldCheck/checkExpectedFields.js";
import mappingCheck from "./fieldCheck/checkMapping.js";
import stepCheck from "./fieldCheck/checkStepIncidents.js";

export default function runProcessor(expectedFields, actualFields, transactionContext) {
  //checkExpectedFields -> puts the fields that are exapcted & present in a results obj
  const comparisonResults = compareFields(expectedFields, actualFields);

  //checkMapping - puts fields that were not mapped in results obj
  const mappingResults = mappingCheck(
    expectedFields,
    actualFields,
    comparisonResults
  );

  //checkIncidents - puts fields that were errored in results obj
  const stepResults = stepCheck(expectedFields, actualFields, mappingResults);

  //send result of this run to db run record

  //return results obj
  console.log(`RESULTS: `, stepResults);
  return stepResults;
}

const exampleActualFields = {
  items: [
    {
      emailAddress: "masir@test.com",
      fields: {
        firstname: "Masir",
        lastname: "Test",
        jobtitle: "New Lead",
        address1line1: "14 Crown Point Road",
        address1postcode: "LS10 1EL",
        address1city: "Leeds",
        address1county: "West Yorkshire",
        address1country: "United Kingdom",
        emailstatus: "active",
        smsstatus: "unsubscribed",
        companyname: "Masir Test-UK1765426-Household",
        easfrd5mcg: "001TA00001GoUveYAF",
        "3mfq4uy8se": true,
        "98vzewsraf": "003TA00000zZUzNYAW",
        fd3452x7ez: "2025-10-22T16:38:58+00:00",
        emailAddress: "masir@test.com",
      },
    },
  ],
};

const exampleExpectedFields = [
  "emailstatus",
  "smsstatus",
  "firstname",
  "lastname",
  "companyname",
  "easfrd5mcg",
  "jobtitle",
  "emailaddress",
  "mobilephone",
  "address1line1",
  "address1line2",
  "address1line3",
  "address1city",
  "address1county",
  "address1country",
  "address1postcode",
  "637htqbcvp",
  "3mfq4uy8se",
];

runProcessor(exampleExpectedFields, exampleActualFields);
