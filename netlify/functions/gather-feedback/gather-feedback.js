const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_PROJECTID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2021-03-25',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const allowedOrigins = ['https://okteto.com', 'https://www.okteto.com'];

const getHeaders = (origin) => ({
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin)
    ? origin
    : 'https://www.okteto.com',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

const handler = async (event) => {
  const origin = event.headers.origin || '';
  const headers = getHeaders(origin);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed',
    };
  }

  if (!allowedOrigins.includes(origin)) {
    return {
      statusCode: 403,
      headers,
      body: 'Forbidden',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const doc = {
      _type: 'docsFeedback',
      feedback: body.feedback || '',
      pageTitle: body.pageTitle || '',
      pageURL: body.pageURL || '',
      submittedOn: body.submittedOn || new Date().toISOString(),
      helpful: body.helpful || '',
    };

    await client.create(doc);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = { handler };
