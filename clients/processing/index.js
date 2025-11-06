//main page that organises and manages the processing

import compareFields from "./fieldCheck/compareFields.js";
import mappingCheck from "./fieldCheck/checkMapping.js";
import stepCheck from "./fieldCheck/checkStepIncidents.js";

export default async function runProcessor(
  expectedFields,
  actualFields,
  transactionContext
) {
  const comparisonResults = compareFields(expectedFields, actualFields);

  const mappingResults = await mappingCheck(comparisonResults, transactionContext);

  //checkIncidents - puts fields that were errored in results obj
  const stepResults = stepCheck(
    expectedFields,
    actualFields,
    mappingResults,
    transactionContext
  );

  //send result of this run to db run record

  //return results obj
 // console.log(`RESULTS: `, stepResults);
  return stepResults;
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
  transactionId: "2d3cd3b3-7957-490f-97ea-17b19f6b7bc3",
};

runProcessor(
  exampleExpectedFields,
  exampleActualFields,
  exampleTransactionContext
);
