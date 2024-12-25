import usuarioService from '../services/usuario.service.js';

const getImagen = async (req, res) => {
    try {
        const idUsuario = req.params.idUsuario
        usuarioService.getImagen(res, idUsuario);
    } catch (error) {
        
    }
}

export {getImagen}