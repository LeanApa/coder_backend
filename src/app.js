import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from './dao/managers/ProductManager.js';
import CartManager from './dao/managers/CartManager.js';
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import viewRoutes from './routes/views.router.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';

export const productManager = new ProductManager();
export const cartManager = new CartManager(); 

const BASE_PREFIX = "/api";
const app = express();
const httpServer = app.listen(8080, ()=>console.log("Listening on port 8080"));
export const socketServer = new Server(httpServer);
mongoose.connect('mongodb+srv://leaapagro:1234@ecommerce.h9vznv2.mongodb.net/?retryWrites=true&w=majority');



app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.use(`${BASE_PREFIX}/products`, productsRoutes);
app.use(`${BASE_PREFIX}/carts`, cartsRoutes);
app.use('/', viewRoutes);

socketServer.on('connection', ()=>{
    console.log("nuevo cliente conectado");
})



