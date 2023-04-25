import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from './dao/managers/ProductManager.js';
import CartManager from './dao/managers/CartManager.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import MessagesManager from './dao/managers/MessageManager.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import CartsRouter from './routes/carts.router.js';
import SessionRouter from './routes/session.router.js';
import ProductsRouter from './routes/products.router.js';
import ViewsRouter from './routes/views.router.js';
import cors from 'cors';
import env from './config/config.js';

export const productManager = new ProductManager();
export const cartManager = new CartManager(); 
export const messagesManager = new MessagesManager();

//instancio routers
const cartsRouter = new CartsRouter();
const sessionRouter = new SessionRouter();
const productsRouter = new ProductsRouter();
const viewRouter = new ViewsRouter();

const BASE_PREFIX = "/api";
const app = express();
const httpServer = app.listen(8080, ()=>console.log("Listening on port 8080"));
export const socketServer = new Server(httpServer);
mongoose.connect(env.mongoUrl);



app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://leaapagro:1234@ecommerce.h9vznv2.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions:{useNewUrlParser: true, useUnifiedTopology:true},
        ttl:60*3600
    }),
    secret:"s3cr3tPassw0rd",
    resave:false,
    saveUninitialized:false
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.use(`${BASE_PREFIX}/products`, productsRouter.getRouter());
app.use(`${BASE_PREFIX}/carts`, cartsRouter.getRouter());
app.use('/', viewRouter.getRouter());
app.use(`${BASE_PREFIX}/sessions`, sessionRouter.getRouter());

socketServer.on('connection', (socket)=>{
    console.log("nuevo cliente conectado");

    socket.on('message', async (data) => {
        await messagesManager.addMessages(data);
        const messages = await messagesManager.getAllMessages();
        socketServer.emit('messageLogs',messages);
    })
})





