'use strict';

const axios = require('axios');

exports.corsProxy = async (event) => {
  let params = event.queryStringParameters;

  if (!params.url) {
    return {
      statusCode: 400,
      body: 'Unable get url from \'url\' query parameter'
    }
  }

  try {
    let originalRequestBody = event.body;

    const response = await axios({
      method: event.httpMethod,
      url: params.url,
      headers: event.headers['Authorization'] ? { 'Authorization': event.headers['Authorization']} : null,
      data: event.httpMethod === 'POST' ? JSON.parse(originalRequestBody) : null
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "https://tesletter.com", 
        "Access-Control-Allow-Credentials" : true,
        "content-type": response.headers['content-type']
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
     if (error.response) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.data),
      }
    } else {
      return {
        statusCode: 500,
        body: error.message,
      }
    }
  }
};