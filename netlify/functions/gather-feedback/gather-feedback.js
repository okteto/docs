const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: process.env.SANITY_PROJECTID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_TOKEN,
})

const handler = async (event) => {

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const {feedback, pageURL, helpful, pageTitle, submittedOn} = JSON.parse(event.body);

  const doc = {
    "_type": "docsFeedback",
    feedback,
    pageTitle,
    pageURL,
    submittedOn,
    helpful
  }

  return client
    .create(doc)
    .then(res => {
      return {
        statusCode: 200,
        "Access-Control-Allow-Origin": "*"
      }
    })
    .catch(error => {
      return { statusCode: 500, body: error.toString() }
    })
}

module.exports = { handler }
