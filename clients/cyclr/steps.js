import axios from "axios";
import { token, baseUrl } from "./config.js";

export async function getCreateAndUpdateSteps(accountId, workflowId) {
  const bearerToken = await token();
  const steps = await axios.get(`${baseUrl}/v1.0/cycles/${workflowId}/steps`, {
    headers: {
      Accept: "application/json",
      "X-Cyclr-Account": accountId,
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  const filteredSteps = steps.data.filter((step) => step.Method);
  let stepInfo = filteredSteps.map((step) => ({
    id: step.Id,
    name: step.Name,
  }));
  stepInfo = stepInfo
    .filter(
      (step) =>
        step.name.includes("Create") ||
        (step.name.includes("Update") &&
          !step.name.includes("Updated") &&
          !step.name.includes("List") &&
          !step.name.includes("OK"))
    )
    .map((step) => step.id);
  return stepInfo;
}

export async function getStepById(accountId, workflowId, stepId) {
  const bearerToken = await token();
  const steps = await axios.get(`${baseUrl}/v1.0/cycles/${workflowId}/steps/${stepId}`, {
    headers: {
      Accept: "application/json",
      "X-Cyclr-Account": accountId,
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  return steps.data;
}

export async function getStepForMappingById(accountId, stepId) {
  const bearerToken = await token();
  const steps = await axios.get(`${baseUrl}/v1.0/steps/${stepId}/fieldsformapping`, {
    headers: {
      Accept: "application/json",
      "X-Cyclr-Account": accountId,
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  
 return steps?.data[0]?.Step;
}
