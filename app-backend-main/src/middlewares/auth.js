import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).send('Acceso denegado');
        }  
        const firma = verifyToken(token)
        if (firma){
            req.idUsuario = firma.id
            console.log(firma.id)
            next();
        }
    } catch (error) {
        res.status(400).send('Token inválido');
    }
};

export {authMiddleware}