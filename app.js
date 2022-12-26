const express = require('express')
const mongoose = require('mongoose')
const app = express()
const config = require("./config/config");
const formRouter = require("./routes/form");
const port = config.app.port;
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['homepage.html'],
  maxAge: '1m',
  redirect: false
}
var options2 = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['preorder.html'],
  maxAge: '1m',
  redirect: false
}
mongoose.set('strictQuery', true);
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(config.db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
  app.use("/", express.static('public', options));
  app.use("/preorder", express.static('public', options2));
  app.use(express.json());
  //Routes go here
  app.use("/",formRouter);
  //Connect to the database before listening
  connectDB().then(() => {
      app.listen(port, () => {
          console.log("listening for requests");
      })
  })