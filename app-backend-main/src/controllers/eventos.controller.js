import eventosService from '../services/eventos.service.js';
import { v4 as uuidv4 } from 'uuid';

const getEventos = async (req, res) => {
    try {
        const response = await eventosService.getEventos()
        res.status(200).send(response)
    } catch (error) {
        res.status(400).send(error)
    }
}

const postEvento = async (req, res) => {
    try {
        //const id = uuidv4()
        const id = req.idEvento
        const {nombre, descripcion, ubicacion, fecha, habilitado, estadio, cantidadSectorGeneral, precioGeneralBEAT, cantidadSectorVip, precioVipBEAT, cantidadSectorIzquierda, precioIzquierdaBEAT, cantidadSectorDerecha, precioDerechaBEAT} = req.body
        const response = await eventosService.postEvento(id, nombre, descripcion, ubicacion, fecha, habilitado, estadio, cantidadSectorGeneral, precioGeneralBEAT, cantidadSectorVip, precioVipBEAT, cantidadSectorIzquierda, precioIzquierdaBEAT, cantidadSectorDerecha, precioDerechaBEAT)
        res.status(200).send(response)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

const editEvento = async (req, res) => {
    try {
        const id = req.params.idEvento;
        const {
            nombre,
            descripcion,
            ubicacion,
            fecha,
            habilitado,
            estadio,
            precioGeneralBEAT,
            precioVipBEAT,
            precioIzquierdaBEAT,
            precioDerechaBEAT
        } = req.body;

        const response = await eventosService.editEvento(
            id,
            nombre,
            descripcion,
            ubicacion,
            fecha,
            habilitado,
            estadio,
            precioGeneralBEAT,
            precioVipBEAT,
            precioIzquierdaBEAT,
            precioDerechaBEAT
        );
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

const getEvento = async (req, res) => {
    try {
        const idEvento = req.params.idEvento
        console.log(idEvento)
        const response = await eventosService.getEvento(idEvento)
        res.status(200).send(response)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

const getImagen = async (req, res) => {
    try {
        const id = req.params.idEvento
        eventosService.getImagen(res, req.params.idEvento);
    } catch (error) {
        
    }
}

export {getEventos, postEvento, editEvento, getEvento, getImagen}