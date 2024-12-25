import mercadoSecundarioService from '../services/mercadosecundario.service.js';
import eventosService from '../services/eventos.service.js';

const postEntrada = async (req, res) => {
    try {
        const idUsuario = req.idUsuario
        const {idEntrada, valor} = req.body
        const response = await mercadoSecundarioService.postEntrada(idUsuario, idEntrada, valor)
        
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const comprarEntrada = async (req, res) => {
    try {
        const idUsuario = req.idUsuario
        const {idPublicacion} = req.body
        const response = await mercadoSecundarioService.comprarEntrada(idUsuario, idPublicacion)
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}


const pagarEntrada = async (req, res) => {
    try {
        const idUsuario = req.idUsuario
        const {idPublicacion} = req.body
        const response = await mercadoSecundarioService.pagarEntrada(idUsuario, idPublicacion)
        res.status(200).send(response)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const getPublicaciones = async (req, res) => {
    try {
        const publicaciones = await mercadoSecundarioService.getPublicaciones();
        const eventos = await eventosService.getEventos();

        // publicaciones.filter((p) => {
        //     eventos.forEach((e) => {
        //         if(p.idEvento === e.id) {
        //             if(e.habilitado === true) {
        //                 return p;
        //             }
        //         }
        //     })
        // });
        
        publicaciones.filter(p => 
            eventos.some(e => p.idEvento === e.id && e.habilitado)
        );

        res.status(200).send(publicaciones);
    } catch (error) {
        res.status(500).send(error.message)
    }
    
}

const deletePublicacion = async (req, res) => {
    try {
        const idUsuario = req.idUsuario
        const idEntrada = req.params.idEntrada
        const response = await mercadoSecundarioService.deletePublicacion(idUsuario, idEntrada)
        res.status(200).send({response})
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export {postEntrada, pagarEntrada, getPublicaciones, deletePublicacion, comprarEntrada}