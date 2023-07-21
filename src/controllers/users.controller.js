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

export const documents = async (req,res) => {
    try {
        const {uid} = req.params;
        const user = await userModel.findById(uid);
        let documents = [];
        if (!req.files) {
            res.status(400).send('Ningún archivo fue cargado');
        }
        if (req.files.product) {
            documents.push({name: req.files.product[0].filename, reference: req.files.product[0].path});
        }
        if (req.files.profile) {
            documents.push({name: req.files.profile[0].filename, reference: req.files.profile[0].path});
        }
        if (req.files.document) {
            documents.push({name: req.files.document[0].filename, reference: req.files.document[0].path});
        }
        user.documents.push(...documents);
        await userModel.findByIdAndUpdate(uid,user);
        req.logger.info('Archivos cargados correctamente', documents);
        res.status(200).send('Archivos cargados correctamente');
    } catch (error) {
        req.logger.error(error);
    }

}
