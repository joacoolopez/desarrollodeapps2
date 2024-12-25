import Evento from "../models/Evento.js"
import { v4 as uuidv4 } from 'uuid';
import Usuario from "../models/Usuario.js";
import Pago from "../models/Pago.js";
import PagoReventa from "../models/PagoReventa.js";
import EntradaSecundario from "../models/EntradaSecundario.js";
import { purchaseTicket, reimburseTicket } from "../integrations/publishEvent.js";

const comprarEntradas = async (idUsuario, idEvento, cantidadGeneral, cantidadVip, cantidadIzquierda, cantidadDerecha) => {
    const idPago = uuidv4()
    const evento = await Evento.findOne({ id: idEvento })
    const usuario = await Usuario.findOne({ googleId: idUsuario })
    const listaEntradas = [];
    const mailUsuario = usuario.email

    if (
        evento.cantidadSectorGeneral < cantidadGeneral ||
        evento.cantidadSectorVip < cantidadVip ||
        (evento.estadio === 1 && evento.cantidadSectorIzquierda < cantidadIzquierda) ||
        (evento.estadio === 1 && evento.cantidadSectorDerecha < cantidadDerecha)
    ) {
        throw new Error('No hay entradas suficientes');
    }

    let valorTotal = 0

    for (let i = 0; i < cantidadGeneral; i++) {
        const idEntrada = uuidv4()
        valorTotal = valorTotal + evento.precioGeneralBEAT
        usuario.entradas.push({
            idEntrada: idEntrada,
            idPago: idPago,
            idEvento: idEvento,
            nombreEvento: evento.nombre,
            fechaEvento: evento.fecha,
            sector: "General",
            precioPago: evento.precioGeneralBEAT,
            imagenPrincipal: evento.imagenPrincipal
        })
        listaEntradas.push(idEntrada);
    }

    for (let i = 0; i < cantidadVip; i++) {
        const idEntrada = uuidv4()
        valorTotal = valorTotal + evento.precioVipBEAT
        usuario.entradas.push({
            idEntrada: idEntrada,
            idPago: idPago,
            idEvento: idEvento,
            nombreEvento: evento.nombre,
            fechaEvento: evento.fecha,
            sector: "VIP",
            precioPago: evento.precioVipBEAT,
            imagenPrincipal: evento.imagenPrincipal
        })
        listaEntradas.push(idEntrada);
    }
    if (evento.estadio === 1) {
        for (let i = 0; i < cantidadIzquierda; i++) {
            const idEntrada = uuidv4()
            valorTotal = valorTotal + evento.precioIzquierdaBEAT
            usuario.entradas.push({
                idEntrada: idEntrada,
                idPago: idPago,
                idEvento: idEvento,
                nombreEvento: evento.nombre,
                fechaEvento: evento.fecha,
                sector: "Lateral Izquierda",
                precioPago: evento.precioIzquierdaBEAT,
                imagenPrincipal: evento.imagenPrincipal
            })
            listaEntradas.push(idEntrada);
        }

        for (let i = 0; i < cantidadDerecha; i++) {
            const idEntrada = uuidv4()
            valorTotal = valorTotal + evento.precioDerechaBEAT
            usuario.entradas.push({
                idEntrada: idEntrada,
                idPago: idPago,
                idEvento: idEvento,
                nombreEvento: evento.nombre,
                fechaEvento: evento.fecha,
                sector: "Lateral Derecha",
                precioPago: evento.precioDerechaBEAT,
                imagenPrincipal: evento.imagenPrincipal
            })
            listaEntradas.push(idEntrada);
        }
    }
    if (evento.estadio === 1) {
        const pago = await Pago.create({
            idPago: idPago,
            idUsuario: idUsuario,
            idEvento: idEvento,
            listaEntradas: listaEntradas,
            precioTotal: valorTotal,
            estadio: evento.estadio,
            cantidadSectorGeneral: cantidadGeneral,
            cantidadSectorVip: cantidadVip,
            cantidadSectorIzquierda: cantidadIzquierda,
            cantidadSectorDerecha: cantidadDerecha,
            fecha: evento.fecha
        })
        await purchaseTicket(mailUsuario, idEvento, cantidadGeneral, cantidadVip, cantidadIzquierda, cantidadDerecha, valorTotal, listaEntradas, idPago)

    } else if (evento.estadio === 2) {
        const pago = await Pago.create({
            idPago: idPago,
            idUsuario: idUsuario,
            idEvento: idEvento,
            listaEntradas: listaEntradas,
            precioTotal: valorTotal,
            estadio: evento.estadio,
            cantidadSectorGeneral: cantidadGeneral,
            cantidadSectorVip: cantidadVip,
            fecha: evento.fecha
        })
        await purchaseTicket(mailUsuario, idEvento, cantidadGeneral, cantidadVip, cantidadIzquierda, cantidadDerecha, valorTotal, listaEntradas, idPago)
    }
    

    await usuario.save();

    return {mailUsuario, idEvento, cantidadGeneral, cantidadVip, cantidadIzquierda, cantidadDerecha, valorTotal, listaEntradas, idPago} 

}

