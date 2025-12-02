import axios from "axios";
import { token, baseUrl } from "./config.js";

export default async function getTransactionByID(accountID, cycleId, id) {
  const bearerToken = await token();
  const transaction = await axios.get(`${baseUrl}/v1.0/cycles/${cycleId}/transactions/${id}
`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
      "X-Cyclr-Account": accountID
    },
    params: {
      cycleId,
      id
    },
  });
  
  return transaction.data;
}
