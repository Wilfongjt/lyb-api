module.exports = {
  // [Route: / ]
  // [Description: Example of how to handle route to the root of API]
  method: 'GET',
  path: '/',
  handler: async function (req,h) {
    // [Define a / route handler]
    return h.redirect('/documentation');
  },
  options: {
    // [Configure / route options]
    auth: false,
    description: 'API Home',
    notes: 'Returns ',
    tags: ['api','home']
  }
};
