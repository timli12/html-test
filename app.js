const express = require('express')
const mongoose = require('mongoose')
const config = require("./config/config");
const app = express()
mongoose.set('strictQuery', true);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

//Routes go here
app.all('*', (req,res) => {
    res.json({"every thing":"is awesome"})
})

//Connect to the database before listening
connectDB().then(() => {
    app.listen(config.app.port, () => {
        console.log("listening for requests");
    })
})