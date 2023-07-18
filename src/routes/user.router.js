import { premiumUser } from "../controllers/users.controller.js";
import  CustomRouter  from "./router.router.js";


export default class UsersRouter extends CustomRouter{
    init(){
        this.get("/premium/:uid",['PUBLIC'], premiumUser);
        
    }
 
}