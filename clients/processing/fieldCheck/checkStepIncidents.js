import { getStepById } from "../../cyclr/steps.js";
import getTransactionByID from "../../cyclr/transactions.js";

//for the fields that were mapped, check the steps they were mapped in
export default async function stepCheck(
  mappingResults,
  transactionContext
) {
  const { resultsObj, furtherInvestigations } = mappingResults;
  const { accountId, cycleId, transactionId } = transactionContext;
  const investigationArray = furtherInvestigations.fields;

  for (let i = 0; i < investigationArray.length; i++) {
    const linked = investigationArray[i].linkedSteps[0];
    const stepId = linked.stepId;
    const fieldId = linked.fieldId;
    const fieldKey = investigationArray[i].id;

    // Step data from linked step
    const stepRes = await getStepById(accountId, cycleId, stepId);
    const stepResponseFields = stepRes.Method.ResponseFields;

    // All transaction data
    const transactionData = await getTransactionByID(
      accountId,
      cycleId,
      transactionId
    );

    // Filters for linked step 
    const mappedStepResults = transactionData
      .filter((transaction) => transaction.StepId === stepId)
      .at(-1).Response;

    // If no linked step
    if (!mappedStepResults) {
      resultsObj.fields[fieldKey] = {
        status: "Error",
        reason: "No step response returned",
      };
      continue;
    }

    const responseFieldDef = stepResponseFields.find(
      (field) => field.Id === fieldId
    );

    // If field is not in output
    if (!responseFieldDef) {
      resultsObj.fields[fieldKey] = {
        status: "Error",
        reason: "Field not in response schema for mapped step",
      };
      continue;
    }

    // Find field location
    const location = responseFieldDef.Location;
    const finalKey = location.split(".").pop().replace("]", "");

    let valueFromStep;

    //Use responseFieldDef.Location for valueFromStep

    if (mappedStepResults.items & Array.isArray(mappedStepResults.items)) {
      valueFromStep = mappedStepResults.items[0]?.[finalKey];
    } else {
      valueFromStep = mappedStepResults[finalKey];
    }

    if (valueFromStep === undefined || valueFromStep === null) {
      resultsObj.fields[fieldKey] = {
        status: "Error",
        reason: `Field Missing in Mapped Step Response`,
      };
    } else {
      if (valueFromStep !== undefined && valueFromStep !== null) {
        resultsObj.fields[fieldKey] = {
          status: "Warning",
          reason:
            "Step returned a value but it was missing in the final record",
          value: valueFromStep,
        };
        continue;
      }
    
      const stepIncident = getStepIncident(accountId, cycleId, stepId);
      // Check if step had incident/error 
      if (stepIncident) {
        resultsObj.fields[fieldKey] = {
          status: "Error",
          reason: "Cyclr reported an incident on this step",
        };
        continue;
      }
      resultsObj.fields[fieldKey] = {
        status: "Warning",
        reason: "Field missing in step response and no incident report"
      }

    }
  }
  return { resultsObj, furtherInvestigations };
}

/** InvestigationArray[i]
 {
  id: 'firstname',
  name: 'First Name',
  mappingType: 'PreviousStep',
  isMapped: true,
  linkedSteps: [
    {
      stepId: '08ddf5f3-47e9-4060-8d2d-6e30d13cb81f',
      fieldId: 27718270
    }
  ]
}
{
  id: 'companyname',
  name: 'Company Name',
  mappingType: 'PreviousStep',
  isMapped: true,
  linkedSteps: [
    {
      stepId: '08ddf5f7-f036-4970-8534-a16d8f40830a',
      fieldId: 27716563
    }
  ]
}
 */

/** stepResponseFields
 * 
 * [
  {
    Location: '[items].id',
    Id: 27718267,
    Name: 'Candidate ID',
    Description: null,
    IsOptional: false,
    DataType: 'Integer',
    TriggerName: null,
    Values: [],
    DisplayOrder: 2,
    Triggers: null
  },
  {
    Location: '[items].name',
    Id: 27718268,
    Name: 'Name',
    Description: null,
    IsOptional: false,
    DataType: 'Text',
    TriggerName: null,
    Values: [],
    DisplayOrder: 3,
    Triggers: null
  },
  {
    Location: '[items].last_name',
    Id: 27718269,
    Name: 'Last Name',
    Description: null,
    IsOptional: false,
    DataType: 'Text',
    TriggerName: null,
    Values: [],
    DisplayOrder: 4,
    Triggers: null
  },
  {
    Location: '[items].first_name',
    Id: 27718270,
    Name: 'First Name',
    Description: null,
    IsOptional: false,
    DataType: 'Text',
    TriggerName: null,
    Values: [],
    DisplayOrder: 5,
    Triggers: null
  },
  {
    Location: '[items].gender',
    Id: 27718271,
    Name: 'Gender',
    Description: null,
    IsOptional: false,
    DataType: 'Text',
    TriggerName: null,
    Values: [],
    DisplayOrder: 6,
    Triggers: null
  },
  {
    Location: '[items].primary_email',
    Id: 27718272,
    Name: 'Primary Email',
    Description: null,
    IsOptional: false,
    DataType: 'Text',
    TriggerName: null,
    Values: [],
    DisplayOrder: 7,
    Triggers: null
  },
  {
    Location: '[items].created_by.email',
    Id: 27718274,
    Name: 'Created By Email',
    Description: null,
    IsOptional: false,
    DataType: 'Text',
    TriggerName: null,
    Values: [],
    DisplayOrder: 27,
    Triggers: null
  },
  {
    Location: '[items].current_employer',
    Id: 27718354,
    Name: 'Current Employer',
    Description: null,
    IsOptional: false,
    DataType: 'Text',
    TriggerName: null,
    Values: [],
    DisplayOrder: 30,
    Triggers: null
  }
]
 */

/** mappedStepResults
 * {"items":[{"last_name":"Rhoades","primary_email":"wendyrhoades@veryrealemail.com","first_name":"Wendy"}],"nextCursorMask":"QW9KNXdKVEQwcFlEUHd0bWIzSmpaVEkwTFhOaGJtUmliM2d1ZG1sdVkyVnlaUzVwYnlGallXNWthV1JoZEdWZk5qSTRNVEU9"}
 *
 * or
 *
 * {"current_employer":"Barclays Investment Bank","current_job_title":"Credit Analyst","mobile":"+44 732 431 414","current_location":{"country":"GB","location_name":"London SE5","address":"90 Crown St, Camberwell, London SE5, UK","city":"Greater London","latitude":51.4789361,"district":"","post_code":"SE5","state":"England","longitude":-0.0958107999999811,"nearest_train_station":""}}
 * depending on the step
 */

let mappingResults = {
      resultsObj: {
      fields: { firstname: { status: 'Null', value: null } },
      summary: { correct: 0, null: 1, missing: 0, warning: 0, error: 0, extra: 0 }
    },
      furtherInvestigations: {
      fields: [
         {
          id: 'firstname',
          name: 'First Name',
          mappingType: 'PreviousStep',
          isMapped: true,
          linkedSteps: [
            {
              stepId: '08ddf5f3-47e9-4060-8d2d-6e30d13cb81f',
              fieldId: 27718270
            }
          ]
        }
      ]
    }
}

let transactionContext = {
  accountId: "7fcb9aae-c368-46cc-9fd2-4cba6184c90d",
  cycleId: "cb6ff75b-e87c-4602-b63e-d48b3f54ee5a",
  transactionId: "3440d093-02e5-4a80-a369-aee8eb5b2409",
}

// stepCheck(
//   mappingResults,
//   transactionContext
// )