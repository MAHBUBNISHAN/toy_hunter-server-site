const express =require('express');
const app = express();
const cors = require ('cors');
const port =process.env.PORT || 5000;

const catagories= require('./data/catagories.json');
const toy = require('./data/toy.json')

app.use(cors());

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