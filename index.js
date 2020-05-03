const express =require('express');
const app=express();
const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://reactblog:reactblog@react-blog-cluster-c17cr.mongodb.net/test?retryWrites=true&w=majority',{
   useUnifiedTopology: true,
   useNewUrlParser:true,
   //useFindAndModify: true
}).then(()=>console.log('DB connected'))
.catch(err=>console.error(err));


app.get('/',(req,res)=>{
res.send('hello world')
});

app.listen(5000);