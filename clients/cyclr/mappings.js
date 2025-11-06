import axios from "axios";
import { token, baseUrl } from "./config.js";
import { getCreateAndUpdateSteps } from "./steps.js";

export default async function getMapping(accountId, workflowId) {
  const stepIds = await getCreateAndUpdateSteps(accountId, workflowId);
  const output = [];

  for (const step of stepIds) {
    const bearerToken = await token();

    const fieldResponse = await axios.get(
      `${baseUrl}/v1.0/steps/${step}/fieldmappings`,
      {
        headers: {
          Accept: "application/json",
          "X-Cyclr-Account": accountId,
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    const fieldData = fieldResponse.data.map((field) => {
      const matches =
        field.Value?.match(/\{\{(.*?)\}\}/g)?.map((m) =>
          m.replace(/\{|\}/g, "").trim()
        ) || [];

      let linkedSteps = [];

      if (field.MappingType === "PreviousStep") {
        linkedSteps.push({
          stepId: field.SourceStepId ?? null,
          fieldId: field.SourceFieldId ?? null,
        });
      } else if (field.MappingType === "StaticValue" && matches.length) {
        matches.forEach((match) => {
          const [longId, shortId] = match.split(/\s+/);
          linkedSteps.push({
            stepId: longId ?? null,
            fieldId: shortId ?? null,
          });
        });
      }

      return {
        id: field.Field.Location.split(".").pop(),
        name: field.Field.Name,
        mappingType: field.MappingType,
        isMapped: field.MappingType !== "Ignore",
        linkedSteps,
      };
    });

    output.push(fieldData);
  }

  return output;
}
