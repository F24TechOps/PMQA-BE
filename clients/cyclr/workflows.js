//take aacounts/workflow/run from cyclr and link to steps etc.

import axios from "axios";
import { token, baseUrl, testAccountId } from "./config.js";

async function getWorkflows(cyclrAccountId, page = 1) {
    try {
        const workflowToken = await token()
        const workflows = await axios.get(`${baseUrl}/v1.0/cycles`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${workflowToken}`,
                'X-Cyclr-Account': cyclrAccountId,
            },
            params: {
                pageSize: 10,
                page: page
            }
        })

         return workflows.data.map(item => ({
      Id: item.Id,
      Name: item.Name,
    }));
  } catch (error) {
    console.error("Error fetching workflows:", error.message);
    throw error;
  }
}
getWorkflows(testAccountId);

export default getWorkflows