const pagarEntradas = async (idPago) => {

    const pago = await Pago.findOne ({idPago, estado: false})
    const pagoReventa = await PagoReventa.findOne ({idPago, estado: false})

    if (pago) {
        console.log("pago compra primaria")
        const evento = await Evento.findOne({id: pago.idEvento})
        const usuario = await Usuario.findOne({ googleId: pago.idUsuario })

        if (
            evento.cantidadSectorGeneral < pago.cantidadSectorGeneral ||
            evento.cantidadSectorVip < pago.cantidadSectorVip ||
            (evento.estadio === 1 && evento.cantidadSectorIzquierda < pago.cantidadSectorIzquierda) ||
            (evento.estadio === 1 && evento.cantidadSectorDerecha < pago.cantidadSectorDerecha)
        ) {
            throw new Error('No hay entradas suficientes');
        }

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const entradasConPago = usuario.entradas.filter(entrada => entrada.idPago === idPago)

        for (const entrada of entradasConPago) {
            entrada.checkPaga = true;
            if (entrada.sector === "General") {
                evento.cantidadSectorGeneral -= 1
            } else if (entrada.sector === "VIP") {
                evento.cantidadSectorVip -= 1
            } else if (entrada.sector === "Lateral Izquierda") {
                evento.cantidadSectorIzquierda -= 1
            } else if (entrada.sector === "Lateral Derecha") {
                evento.cantidadSectorDerecha -= 1
            }
        }

        pago.estado = true


        await usuario.save()
        await evento.save()
        await pago.save()

        return idPago
    } else if (pagoReventa){
        console.log("pago compra secundaria")

        const publicacion = await EntradaSecundario.findOne({idPublicacion: pagoReventa.idPublicacion})
        const usuarioVendedor = await Usuario.findOne({googleId:publicacion.idUsuario})
        usuarioVendedor.entradas.pull({idEntrada: publicacion.idEntrada})

        const usuarioComprador = await Usuario.findOne({googleId: pagoReventa.idUsuario})
        const entrada = usuarioComprador.entradas.find(e => e.idPago === idPago);

        entrada.checkPaga = true
        pagoReventa.estado = true

        await usuarioVendedor.save()
        await usuarioComprador.save()
        await EntradaSecundario.deleteOne({ idPublicacion: publicacion.idPublicacion });
        await pagoReventa.save()

        return idPago
    }else {
        throw new Error('El pago ya ha sido completado previamente o no existe');
    }
    

}

