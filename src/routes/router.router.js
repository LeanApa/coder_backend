import {Router} from 'express';

export default class CustomRouter{
    constructor(){
        this.router = Router();
        this.init();
    }

    getRouter(){
        return this.router;
    }

    init(){}

    get(path, policies, ...callbacks){
        console.log("LA POLITICA ES ESTA EN GET: ", policies)
        this.router.get(path,this.handlePolicies(policies),this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks){
        this.router.post(path,this.handlePolicies(policies),this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    put(path, policies, ...callbacks){
        this.router.put(path,this.handlePolicies(policies),this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    delete(path, policies, ...callbacks){
        this.router.delete(path,this.handlePolicies(policies),this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    

    applyCallbacks(callbacks){
        return callbacks.map((callback)=>async(...params)=>{
            try {
                await callback.apply(this, params);
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error);
            }
        });
    }

    generateCustomResponses = (req,res,next)=>{
        res.sendSuccess = payload => res.send({status:"success",payload});
        res.serdServerError = error => res.status(500).send({status:"error",error});
        res.sendUserError = error=> res.status(400).send({status:"error",error});
        next();
    }

    handlePolicies = policies => (req,res,next)=>{
        console.log("LA POLITICA ES ESTA: ", policies[0])
        if(policies[0]==="PUBLIC") return next();
        const authHeaders = req.headers.authorization;
        if(!authHeaders) return res.status(401).send({status:"error",error:"Unauthorized"});
        const token = authHeaders.split(" ")[1];
        let user = jwt.verify(token, 's3cr3tPassw0rd');
        if(!policies.includes(user.rol.toUpperCase())) return res.status(403).send({status:"error",error:"Forbidden"});
        req.user = user;
        next();
    
    }
    
}


