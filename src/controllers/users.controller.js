import { userModel } from "../dao/models/users.model.js"
import { transporter } from "../utils.js";
import { userDTO } from "../dao/DTO/user.dto.js";


export const getUsers = async (req,res) => {
    let users = await userModel.find();
    console.log(users);
    const usersFiltered = users.map(user => {
        const userFiltered = new userDTO(user);
        return userFiltered;
    });
    res.send(usersFiltered);
}

export const deleteUsers = async (req,res) => {
    try {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
        let users = await userModel.find();
        let deleteDate = new Date();
        deleteDate.setDate(deleteDate.getDate() - (2))
        const sendMail = users.filter(user => user.last_connection < deleteDate);
        for (const user of sendMail) {
            await transporter.sendMail({
                from:'TiendaRopa <lea.apagro@gmail.com>',
                to: user.email,
                subject:'Cuenta eliminada',
                html:`
                <div>
                    <h1>Cuenta eliminada</h1>
                    <p>Su cuenta ha sido eliminada por inactividad de más de dos días</p>
                </div>`,
                attachments:[]
            });
        }
        users = await userModel.deleteMany({last_connection: {$lt: deleteDate}});
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
        
        res.send({message: "Usuarios borrados: ", users});
    } catch (error) {
        req.logger.error(error);
    }

}


export const premiumUser = async (req,res) => {
    try {
        const {uid} = req.params
        const requiredDocuments = ["Identificacion","Comprobante de domicilio","Comprobante de estado de cuenta"]
        let premiumReady = false; 
        let usuarioEncontrado = await userModel.findById(uid);

        if(usuarioEncontrado.rol === "premium"){
           usuarioEncontrado.rol = "user";
        }else{
            const documentsNames = usuarioEncontrado.documents.map(document => document.name);
            premiumReady = requiredDocuments.every(document => documentsNames.includes(document));
            premiumReady ? usuarioEncontrado.rol = "premium" : res.status(400).send({message: "Faltan documentos por subir"});
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
export const deleteUser = async (req,res) => {
    const {uid} = req.params;
    try {
        const user = await userModel.findByIdAndDelete(uid);
        res.send({message: "Usuario eliminado: ",user});
    } catch (error) {
        req.logger.error(error);
    }
}