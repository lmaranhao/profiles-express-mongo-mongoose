const mongoose = require('mongoose')

mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB = process.env.MONGODB_URI;

async function main(){
  try {
    await mongoose.connect(mongoDB);
    console.log(`connected to ${mongoDB}`)
  } catch(e) {
    console.error(e)
  }
}

module.exports = main
