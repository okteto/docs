const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: '6icyfeiq',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token: 'skBWYm1bttjdbCP4yb8KRhkFVDklIXz9xIEzbs8qbSR3wb2shYj8AauwqgJe6hCpC9fkVaal5YDWBO6Ay',
})

const handler = async (event) => {
  
  // Only allow POST
  /* if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  } */

  const {feedback, pageURL, helpful} = event.queryStringParameters;

  const params = new URLSearchParams(event.body);

  console.log("event", event);
  console.log("Feedback", event.body.feedback);

  console.log("body", event.body);

  const doc = {
    "_type": "docsFeedback",
    feedback,
    "pageTitle": "Testing!",
    pageURL,
    "submittedOn": "2022-03-15",
    helpful
  }

  return client
    .create(doc)
    .then(res => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello ${res._id}` }),
      }
    })
    .catch(error => {
      return { statusCode: 500, body: error.toString() }
    })
}

module.exports = { handler }
