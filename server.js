const startServer = require('./app'); // import the function

const port = process.env.PORT || 3000;
startServer(port);