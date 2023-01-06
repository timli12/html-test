const express = require('express')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session);
const path = require('path')
const passport = require('passport')
const session = require('express-session');
const LocalStrategy = require('passport-local')
const app = express()
const config = require("./config/config");
const formRouter = require("./routes/form");
const port = config.app.port;
app.use(express.urlencoded({ extended: true }));
mongoose.set('strictQuery', true);
var conn;
const connectDB = async () => {
    try {
            conn = await mongoose.connect(config.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'panguin',
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({
        clientPromise: conn,
        dbName: "session",
        stringify: false,
        autoRemove: 'interval',
        autoRemoveInterval: 1
    })
}));
//Routes go here
app.use(passport.initialize());
app.use(passport.session());
app.use("/", formRouter);
//Connect to the database before listening
connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests");
    })
})
