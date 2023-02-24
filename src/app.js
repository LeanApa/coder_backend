import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js'
import productsRoutes from './routes/products.router.js'
import cartsRoutes from './routes/carts.router.js'
import viewRoutes from './routes/views.router.js'

export const productManager = new ProductManager();
export const cartManager = new CartManager(); 


const app = express();
const BASE_PREFIX = "/api"

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.listen(8080, ()=>console.log("Listening on port 8080"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(`${BASE_PREFIX}/products`, productsRoutes);
app.use(`${BASE_PREFIX}/carts`, cartsRoutes);
app.use('/', viewRoutes);



