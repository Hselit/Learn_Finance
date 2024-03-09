const express = require("express");
const app = express();
const people = require('./data');
const body = require('body-parser')

app.use(express.static('/public'));

app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/public/form.html');
});

app.post("/add",(req,res)=>{
    const name = req.body.name;
    console.log(name);
    res.sendStatus(201).json(people);
});

app.put("/edit/:id",(req,res)=>{
    res.sendStatus(201).send("<h2>Edited Successfully..<h2>");
});

app.delete("/delete/:id",(req,res)=>{
    res.sendStatus(201).send("<h2>Added Successfully..</h2>");
});

app.get("*",(req,res)=>{
    res.sendStatus(404).send("<h2>Page Not Found</h2>");
});



app.listen(3000,()=>{
    console.log("Server running @3000");
})