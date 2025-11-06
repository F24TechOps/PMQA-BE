//for the fields that were expected but not in json, check if they are mapped

import getMapping from "../../cyclr/mappings.js";

export default async function mappingCheck(
  comparisonResults,
  transactionContext
) {
  const { resultsObj, furtherInvestigations } = comparisonResults;
  const { accountId, cycleId } = transactionContext;

  const mappingResultFromyclr = await getMapping(accountId, cycleId);

  const mappedFields = mappingResultFromyclr[0]
    .filter((item) => item.isMapped === true)
    .map((field) => (field = field.id));

  for (let i = 0; i < furtherInvestigations.fields.length; i++) {
    if (!mappedFields.includes(furtherInvestigations.fields[i])) {
      resultsObj.fields[furtherInvestigations.fields[i]] = {
        status: "Missing",
        reason: "Not Mapped In Cyclr",
      };
      resultsObj.summary.missing++;
      furtherInvestigations.fields.splice(i, 1);
    }
  }

  return { resultsObj, furtherInvestigations };
}
