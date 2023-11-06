const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors')
require('dotenv').config()
// const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;


// middlewarw 
app.use(cors())
app.use(express.json())
// app.use(bodyParser())


const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database collection
    const jobs = client.db("trust").collection("jobs")

    // create jobs
    app.post("/jobs", async(req,res)=>{
       const job = req.body;
       const result = await jobs.insertOne(job)
       console.log(result)
       res.send(result)
    })

    // get all jobs
    app.get("/jobs", async(req,res)=>{
        let query  = {};
        // console.log(query)
        if(req.query?.email){
            query = { email : req.query.email}
        }
        const result = await jobs.find(query).toArray();
        // console.log(result)
        res.send(result)
    })






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get("/",(req,res)=>{
    res.send("Home route")
})



app.listen((port), ()=>{
    console.log(`Localhost connect on ${port}`)
})