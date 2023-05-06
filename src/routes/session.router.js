import { Router } from "express";
import  passport  from "passport";
import { userModel } from "../dao/models/users.model.js";
import { generateToken, passportCall } from "../utils.js";
import { authorization } from "../middleware/auth.js";
import  CustomRouter  from "./router.router.js";

export default class SessionRouter extends CustomRouter{
    init(){
        this.get("/logout",['PUBLIC'], async (req, res)=>{
           /*  req.session.destroy((err)=>{
                if (!err) {
                return res.redirect("/login");
                }
                return res.send({message: "error al intentar desconectarse"});
            }) */
            return res.clearCookie('cookieToken',{httpOnly:true}).redirect("/login");
        });
        
        this.get('/github',['PUBLIC'], passport.authenticate('github',{scope:['user:email']}), async(req,res)=>{});
        
        this.get('/githubcallback',['PUBLIC'], passport.authenticate('github', {failureRedirect:'/login'}),async(req,res)=>{
            const user = req.user
            let token = generateToken(user)
            res.cookie('cookieToken',token,{
                maxAge:60*60*1000,
                httpOnly:true
            }).redirect('/products');
        });
        
        
        this.post('/login',['PUBLIC'],passport.authenticate('login',{failureRedirect:'/faillogin'}),async (req,res)=>{
            const {email, password} = req.body;
            const user = await userModel.findOne({email:email});
            console.log("usuario generate token",user)
            let token = generateToken(user)
            res.cookie('cookieToken',token,{
                maxAge:60*60*1000,
                httpOnly:true
            }).redirect("/products");//.send({message:"Logged in"});
           
           // res.redirect("/products")
        });
            
        this.get('/faillogin',['PUBLIC'], (req,res)=>{
            res.send({error:"Failed Login"});
        });
        
        this.post('/register',['PUBLIC'], passport.authenticate('register',{failureRedirect:'/failregister'}), async (req,res)=>{
        res.redirect("/login")
        });
        
        this.get('/failregister',['PUBLIC'], async(req,res)=>{
            console.log("Failed Strategy");
            res.send({error: "Failed"});
        });

        this.get('/current',['PUBLIC'],passportCall('jwt'), async (req,res)=>{
            res.send(req.user);
        });
        
        /* this.get('/current',['PUBLIC'],passportCall('jwt'),authorization('user'), async (req,res)=>{
            res.send(req.user);
        }); */
    }
 
}



/* const router = Router();

router.get("/logout", async (req, res)=>{
    req.session.destroy((err)=>{
        if (!err) {
        return res.redirect("/login");
        }
        return res.send({message: "error al intentar desconectarse"});
    })
});

router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req,res)=>{});

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}),async(req,res)=>{
    req.session.user = req.user;
    res.redirect('/products');
})


router.post('/login',async (req,res)=>{
   const {email, password} = req.body;
    const user = await userModel.findOne({email:email});
    let token = generateToken(user)
    res.cookie('cookieToken',token,{
        maxAge:60*60*1000,
        httpOnly:true
    }).send({message:"Logged in"});
   
   // res.redirect("/products")
});
    
router.get('/faillogin', (req,res)=>{
    res.send({error:"Failed Login"});
});

router.post('/register', passport.authenticate('register',{failureRedirect:'/failregister'}), async (req,res)=>{
res.redirect("/login")
});

router.get('/failregister', async(req,res)=>{
    console.log("Failed Strategy");
    res.send({error: "Failed"});
});

router.get('/current',passportCall('jwt'),authorization('user'), async (req,res)=>{
    res.send(req.user);
}) */

/* router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}),async (req,res)=>{
if (!req.user) {
    return res.status(400).send({status:"error", error:"invalid credentials"})
}
req.session.user = {
    first_name : req.user.first_name,
    last_name : req.user.last_name,
    age : req.user.age,
    email : req.user.email,
    cart : req.user.cart
}
res.redirect("/products")
});

router.get('/faillogin', (req,res)=>{
res.send({error:"Failed Login"});
});

router.post('/register', passport.authenticate('register',{failureRedirect:'/failregister'}), async (req,res)=>{
res.redirect("/login")
});

router.get('/failregister', async(req,res)=>{
console.log("Failed Strategy");
res.send({error: "Failed"});
}); */

/* router.get('/current', async (req,res)=>{
    res.send(req.session.user);
}) */
