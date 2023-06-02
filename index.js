require('dotenv').config()
const express =require('express');
const app = express();

const cors = require ('cors');
const port =process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const catagories= require('./data/catagories.json');
const toy = require('./data/toy.json')


const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors())
app.options("", cors(corsConfig))

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
    client.connect();

    const categoryCollection=client.db('toyHunter').collection('categories');
    const bookingCollection=client.db('toyHunter').collection('bookings');
   

    app.get('/categories', async(req,res)=>{
      // get all from categories collection sorted ascending by createdAt
      
      // const result = await categoryCollection.find().toArray();
      const result = await categoryCollection.find().limit(20).toArray();

      res.send(result);
    })

    app.get("/set", async (req,res)=>{
      // fetch the categories and add some data and update all those categories
      const categories = await categoryCollection.find().toArray();
      const updatedCategories = categories.map(category => {
        return {
          ...category,
          sellerEmail: "test@gmail.com",
          sellerName: "test",
          name:"Toy Name",
          description:"Toy Description",
          quantity: 10,
          category: "Toy Category",
        }
      });
      updatedCategories.forEach(async category => {
        const query = { _id: new ObjectId(category._id) };
        const updateDoc = {
          $set: {
            ...category

          }
        };
        await categoryCollection.updateOne(query, updateDoc);
      });
      res.send("done");

    })

    app.get('/categories/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}

      // const options={
      //   projection:{category:1, seller:1,price:1}
      // }

      const result = await categoryCollection.findOne(query);
      res.send(result);
    })

    app.post('/toy', async (req, res) => {
      const toy = req.body;
      // console.log(toy);
      const result = await categoryCollection.insertOne(toy);
      res.send(result);
    })

    app.get('/toy/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      console.log(result)
      res.send(result);


    });


    app.get('/toys/:email', async (req, res) => {

      // get categories that are created by the logged in user
      const email = req.params.email;
      const query = { sellerEmail: email };
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    })

    app.patch('/toy/:id', async (req, res) => {
      // update the category with the given id
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          ...req.body
        }
      };
      const result = await categoryCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete('/toy/:id', async (req, res) => {
      // delete the category with the given id
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);

    });
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
app.get('/toy/:id',(req,res)=>{
    const id =req.params.id;
    const singleToy = toy.find(toy=>toy.id===id);
    res.send(singleToy)
})
app.listen(port,()=>{
    console.log(`toy is working on http://localhost:${port} `)
})