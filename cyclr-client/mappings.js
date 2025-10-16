import axios from "axios";
import { token, baseUrl } from "./config.js";
import getSteps from "./steps.js";

export default async function getMapping(accountId, workflowId) {
  const stepIds = await getSteps(accountId, workflowId);
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

    const fieldData = fieldResponse.data.map((field) => ({
      id: step,
      name: field.Field.Name,
      isMapped: field.MappingType !== "Ignore",
    }));
    //console.log(fieldData)
    output.push(fieldData);
  }

  console.log(output);
}

// Example run:
getMapping(
  "80ca754f-e0bb-40ba-9739-ce3f0f04e6a2",
  "9a6276fb-8271-4187-b654-76762a687a8b"
);
