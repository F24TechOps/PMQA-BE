//check the actual output against the expected fields
export default function compareFields(expectedFields, actualFields) {
  if (!Array.isArray(expectedFields)) {
    console.error(
      `Error in CompareFields: There's an issue with expected fields - check and try again`
    );
    return;
  }

  const actualFieldsArr = [];
  const resultsObj = {
    fields: {},
    summary: {
      correct: 0,
      null: 0,
      missing: 0,
      warning: 0,
      error: 0,
      extra: 0,
    },
  };
  const furtherInvestigations = { fields: [] };

  const expectedLower = expectedFields.map((f) => f.toLowerCase());

  // get rid of all nulls
  for (const item in actualFields.items[0].fields) {
    if (actualFields.items[0].fields[item] !== null) {
      actualFieldsArr.push(item.toLowerCase());
    } else {
      resultsObj.fields[item] = {
        status: "Null",
        value: null,
      };
      furtherInvestigations.fields.push(item.toLowerCase());
      resultsObj.summary.null++;
    }
  }

  for (let i = 0; i < expectedLower.length; i++) {
    if (actualFieldsArr.includes(expectedLower[i])) {
      resultsObj.fields[expectedLower[i]] = {
        status: "Correct",
        value: actualFields.items[0].fields[expectedLower[i]],
      };
      resultsObj.summary.correct++;
    } else if (!furtherInvestigations.fields.includes(expectedLower[i])) {
      furtherInvestigations.fields.push(expectedLower[i]);
    }
  }

  // check for extras (fields present in actual response but not expected fields)
  for (const item of actualFieldsArr) {
    if (!expectedLower.includes(item)) {
      resultsObj.fields[item] = {
        status: "Extra",
        value: actualFields.items[0].fields[item],
      };
      resultsObj.summary.extra++;
    }
  }

  return { resultsObj, furtherInvestigations };
}
