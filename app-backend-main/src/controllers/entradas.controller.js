import entradasService from "../services/entradas.service.js"

const comprarEntradas = async (req, res) => {
    try {
        const idUsuario = req.idUsuario
        const {idEvento, cantidadGeneral, cantidadVip, cantidadIzquierda, cantidadDerecha} = req.body
        const response = await entradasService.comprarEntradas(idUsuario, idEvento, cantidadGeneral, cantidadVip, cantidadIzquierda, cantidadDerecha)
        res.status(201).send(response)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const pagarEntradas = async (req, res) => {
    try {
        const {idPago} = req.body
        const response = await entradasService.pagarEntradas(idPago)
        res.status(201).send(response)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const getEntradasPorUsuario = async (req, res) => {
    try {
        const idUsuario = req.idUsuario
        const response = await entradasService.getEntradasPorUsuario(idUsuario)
        res.status(200).send(response)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const transferirEntrada = async (req, res) => {
    try {
        const {mailDesde, mailHasta, idEntrada} = req.body
        const response = await entradasService.transferirEntrada(mailDesde, mailHasta, idEntrada)
        res.status(200).send(response)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const devolverEntrada = async (req, res) => {
    try {
        const idUsuario = req.idUsuario;
        const {idEntrada} = req.body;
        const response = await entradasService.devolverEntrada(idUsuario, idEntrada);
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};


export {comprarEntradas, pagarEntradas, getEntradasPorUsuario, transferirEntrada, devolverEntrada}