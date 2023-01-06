const express = require('express')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo').default;
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
        })
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
    store: MongoStore.create({ mongoUrl: config.db.url })
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
