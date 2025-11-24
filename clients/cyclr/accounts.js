import axios from "axios";
import { token, baseUrl } from "./config.js";

export default async function getAccounts() {
  const bearerToken = await token();
  const accounts = await axios.get(`${baseUrl}/v1.0/accounts`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    params: {
      pageSize: 5000
    },
  });
  const accountInfo = accounts.data.map((item) => {
    return { Id: item.Id, Name: item.Name };
  });
  return accountInfo;
}

getAccounts();
