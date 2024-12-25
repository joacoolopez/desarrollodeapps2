import entradasService from "../../services/entradas.service.js";

const walletHandler = async (msj) => {
    console.log("Evento capturado: ", msj["detail-type"])
    switch (msj["detail-type"]){
        case 'wallet.transfer.ticket':
            try {
                const {emailFrom, emailTo, idNFT, idEntrada} = msj["detail"];
                await entradasService.transferirEntrada(emailFrom, emailTo, idEntrada)
            } catch (error) {
                console.log(error)
            }
            break;
        case 'wallet.payment.pesos':
            try {
                if ( msj["detail"]["source"] = "wallet-module"){
                    const {idPago} = msj["detail"];
                    await entradasService.pagarEntradas(idPago)
                } else {
                    const {userEmail, idEntradas, idToken} = msj["detail"];
                    await entradasService.asignarIdNFT(userEmail, idEntradas, idToken)
                }
                
            } catch (error) {
                console.log(error)
            }
            break;
        case 'wallet.repurchase.paid':
            try {
                if ( msj["detail"]["source"] = "wallet-module"){
                    const {idPago} = msj["detail"];
                    await entradasService.pagarEntradas(idPago)
                }
            } catch (error) {
                console.log(error)
            }
            break;
    }
}

export {walletHandler}