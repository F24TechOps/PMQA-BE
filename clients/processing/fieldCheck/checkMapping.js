//for the fields that were expected but not in json, check if they are mapped

export default function mappingCheck(
  actualFields,
  comparisonResults
) {
  const { resultsObj, furtherInvestigations } = comparisonResults;
  const itemFields = actualFields.items[0]?.fields || {};
  for (const field of furtherInvestigations.fields) {
    if (!itemFields.hasOwnProperty(field)) {
      resultsObj.fields[field] = { status: "Missing", reason: "Not mapped in Cyclr" };
      resultsObj.summary.missing++
    } else {
      resultsObj.fields[field] = { status: "Missing", reason: "Null" };
    }
  }
  return { resultsObj, furtherInvestigations };
}
