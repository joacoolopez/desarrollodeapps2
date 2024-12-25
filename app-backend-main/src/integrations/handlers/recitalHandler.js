import eventosService from '../../services/eventos.service.js';

const recitalHandler = async (msj) => {
    console.log("Evento capturado: ", msj["detail-type"])
    switch (msj["detail-type"]){
        case 'recital.created':
            
            try {
                const { id, titulo, descripcion, ubicacion, fecha, habilitado, estadio, cantidadSectorGeneral, precioGeneralBEAT, cantidadSectorVip, precioVipBEAT, cantidadSectorIzquierda, precioIzquierdaBEAT, cantidadSectorDerecha, precioDerechaBEAT, imagenPrincipal } = msj["detail"];
                await eventosService.postEvento(id, titulo, descripcion, ubicacion, fecha, habilitado, estadio, cantidadSectorGeneral, precioGeneralBEAT, cantidadSectorVip, precioVipBEAT, cantidadSectorIzquierda, precioIzquierdaBEAT, cantidadSectorDerecha, precioDerechaBEAT, imagenPrincipal)
                console.log("Recital creado con exito")
            } catch (error) {
                console.log(error)
            }
            break;
        case('recital.updated'):
            try {
                const {id, descripcion, nombre, ubicacion, fecha, habilitado, estadio, precioGeneralBEAT, precioVipBEAT, precioIzquierdaBEAT, precioDerechaBEAT, imagenPrincipal } = msj["detail"];
                await eventosService.editEvento(id, descripcion, nombre, ubicacion, fecha, habilitado, estadio, precioGeneralBEAT, precioVipBEAT, precioIzquierdaBEAT, precioDerechaBEAT, imagenPrincipal)
                console.log("Recital editado con exito")
            } catch (error) {
                console.log(error)
            }
            break;
        case ('recital.deleted'):
            try {
                const {id} = msj["detail"];
                await eventosService.deleteEvento(id)
                console.log("Recital eliminado con exito")
            } catch (error) {
                console.log(error)
            }
    }
    
}

export {recitalHandler}