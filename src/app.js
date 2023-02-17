import express from 'express';
import ProductManager from './ProductManager.js';
import productsRoutes from './routes/products.router.js'
import cartsRoutes from './routes/carts.router.js'

export const productManager = new ProductManager();  
const app = express();
const BASE_PREFIX = "/api"

app.listen(8080);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(`${BASE_PREFIX}/products`, productsRoutes);
app.use(`${BASE_PREFIX}/carts`, cartsRoutes);

