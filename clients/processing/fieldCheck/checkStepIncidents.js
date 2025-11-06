import { getStepById } from "../../cyclr/steps.js";

//for the fields that were mapped, check the steps they were mapped in
export default async function stepCheck(
  expectedFields,
  actualFields,
  mappingResults,
  transactionContext
) {
  const { resultsObj, furtherInvestigations } = mappingResults;
  const { accountId, cycleId } = transactionContext;
  const investigationArray = furtherInvestigations.fields;

  for (let i = 0; i < investigationArray.length; i++) {
    const stepId = investigationArray[i].linkedSteps[0].stepId;
    const fieldId = investigationArray[i].linkedSteps[0].fieldId;
    const stepResults = await getStepById(accountId, cycleId, stepId);

    //TODO: Not Finished!!!
    console.log(stepResults.Method.ResponseFields.filter((item) => item.Id === fieldId));
  }

  return { resultsObj, furtherInvestigations };
}
