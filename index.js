const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        if(req.query?.email || req.query?.category){
            query = { email : req.query.email || req.query.category}
        }
        const result = await jobs.find(query).toArray();
        // console.log(result)
        res.send(result)
    })

    // get single job by id
    app.get("/jobs/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await jobs.findOne(query)
        console.log(result)
        res.send(result)
    } )

    // update single job
    app.put("/jobs/:id", async(req,res)=>{
        const id = req.params.id;
        const job = req.body;
        // console.log("id",id)
        // console.log("job", job)
        const filter = {_id: new ObjectId(id)}
        const options = {updsert:true}
        const updatedJob = {
            $set:{
                j_title:job.j_title ,
                deadline:job.deadline,
                description:job.description,
                category:job.category,
                min_price:job.min_price,
                max_price:job.max_price
            }
        }

        const result = await jobs.updateOne(filter,updatedJob,options)
        res.send(result)
    })

    // delete job
    app.delete("/jobs/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await jobs.deleteOne(query)
        res.send(result)
    })

    // jobs fetch by category
    // app.get("/jobs",)

    // this is project bit parts
    const bids = client.db("trust").collection("bids")

    // create all bids
    app.post("/bids", async(req,res)=>{
        const bid = req.body;
        // console.log(bid)
        const result = await bids.insertOne(bid)
        console.log(result)
        res.send(result)

    })

    // user bids jobs
    app.get("/bids",async(req,res)=>{
        const user_Email = req.query.email;
        // console.log(user_Email)
        const query = {seller_email : user_Email}
        const result = await bids.find(query).toArray();
        res.send(result)
    })

    // my jobs , which user or seller bid Request
    app.get("/bidrequests",async(req,res)=>{
        const user_Email = req.query.email;
        // console.log(user_Email)
        const query = {buyer_email : user_Email}
        const result = await bids.find(query).toArray();
        res.send(result)
    })


    //  update bid request
    app.put("/bid/update/:id", async(req,res) =>{
        const id = req.params.id;
        const query = req.body;
        console.log("id:::",id)
        console.log("status",query.job_Status)

        const newId = {_id: new ObjectId(id)}
        const options = {updsert:true}
        const updatedBid = {
            $set:{
               job_Status: query.job_Status
            }
        }

        const result = await bids.updateOne(newId,updatedBid,options)
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