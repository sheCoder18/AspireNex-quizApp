const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
 require('dotenv').config();
const bodyParser = require("body-parser");
const userRoutes = require('./routes/users')

const app = express();  // calling express as a function and storing it in object
let server;

//middlware config
app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}));
app.use(bodyParser.json({limit: "20mb"})); // transfer into json format 

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.DB_URL)
.then(()=> console.log("Database connection established"))
.catch(er => console.log('Error connecting to mongodb instance', er));

server = app.listen(PORT, ()=>
{
    console.log(`Server is listening at port : ${PORT}`);
});


