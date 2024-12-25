import EntradaSecundario from "../models/EntradaSecundario.js";
import Usuario from "../models/Usuario.js"
import { v4 as uuidv4 } from 'uuid';
import PagoReventa from "../models/PagoReventa.js";
import { repurchaseTicket } from "../integrations/publishEvent.js";
import Evento from "../models/Evento.js";

const postEntrada = async (idUsuario, idEntrada, valor) => {
    const usuario = await Usuario.findOne ({googleId: idUsuario})
    const entrada = usuario.entradas.find(entrada => 
        entrada.idEntrada === idEntrada &&
        entrada.checkPaga === true &&
        entrada.checkPublicadaEnReventa === false
    );

    if (!entrada){
        throw new Error ("No se encontro la entrada")
    }
    const evento = await Evento.findOne({id: entrada.idEvento})

    const publicacion = await EntradaSecundario.create({
        idPublicacion: uuidv4(),
        idEntrada: idEntrada,
        idEvento: entrada.idEvento,
        nombreEvento: entrada.nombreEvento,
        sector: entrada.sector,
        precioReventa: valor,
        fechaEvento: entrada.fechaEvento,
        idUsuario: idUsuario,
        nombreUsuario: usuario.username,
        idNFT: entrada.idNFT,
        imagenPrincipal: entrada.imagenPrincipal
    })

    entrada.checkPublicadaEnReventa = true
    await usuario.save()
    return publicacion

}

const comprarEntrada = async (idUsuario, idPublicacion) => {
    const publicacion = await EntradaSecundario.findOne({idPublicacion})
    const usuarioComprador = await Usuario.findOne({googleId: idUsuario})
    const usuarioVendedor = await Usuario.findOne({googleId: publicacion.idUsuario})
    const mailUsuarioCompra = usuarioComprador.email
    const mailUsuarioVenta = usuarioVendedor.email
    const idPago = uuidv4()

    console.log({publicacion})

    const pago = await PagoReventa.create({
        idPago: idPago,
        idPublicacion: idPublicacion,
        idUsuario: idUsuario,
        idEvento: publicacion.idEvento,
        precioTotal: publicacion.precioReventa
    })

    usuarioComprador.entradas.push({
        idEntrada: publicacion.idEntrada,
        idPago: idPago,
        checkPaga: false,
        checkPublicadaEnReventa: false,
        idEvento: publicacion.idEvento,
        nombreEvento: publicacion.nombreEvento,
        sector: publicacion.sector,
        precioPago: publicacion.precioReventa,
        fechaEvento: publicacion.fechaEvento,
        imagenPrincipal: publicacion.imagenPrincipal
    })
    await usuarioComprador.save()
    const precioTotal = publicacion.precioReventa
    const idEntrada = publicacion.idEntrada
    const idEvento = publicacion.idEvento
    const idNFT = publicacion.idNFT
    

    await repurchaseTicket(mailUsuarioCompra, mailUsuarioVenta, publicacion.idEntrada, publicacion.idEvento, idPago, precioTotal)
    return ({mailUsuarioCompra, mailUsuarioVenta, idNFT, idEntrada, idEvento, idPago, precioTotal})

}

const pagarEntrada = async (idPago) => {
    const publicacion = await EntradaSecundario.findOne({idPublicacion})
    const usuarioVendedor = await Usuario.findOne({googleId:publicacion.idUsuario})
    usuarioVendedor.entradas.pull({idEntrada: publicacion.idEntrada})

    const usuarioComprador = await Usuario.findOne({googleId: idUsuario})

    usuarioComprador.entradas.push({
        idEntrada: publicacion.idEntrada,
        idPago: "Comprado en Mercado Secundario",
        checkPaga: true,
        idEvento: publicacion.idEvento,
        nombreEvento: publicacion.nombreEvento,
        sector: publicacion.sector,
        precioPago: publicacion.precioReventa,
        fechaEvento: publicacion.fechaEvento,
        imagenPrincipal: publicacion.imagenPrincipal
    })
    
    await usuarioVendedor.save()
    await usuarioComprador.save()
    await EntradaSecundario.deleteOne({ idPublicacion: publicacion.idPublicacion });
}

const getPublicaciones = async () => {
    const publicaciones = await EntradaSecundario.find().lean();
    const eventosHabilitados = await Evento.find({ habilitado: true }, 'id').lean();
    const eventosIds = eventosHabilitados.map(evento => evento.id);

    return publicaciones.filter(publicacion => eventosIds.includes(publicacion.idEvento));
};

const deletePublicacion = async (idUsuario, idEntrada) => {
    console.log(idEntrada)
    const resultado = await EntradaSecundario.deleteOne({ idEntrada, idUsuario });
    if (resultado.deletedCount > 0) {
        console.log("hola hola")
        const usuario = await Usuario.findOne({googleId: idUsuario})
        const entrada = usuario.entradas.find(entrada => entrada.idEntrada === idEntrada)
        entrada.checkPublicadaEnReventa = false
        console.log(entrada)
        await usuario.save()
        return true
    } else {
        return false
    }

}

export default {postEntrada, comprarEntrada, pagarEntrada, getPublicaciones, deletePublicacion}