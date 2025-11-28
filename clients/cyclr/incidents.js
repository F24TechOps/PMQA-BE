import axios from "axios";
import { token, baseUrl } from "./config.js";

export default async function getIncidents(id, level, accountId) {
  const bearerToken = await token();
  const incidents = await axios.get(
    `${baseUrl}/v1.0/cycles/${id}/incidents/${level}`,
    {
      headers: {
        Accept: "application/json",
        "X-Cyclr-Account": accountId,
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );
  return incidents.data;
}