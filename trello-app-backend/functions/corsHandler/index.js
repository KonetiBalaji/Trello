/**
 * CORS Handler Lambda Function
 * Handles OPTIONS preflight requests for CORS
 */
exports.handler = async (event) => {
  const origin = event.headers?.Origin || event.headers?.origin || '*';
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Max-Age': '600',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: 'CORS preflight successful' })
  };
};

