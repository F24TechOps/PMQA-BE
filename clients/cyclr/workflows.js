//take aacounts/workflow/run from cyclr and link to steps etc.

import axios from "axios";
import { token, baseUrl, testAccountId } from "./config.js";

async function getWorkflows(cyclrAccountId, page = 1) {
    try {
        const workflowToken = await token()
        const workflows = await axios.get(`${baseUrl}/v1.0/cycles`, {
            headers: {
                Accept: "appplication/json",
                Authorization: `Bearer ${workflowToken}`,
                'X-Cyclr-Account': cyclrAccountId,
            },
            params: {
                pageSize: 10,
                page: page
            }
        })

        return workflows.data.map(item => item.Name)
    }
    catch (error) {
        console.log(error, "Cyclr error")
    }
}
getWorkflows(testAccountId);

export default getWorkflows