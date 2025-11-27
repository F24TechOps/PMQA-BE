//main page that organises and manages the processing

import compareFields from "./fieldCheck/compareFields.js";
import mappingCheck from "./fieldCheck/checkMapping.js";
import stepCheck from "./fieldCheck/checkStepIncidents.js";

export default async function runProcessor(
  expectedFields,
  actualFields,
  transactionContext
) {
  // Compares the expected fields to the actual fields.
  const comparisonResults = compareFields(expectedFields, actualFields);

  // gets the create and update step (that actually makes the change in the platform and is usually the last step) and checks if the fields that need to be investigated have been mapped. If they have not been mapped then that ends the investigation for that field it gets put in the results. If the field is mapped and still has not come through, it stays in the furtherinvestigations array and is moved on to the next step.
  const mappingResults = await mappingCheck(
    comparisonResults,
    transactionContext
  );

  // checkIncidents - puts fields that were errored in results obj
  const stepResults = stepCheck(
    expectedFields,
    actualFields,
    mappingResults,
    transactionContext
  );

  //send result of this run to db run record

  //return results obj
  // console.log(`RESULTS: `, stepResults);
  return comparisonResults;
}

const exampleActualFields = {
  items: [
    {
      emailAddress: "wendyrhoades@veryrealemail.com",
      fields: {
        firstname: null,
        lastname: "Rhoades",
        jobtitle: "Credit Analyst",
        mobilephone: "+44 732 431 414",
        address1line1: "90 Crown St, Camberwell, London SE5, UK",
        address1line2: "London SE5",
        address1postcode: "SE5",
        address1city: "Greater London",
        address1county: "England",
        address1country: "GB",
        xsc9fqry4h: "Barclays Investment Bank",
        emailAddress: "wendyrhoades@veryrealemail.com",
      },
    },
  ],
};

const exampleExpectedFields = [
  "firstname",
  "lastname",
  "jobtitle",
  "mobilephone",
  "address1line1",
  "address1line2",
  "address1postcode",
  "address1city",
  "address1county",
  "address1country",
  "xsc9fqry4h",
  "companyname",
  "emailAddress",
  "uqjrgk2a6w",
];

const exampleTransactionContext = {
  accountId: "7fcb9aae-c368-46cc-9fd2-4cba6184c90d",
  cycleId: "cb6ff75b-e87c-4602-b63e-d48b3f54ee5a",
  transactionId: "3440d093-02e5-4a80-a369-aee8eb5b2409",
};

runProcessor(
  exampleExpectedFields,
  exampleActualFields,
  exampleTransactionContext
);
