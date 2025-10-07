import "dotenv/config";
import axios from "axios";
import qs from "qs";

export const cyclrKey = process.env.CYCLR_API_KEY;
export const cyclrSecret = process.env.CYCLR_API_SECRET;
export const baseUrl = "https://apiintegrations.force24.co.uk";

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
