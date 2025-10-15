import "dotenv/config";
import axios from "axios";
import qs from "qs";

export const cyclrKey = process.env.CYCLR_API_KEY;
export const cyclrSecret = process.env.CYCLR_API_SECRET;
export const baseUrl = "https://apiintegrations.force24.co.uk";
export const testCycleId = "cb6ff75b-e87c-4602-b63e-d48b3f54ee5a";
export const testAccountId = "7fcb9aae-c368-46cc-9fd2-4cba6184c90d";

export async function token() {
  const token = await axios.post(
    `${baseUrl}/oauth/token`,
    qs.stringify({
      grant_type: "client_credentials",
      client_id: cyclrKey,
      client_secret: cyclrSecret,
    })
  );
  return token.data.access_token;
}
