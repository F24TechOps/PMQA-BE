//for the fields that were expected but not in json, check if they are mapped

export default function mappingCheck(
  expectedFields,
  actualFields,
  comparisonResults
) {
  const { resultsObj, furtherInvestigations } = comparisonResults;
  return { resultsObj, furtherInvestigations };
}
