require('dotenv').config()
const express =require('express');
const app = express();

const cors = require ('cors');
const port =process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const catagories= require('./data/catagories.json');
const toy = require('./data/toy.json')



app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u3wor1c.mongodb.net/?retryWrites=true&w=majority `;

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
    // await client.connect();

    const categoryCollection=client.db('toyHunter').collection('categories');
    const bookingCollection=client.db('toyHunter').collection('bookings');
   

    app.get('/categories', async(req,res)=>{
      const cursor =categoryCollection.find();
      const result =await cursor.toArray();
      res.send(result);
    })

    app.get('/categories/:id', async(req,res)=>{
      const id =req.params.id;
      const query ={_id: new ObjectId(id)}

      const options={
        projection:{category:1, seller:1,price:1}
      }
      const result = await categoryCollection.findOne(query,options);
      res.send(result);
    })
    //bookings
    app.get('/bookings',async(req,res)=>{
      const result=await bookingCollection.find().toArray();
      res.send(result);
    })

    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
  });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get ('/',(req,res)=>{
    res.send('toy is .......')
});

app.get('/catagories',(req,res)=>{
    res.send(catagories)
})
app.get('/toy',(req,res)=>{
    res.send(toy)
})
app.listen(port,()=>{
    console.log(`toy is working on port:${port} `)
})