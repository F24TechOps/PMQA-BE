import getCycleStepIncidents, {
  extractErrorMessage,
} from "../../cyclr/incidents.js";
import { getStepById } from "../../cyclr/steps.js";
import getTransactionByID from "../../cyclr/transactions.js";

//for the fields that were mapped, check the steps they were mapped in
export default async function stepCheck(mappingResults, transactionContext) {
  const { resultsObj, furtherInvestigations } = mappingResults;
  const { accountId, cycleId, transactionId } = transactionContext;
  const investigationArray = furtherInvestigations.fields;

  const transactionData = await getTransactionByID(
    accountId,
    cycleId,
    transactionId
  );

  for (let i = 0; i < investigationArray.length; i++) {
    const linked = investigationArray[i].linkedSteps[0];
    const { stepId, fieldId } = linked;
    const fieldKey = investigationArray[i].id;

    // Step data from linked step
    const stepRes = await getStepById(accountId, cycleId, stepId);
    const stepResponseFields = stepRes.Method.ResponseFields;

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
    const { Location } = responseFieldDef;
    const finalKey = Location.split(".").pop().replace("]", "");

    let valueFromStep;

    //Use responseFieldDef.Location for valueFromStep

    if (mappedStepResults.items && Array.isArray(mappedStepResults.items)) {
      valueFromStep = mappedStepResults.items[0]?.[finalKey];
    } else {
      valueFromStep = mappedStepResults[finalKey];
    }

    if (valueFromStep === undefined || valueFromStep === null) {
      const stepIncident = await getCycleStepIncidents(
        cycleId,
        accountId,
        transactionId,
        stepId
      );

      if (stepIncident) {
        const errorMessage = extractErrorMessage(stepIncident.FullMessage);
        resultsObj.fields[fieldKey] = {
          status: stepIncident.IncidentLevel,
          reason: errorMessage
            ? `${errorMessage.line1}\n${errorMessage.message}\n${errorMessage.error}`
            : "Incident occurred but no FullMessage was provided",
        };
      } else {
        resultsObj.fields[fieldKey] = {
          status: "Warning",
          reason: `Field Missing in Mapped Step Response and there was no incident report`,
        };
      }

      continue;
    }
    resultsObj.fields[fieldKey] = {
      status: "Warning",
      reason: `Step returned a value but it was missing in the final record`,
      value: valueFromStep,
    };
    continue;
  }
  
  return { resultsObj, furtherInvestigations };
}