const getEntradasPorUsuario = async (idUsuario) => {
    const resultado = await Usuario.aggregate([
        { $match: { googleId: idUsuario } },
        { $unwind: "$entradas" },
        { $match: { "entradas.checkPaga": true } },
        { 
            $lookup: {
                from: "eventos", // Nombre de la colección de Eventos
                localField: "entradas.idEvento",
                foreignField: "id", // Campo en la colección de Eventos que conecta
                as: "eventoInfo"
            }
        },
        { $unwind: { path: "$eventoInfo", preserveNullAndEmptyArrays: true } }, // Preserva entradas sin evento
        { 
            $project: {
                _id: 0,
                entradas: {
                    idEntrada: "$entradas.idEntrada",
                    idPago: "$entradas.idPago",
                    checkPaga: "$entradas.checkPaga",
                    checkPublicadaEnReventa: "$entradas.checkPublicadaEnReventa",
                    idEvento: "$entradas.idEvento",
                    nombreEvento: {
                        $ifNull: ["$eventoInfo.nombre", "$entradas.nombreEvento"]
                    },
                    fechaEvento: {
                        $ifNull: ["$eventoInfo.fecha", "$entradas.fechaEvento"]
                    },
                    sector: "$entradas.sector",
                    precioPago: "$entradas.precioPago",
                    habilitado: "$eventoInfo.habilitado",
                    devolucion: "$entradas.devolucion",
                    imagenPrincipal: "$entradas.imagenPrincipal"
                }
            }
        }
    ]);
    
    return { entradas: resultado.map(item => item.entradas) };
    


    // const usuario = await Usuario.findOne({ googleId: idUsuario });
    // const entradasPagas = usuario.entradas.filter(entrada => entrada.checkPaga === true);
    // return { entradas: entradasPagas };
    
}

const transferirEntrada = async (mailDesde, mailHasta, idEntrada) => {
    const usuarioDesde = await Usuario.findOne({ email: mailDesde });
    if (!usuarioDesde) {
        throw new Error('El usuario desde no existe.');
    }

    const usuarioHasta = await Usuario.findOne({ email: mailHasta });
    if (!usuarioHasta) {
        throw new Error('El usuario hasta no existe.');
    }

    const entradaIndex = usuarioDesde.entradas.findIndex(entrada => entrada.idEntrada === idEntrada);
    if (entradaIndex === -1) {
        throw new Error('La entrada no existe en el usuario desde.');
    }

    const entrada = usuarioDesde.entradas[entradaIndex];

    usuarioDesde.entradas.splice(entradaIndex, 1);
    await usuarioDesde.save();

    usuarioHasta.entradas.push(entrada);
    await usuarioHasta.save();
    
    return { success: true, message: 'Entrada transferida con éxito.' };
}

const devolverEntrada = async (idUsuario, idEntrada) => {
    const usuario = await Usuario.findOne({ googleId: idUsuario });
    if (!usuario) {
        throw new Error('Usuario no encontrado.');
    }

    const entrada = usuario.entradas.find(e => e.idEntrada === idEntrada);
    if (!entrada) {
        throw new Error('Entrada no encontrada.');
    }

    if (entrada.devolucion) {
        throw new Error('Esta entrada ya fue devuelta.');
    }

    entrada.devolucion = true;
    await usuario.save();
    await reimburseTicket(usuario.email, entrada.idEvento, entrada.idEntrada, entrada.idNFT, entrada.precioPago)

    return { success: true, message: 'Entrada devuelta con éxito.', idEntrada };
};

const asignarIdNFT = async (email, entradas, nfts) => {
    if (entradas.length !== nfts.length) {
        throw new Error("El número de entradas y NFTs debe ser igual.");
    }

    for (let i = 0; i < entradas.length; i++) {
        const idEntrada = entradas[i];
        const idNFT = nfts[i];

        const usuario = await Usuario.findOneAndUpdate(
            { email, "entradas.idEntrada": idEntrada },
            { "entradas.$.idNFT": idNFT },
            { new: true }
        );

        if (!usuario) {
            throw new Error(`No se encontró la entrada con ID ${idEntrada} para el usuario con email ${email}`);
        }
    }
};
export default { comprarEntradas, pagarEntradas, getEntradasPorUsuario, transferirEntrada, devolverEntrada, asignarIdNFT }