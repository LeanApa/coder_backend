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
import TicketManager from './dao/managers/TicketManager.js';
import MockingRouter from './routes/mocking.router.js';
import errorHandler from './middleware/error.js'
import { addLogger } from './utils.js';
import LoggerRouter from './routes/loggerTest.router.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import nodemailer from 'nodemailer';

export const productService = new ProductManager();
export const cartService = new CartManager(); 
export const messagesService = new MessagesManager();
export const ticketService = new TicketManager();

//instancio routers
const cartsRouter = new CartsRouter();
const sessionRouter = new SessionRouter();
const productsRouter = new ProductsRouter();
const viewRouter = new ViewsRouter();
const mockingRouter = new MockingRouter();
const loggerRouter = new LoggerRouter();


const BASE_PREFIX = "/api";
const app = express();
const httpServer = app.listen(8080, ()=>console.log("Listening on port 8080"));
export const socketServer = new Server(httpServer);
mongoose.connect(env.mongoUrl);
const swaggerOptions = {
    definition:{
        openapi: "3.0.1",
        info:{
            title: "Documentación API Coderhouse",
            description: "API Ecommerce Coderhouse"
        }
    },
    apis:['src/docs/**/*.yaml']
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl:env.mongoUrl,
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
app.use(errorHandler);
app.use(addLogger);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.use(`${BASE_PREFIX}/products`, productsRouter.getRouter());
app.use(`${BASE_PREFIX}/carts`, cartsRouter.getRouter());
app.use('/', viewRouter.getRouter());
app.use(`${BASE_PREFIX}/sessions`, sessionRouter.getRouter());
app.use('/mockingproducts', mockingRouter.getRouter());
app.use('/loggertest', loggerRouter.getRouter());

socketServer.on('connection', (socket)=>{
    console.log("nuevo cliente conectado");

    socket.on('message', async (data) => {
        await messagesService.addMessages(data);
        const messages = await messagesService.getAllMessages();
        socketServer.emit('messageLogs',messages);
    })
})

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'lea.apagro@gmail.com',
      pass: 'sobtvqogbbvxpraj'
    }
  });
  

app.get('/mail', async (req,res)=>{
    try {
        //Tuve que agregar esta linea para que no me de error al enviar el mail, intenté con el código del profe pero no funcionó
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
        let result = await transporter.sendMail({
            from:'Prueba <lea.apagro@gmail.com>',
            to:'leandroapablazagrobli@gmail.com',
            subject:'prueba',
            html:`
            <div>
                <h1>pruebites</h1>
            </div>`,
            attachments:[]
        })
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
        res.send({message: "Mensaje enviado", payload: result});
    } catch (error) {
        console.log(error);
    }
})





