import axios from "axios";
import { token, baseUrl, testCycleId, testAccountId } from "./config.js";

export default async function getEdges(accountId, cycleId) {
  const bearerToken = await token();
  const edges = await axios.get(`${baseUrl}/v1.0/cycles/${cycleId}/edges`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
      "X-Cyclr-Account": accountId,
    },
  });
  return edges.data;
}
