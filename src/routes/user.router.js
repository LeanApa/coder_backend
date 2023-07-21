import { documents, getUsers, premiumUser,deleteUsers } from "../controllers/users.controller.js";
import { uploader } from "../utils.js";
import  CustomRouter  from "./router.router.js";


export default class UsersRouter extends CustomRouter{
    init(){
        this.get('/',["PUBLIC"], getUsers)
        this.delete("/",['PUBLIC'], deleteUsers);
        this.get("/premium/:uid",['PUBLIC'], premiumUser);
        this.post("/:uid/documents",['PUBLIC'], uploader, documents);
        
    }
 
}