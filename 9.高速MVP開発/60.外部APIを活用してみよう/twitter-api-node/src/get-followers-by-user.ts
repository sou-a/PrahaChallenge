import { TwitterApi } from "twitter-api-v2";
require("dotenv").config();

const token = process.env.BEARER_TOKEN;
if (!token) throw new Error("token not found");

const twitterClient = new TwitterApi(token);

const main = async () => {
  try {
    const userId = process.argv[2];
    if (!userId) throw new Error("userId not found");

    const roClient = twitterClient.readOnly;
    const res = await roClient.v2.followers(userId, {
      max_results: 100,
    });

    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
main();
