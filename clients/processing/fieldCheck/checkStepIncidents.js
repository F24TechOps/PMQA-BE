//for the fields that were mapped, check the steps they were mapped in
export default function stepCheck(
  expectedFields,
  actualFields,
  mappingResults
) {
  const { resultsObj, furtherInvestigations } = mappingResults;
  return { resultsObj, furtherInvestigations };
}
