const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("Home route")
})


app.listen((port), ()=>{
    console.log(`Localhost connect on ${port}`)
})