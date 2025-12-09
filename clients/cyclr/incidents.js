import axios from "axios";
import { token, baseUrl } from "./config.js";

export default async function getCycleStepIncidents(
  cycleId,
  accountId,
  transactionId,
  stepId
) {
  const bearerToken = await token();
  const incidents = await axios.get(
    `${baseUrl}/v1.0/cycles/${cycleId}/incidents`,
    {
      headers: {
        Accept: "application/json",
        "X-Cyclr-Account": accountId,
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );

  const filteredIncidents = incidents.data.filter(
    (incident) =>
      (!transactionId || incident.TransactionId === transactionId) &&
      (!stepId || incident.StepId === stepId)
  );
  return filteredIncidents[0];
}

// extracts the error message from the incident above - just a helper
export function extractErrorMessage(fullMessage) {
  if (!fullMessage) return null;

  const [block] = fullMessage.split("\r\n\r\n");
  const [line1, jsonLine] = block.split("\r\n");

  let parsed;
  try {
    parsed = jsonLine ? JSON.parse(jsonLine) : null;
  } catch {
    parsed = null;
  }

  return {
    line1: line1 || null,
    message: parsed?.message || null,
    error: parsed?.errors || null
  };
}
