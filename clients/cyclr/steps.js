import axios from "axios";
import { token, baseUrl } from "./config.js";

export default async function getSteps(accountId, workflowId) {
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
