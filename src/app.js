import express, { urlencoded } from 'express';
import ProductManager from './ProductManager';

const productManager = new ProductManager(); 
const app = express();

app.listen(8080);
app.use(express.urlencoded({extended:true}))

app.get('/products',(req,res)=>{
res.send("La pruebita");
})