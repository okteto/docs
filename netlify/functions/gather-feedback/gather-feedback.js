const sanityClient = require('@sanity/client')
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

  console.log(event);

  const doc = {
    "_type": "docsFeedback",
    "feedback": "Just testing",
    "pageTitle": "Testing!",
    "pageURL": "https://www.okteto.com/docs/reference/development-environment/",
    "submittedOn": "2022-03-15",
    "helpful": "yes",
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
