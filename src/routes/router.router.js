import {Router} from 'express';
import jwt from 'jsonwebtoken'
import ENV from '../config/config.js';

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
        req.logger.debug(`LA POLITICA ES ESTA:  ${policies[0]}`);
        req.logger.debug(`req.user :  ${req.user}`);
        if(policies[0]==="PUBLIC") return next();
        const userAgent = req.headers['user-agent'];
        let user;
        if (userAgent.includes('Postman') || userAgent.includes('HTTPClient')){   
            const authHeaders = req.headers.authorization;
            req.logger.debug(`Este es el Authorization:  ${JSON.stringify(authHeaders)}`);
            if(!req.user) return res.status(401).send({status:"error",error:"Unauthorized"});
            const header = authHeaders.split(" ")[1];
            req.logger.debug(`Este es el token:  ${JSON.stringify(header)}`);
            const token = header;
            user = jwt.verify(token,'s3cr3tPassw0rd');
            req.logger.debug(`Este es el user:  ${user}`);
            if(!policies.includes(user.user.rol.toUpperCase())) return res.status(403).send({status:"error",error:"Forbidden"});
        }else if(ENV.node_env === "development"){
            const authHeaders = req.headers.cookie;
            if(!req.user) return res.status(401).send({status:"error",error:"Unauthorized"});
            const header = authHeaders.split("=")[1];
            const token = header.split(";")[0];
            req.logger.info(`Este es TOKEN QUE ROMPE dev:  ${token}`);
            user = jwt.verify(token,'s3cr3tPassw0rd');
            req.logger.debug(`Este es el user:  ${user}`);
            if(!policies.includes(user.user.rol.toUpperCase())) return res.status(403).send({status:"error",error:"Forbidden"});
        }else{
            const authHeaders = req.headers.cookie;
            const {cookieToken} = req.cookie;
            req.logger.info(`Este es TOKEN QUE ROMPE prod:  ${cookieToken}`);
            if(!req.user) return res.status(401).send({status:"error",error:"Unauthorized"});
            const header = authHeaders.split("=")[1];
            const token = header.split(";")[0];
            req.logger.info(`Este es TOKEN QUE ROMPE prod:  ${token}`);
            user = jwt.verify(token,'s3cr3tPassw0rd');
            req.logger.debug(`Este es el user:  ${user}`);
            if(!policies.includes(user.user.rol.toUpperCase())) return res.status(403).send({status:"error",error:"Forbidden"});
        }
        req.user = user;
        next();
    
    }
    
}


