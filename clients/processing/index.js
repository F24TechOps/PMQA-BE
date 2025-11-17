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

  /** Example comparisonResults
   * 
   * Results Object ==> {
  fields: {
    firstname: { status: 'Null', value: null },
    lastname: { status: 'Correct', value: 'Rhoades' },
    jobtitle: { status: 'Correct', value: 'Credit Analyst' },
    mobilephone: { status: 'Correct', value: '+44 732 431 414' },
    address1line1: {
      status: 'Correct',
      value: '90 Crown St, Camberwell, London SE5, UK'
    },
    address1line2: { status: 'Correct', value: 'London SE5' },
    address1postcode: { status: 'Correct', value: 'SE5' },
    address1city: { status: 'Correct', value: 'Greater London' },
    address1county: { status: 'Correct', value: 'England' },
    address1country: { status: 'Correct', value: 'GB' },
    xsc9fqry4h: { status: 'Correct', value: 'Barclays Investment Bank' },
    emailaddress: { status: 'Correct', value: undefined }
  },
  summary: { correct: 11, null: 1, missing: 0, warning: 0, error: 0, extra: 0 }
} Further Investigations Array ==> { fields: [ 'firstname', 'companyname', 'uqjrgk2a6w' ] }
   * 
   */

  // gets the create and update step (that actually makes the change in the platform and is usually the last step) and checks if the fields that need to be investigated have been mapped. If they have not been mapped then that ends the investigation for that field it gets put in the results. If the field is mapped and still has not come through, it stays in the furtherinvestigations array and is moved on to the next step.
  const mappingResults = await mappingCheck(
    comparisonResults,
    transactionContext
  );

  /** Example mappingResults
    * 
    * Results Object ==> {
  fields: {
    firstname: { status: 'Null', value: null },
    lastname: { status: 'Correct', value: 'Rhoades' },
    jobtitle: { status: 'Correct', value: 'Credit Analyst' },
    mobilephone: { status: 'Correct', value: '+44 732 431 414' },
    address1line1: {
      status: 'Correct',
      value: '90 Crown St, Camberwell, London SE5, UK'
    },
    address1line2: { status: 'Correct', value: 'London SE5' },
    address1postcode: { status: 'Correct', value: 'SE5' },
    address1city: { status: 'Correct', value: 'Greater London' },
    address1county: { status: 'Correct', value: 'England' },
    address1country: { status: 'Correct', value: 'GB' },
    xsc9fqry4h: { status: 'Correct', value: 'Barclays Investment Bank' },
    emailaddress: { status: 'Correct', value: undefined },
    uqjrgk2a6w: { status: 'Missing', reason: 'Not Mapped In Cyclr' }
  },
  summary: { correct: 11, null: 1, missing: 1, warning: 0, error: 0, extra: 0 }
} Further Investigations Array ==> {
  fields: [
    {
      id: 'firstname',
      name: 'First Name',
      mappingType: 'PreviousStep',
      isMapped: true,
      linkedSteps: [Array]
    },
    {
      id: 'companyname',
      name: 'Company Name',
      mappingType: 'PreviousStep',
      isMapped: true,
      linkedSteps: [Array]
    }
  ]
}
    * 
    */

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
