import express, { urlencoded } from 'express';

const app = express();

app.listen(8080);
app.use(express.urlencoded({extended:true}))

app.get('/products',(req,res)=>{
res.send("La pruebita");
})