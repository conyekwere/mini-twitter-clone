const express = require('express');
const cors = require('cors');
const app = express();
const rateLimit = require("express-rate-limit");
const port = process.env.PORT || 5000;
const monk = require('monk');
require('dotenv').config()
const Filter = require('bad-words');
const db = monk('mongodb://localhost:27017/meower' || process.env.ATLAS_URI);
const mews = db.get("mews"); //mews is the name of the collection in mongo
require('dotenv').config()


filter = new Filter();

app.use(cors()); // cors is an express middle ware that allows you to access http headers 
app.use(express.json());

app.get('/',(req, res) => { //request,response
    res.json({ 
        message: "meow meow !"
    });
});


app.get('/mews',(req, res) => { //when getting data with https get request, find all and return response as json
    mews.find().then (mews =>{
        res.json(mews);
    })
});

// when you first load the index 
isValidMew = (mew) => { 
    return mew.name && mew.name.toString().trim() !== '' && mew.content && mew.content.toString().trim() !== ''
};

app.use( rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1 // limit each IP to 100 requests per windowMs
  }))

app.post('/mews',(req, res) => {
    if (isValidMew(req.body)){
    const mew = {
        name: filter.clean(req.body.name.toString().trim()), 
        content: filter.clean(req.body.content.toString().trim()),
        created: new Date()
    };
    mews.insert(mew) // insert http request into db via parametters
    .then(createdMew =>{
    res.json(createdMew);  //once its inseted parse as json
    });
    } else{
        res.status(422);
        res.json({
            message: 'Name and content required'
        })
    }
});



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});