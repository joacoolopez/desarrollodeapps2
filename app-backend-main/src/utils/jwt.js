import jwt from 'jsonwebtoken';

const sign = jwt.sign;
const verify = jwt.verify;

const generarTokenUsuario = (id) => {
    const token = sign({id}, process.env.JWT_SECRET)
    return token
}

const verifyToken = (token) => {
    const valid = verify(token, process.env.JWT_SECRET)
    return valid
}


export {generarTokenUsuario, verifyToken}