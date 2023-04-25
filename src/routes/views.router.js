import { Router } from "express";
import session from "express-session";
import { cartManager, messagesManager, productManager } from "../app.js";
import authMdw from "../middleware/auth.js";
import  CustomRouter  from "./router.router.js";
import { passportCall } from "../utils.js";

export default class ViewsRouter extends CustomRouter{

    init(){
        this.get('/',["PUBLIC"], async (req,res)=>{
            return res.redirect('/login');
        })
        
        this.get('/realtimeproducts',["PUBLIC"],authMdw,async (req,res)=>{
            let {limit,page,query,sort} = req.query;
            const queryABuscar = {
                stock: query === 'true' || query === 'false' && query ? query : null,
                category: query !== 'true' && query !== 'false' && query ? query : null 
            };
            
            const products = await productManager.getProducts(limit,page,queryABuscar,sort);
            const {hasNextPage, hasPrevPage, nextPage} = products;
            const nextLink = hasNextPage ? `http://localhost:8080/products/?page=${nextPage}` : null;
            const prevLink = hasPrevPage ? `http://localhost:8080/products/?page=${products.page-1}` : null;
            // res.render('products', {products,nextLink,prevLink});
            res.render('realTimeProducts', {products,nextLink,prevLink});
        })
        
        this.get('/chat',["PUBLIC"],authMdw,async (req,res)=>{
            const messages = await messagesManager.getAllMessages();
            res.render('chat', {messages});
        })
        
        this.get('/products',["PUBLIC"],passportCall('jwt'), async (req,res)=>{
           try {
                console.log("req.user es: ", req.user);
                const user = {
                     first_name: req.user.user ? req.user.user.firt_name : req.session.user.firt_name,
                     last_name: req.user.user ? req.user.user.last_name : req.session.user.last_name, 
                     email: req.user.user ?req.user.user.email : req.session.user.email, 
                     age: req.user.user ? req.user.user.age : req.session.user.age, 
                     rol: req.user.user ? req.user.user.rol : req.session.user.rol
                    };
                let {limit,page,query,sort} = req.query;
                const queryABuscar = {
                    stock: query === 'true' || query === 'false' && query ? query : null,
                    category: query !== 'true' && query !== 'false' && query ? query : null 
                };
                
                const products = await productManager.getProducts(limit,page,queryABuscar,sort);
                const {hasNextPage, hasPrevPage, nextPage} = products;
                const nextLink = hasNextPage ? `http://localhost:8080/products/?page=${nextPage}` : null;
                const prevLink = hasPrevPage ? `http://localhost:8080/products/?page=${products.page-1}` : null;
        
                res.render('products', {products,nextLink,prevLink, user});
           } catch (error) {
            console.log("error", error)
           }
        
        });
        
        
        this.get('/carts/:cid',["PUBLIC"],authMdw,async (req,res)=>{
            const {cid} = req.params;
            const products = await cartManager.getProductsByCartId(cid);
            res.render('cart', {products});
        })
        
        
        this.get("/login",["PUBLIC"], async (req,res)=>{
            res.render("login");
        })
        
        this.get("/register",["PUBLIC"], async(req,res)=>{
            res.render("register");
        })

    }
}
/* const router = Router();

router.get('/', async (req,res)=>{
    return res.redirect('/login');
})

router.get('/realtimeproducts',authMdw,async (req,res)=>{
    let {limit,page,query,sort} = req.query;
    const queryABuscar = {
        stock: query === 'true' || query === 'false' && query ? query : null,
        category: query !== 'true' && query !== 'false' && query ? query : null 
    };
    
    const products = await productManager.getProducts(limit,page,queryABuscar,sort);
    const {hasNextPage, hasPrevPage, nextPage} = products;
    const nextLink = hasNextPage ? `http://localhost:8080/products/?page=${nextPage}` : null;
    const prevLink = hasPrevPage ? `http://localhost:8080/products/?page=${products.page-1}` : null;
    // res.render('products', {products,nextLink,prevLink});
    res.render('realTimeProducts', {products,nextLink,prevLink});
})

router.get('/chat',authMdw,async (req,res)=>{
    const messages = await messagesManager.getAllMessages();
    res.render('chat', {messages});
})

router.get('/products',authMdw, async (req,res)=>{
   try {
        const user = {
             first_name: req.session.user._doc ? req.session.user._doc.firt_name : req.session.user.firt_name,
             last_name:req.session.user._doc? req.session.user._doc.last_name : req.session.user.last_name, 
             email: req.session.user._doc?req.session.user._doc.email : req.session.user.email, 
             age:req.session.user._doc? req.session.user._doc.age : req.session.user.age, 
             rol: req.session.user._doc? req.session.user._doc.rol : req.session.user.rol
            };
        let {limit,page,query,sort} = req.query;
        const queryABuscar = {
            stock: query === 'true' || query === 'false' && query ? query : null,
            category: query !== 'true' && query !== 'false' && query ? query : null 
        };
        
        const products = await productManager.getProducts(limit,page,queryABuscar,sort);
        const {hasNextPage, hasPrevPage, nextPage} = products;
        const nextLink = hasNextPage ? `http://localhost:8080/products/?page=${nextPage}` : null;
        const prevLink = hasPrevPage ? `http://localhost:8080/products/?page=${products.page-1}` : null;

        res.render('products', {products,nextLink,prevLink, user});
   } catch (error) {
    console.log("error", error)
   }

});


router.get('/carts/:cid',authMdw,async (req,res)=>{
    const {cid} = req.params;
    const products = await cartManager.getProductsByCartId(cid);
    res.render('cart', {products});
})


router.get("/login", async (req,res)=>{
    res.render("login");
})

router.get("/register", async(req,res)=>{
    res.render("register");
})




export default router; */