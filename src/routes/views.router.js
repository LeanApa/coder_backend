import authMdw from "../middleware/auth.js";
import  CustomRouter  from "./router.router.js";
import { passportCall } from "../utils.js";
import { login, ticket, usersAdmin, realtimeproducts, getAllMessages, getProducts, getProductsByCartId, loginRender, register, verify, passwordReset } from "../controllers/views.controller.js";

export default class ViewsRouter extends CustomRouter{

    init(){
        this.get('/',["PUBLIC"], login);
        
        this.get('/realtimeproducts',["PUBLIC"], realtimeproducts);
        
        this.get('/chat',["USER"], getAllMessages)
        
        this.get('/products',["PUBLIC"],passportCall('jwt'), getProducts);
        
        this.get('/carts/:cid',["PUBLIC"],passportCall('jwt'), getProductsByCartId);       
        
        this.get("/login",["PUBLIC"], loginRender);
        
        this.get("/register",["PUBLIC"], register);

        this.get("/verify",["PUBLIC"], verify);

        this.post("/passwordreset", ["PUBLIC"], passwordReset);

        this.get("/users", ["ADMIN"], usersAdmin);

        this.get("/tickets/:tid", ["USER","PREMIUM"], ticket);

    }
}
