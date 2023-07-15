import CustomRouter from "./router.router.js";
import {transporter} from "../utils.js";
import jwt from "jsonwebtoken";

export default class MailRouter extends CustomRouter{
    
    init(){

        this.post('/reset',["PUBLIC"],async (req,res)=>{
            try {
                //Tuve que agregar esta linea para que no me de error al enviar el mail, intenté con el código del profe pero no funcionó
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

                const token = jwt.sign({}, 'secreto', { expiresIn: 60*60 });
                const {toMail} = req.body;
                const link = `http://localhost:8080/verify?token=${token}&tomail=${toMail}`;
                let result = await transporter.sendMail({
                    from:'TiendaRopa <lea.apagro@gmail.com>',
                    to: toMail,
                    subject:'Reseteo de contraseña',
                    html:`
                    <div>
                        <h1>Resetear contraseña</h1>
                        <p>Si pasó más de una hora se le redirigirá al "Inicio de Sesión" y podrá solicitar nuevamente el reseteo de contraseña</p>
                        <button><a href="${link}">Resetear</a></button>
                    </div>`,
                    attachments:[]
                })
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
                res.redirect('/login');
            } catch (error) {
                console.log(error);
            }
        });
    }
    
}
