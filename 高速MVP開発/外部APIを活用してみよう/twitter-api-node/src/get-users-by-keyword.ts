import { TwitterApi } from "twitter-api-v2";
require("dotenv").config();

const token = process.env.BEARER_TOKEN;
if (!token) throw new Error("token not found");

const twitterClient = new TwitterApi(token);

const main = async () => {
  try {
    const keyword = process.argv[2];
    if (!keyword) throw new Error("keyword not found");

    const roClient = twitterClient.readOnly;
    const res = await roClient.v2.search(keyword, {
      max_results: 100,
      "user.fields": ["username"],
      expansions: ["author_id"],
    });

    console.log(res.data.includes?.users);
  } catch (error) {
    console.log(error);
  }
};
main();
