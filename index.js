const express =require('express');
const app = express();
const port =process.env.PORT || 5000;

const catagories= require('./data/catagories.json');

app.get ('/',(req,res)=>{
    res.send('toy is .......')
});

app.get('/catagories',(req,res)=>{
    res.send(catagories)
})
app.listen(port,()=>{
    console.log(`toy is working on port:${port} `)
})