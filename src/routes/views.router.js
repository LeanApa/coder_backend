import { Router } from "express";

const router = Router();

router.get('/',(req,res)=>{
    let testUser = {
        name: "Jorge",
        lastName: "testLastName"
    }

    res.render('index', testUser);
})

export default router;