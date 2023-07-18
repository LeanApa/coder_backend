import { userModel } from "../dao/models/users.model.js"

export const premiumUser = async (req,res) => {
    try {
        const {uid} = req.params
        let usuarioEncontrado = await userModel.findById(uid);
        if(usuarioEncontrado.rol === "premium"){
           usuarioEncontrado.rol = "user";
        }else{
            usuarioEncontrado.rol = "premium";
        }
        await userModel.findByIdAndUpdate(uid,usuarioEncontrado);
        res.send(usuarioEncontrado);
    } catch (error) {
        console.log(error);
    }
   
}
