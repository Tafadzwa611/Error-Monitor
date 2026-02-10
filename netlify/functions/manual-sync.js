
const fetchEmails = require('./fetch-emails');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  return fetchEmails.handler(event);
};
