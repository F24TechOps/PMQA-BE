//for the fields that were expected but not in json, check if they are mapped

import getMapping from "../../cyclr/mappings.js";

export default async function mappingCheck(
  comparisonResults,
  transactionContext
) {
  const { resultsObj, furtherInvestigations } = comparisonResults;
  const { accountId, cycleId } = transactionContext;

  const mappingResultFromCyclr = await getMapping(accountId, cycleId);

  const mappingInformation = mappingResultFromCyclr[0].filter(
    (item) => item.isMapped === true
  );

  const mappedFields = mappingResultFromCyclr[0]
    .filter((item) => item.isMapped === true)
    .map((field) => (field = field.id));

  for (let i = 0; i < furtherInvestigations.fields.length; i++) {
    const fieldId = furtherInvestigations.fields[i];
    const match = mappingInformation.find((f) => f.id === fieldId);

    if (!mappedFields.includes(fieldId)) {
      resultsObj.fields[fieldId] = {
        status: "Missing",
        reason: "Not Mapped In Cyclr",
      };
      resultsObj.summary.missing++;
      furtherInvestigations.fields.splice(i, 1);
      i--;
    } else {
      furtherInvestigations.fields[i] = match;
    }
  }
  return { resultsObj, furtherInvestigations };
}
