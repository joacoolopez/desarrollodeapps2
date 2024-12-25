import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import dotenv from "dotenv";
dotenv.config();

const eventBridge = new EventBridgeClient({
    region: process.env.AWS_REGION,
    credentials: {
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    },
});

const purchaseTicket = async (mailUsuario, idEvento, cantidadGeneral, cantidadVip, cantidadIzquierda, cantidadDerecha, valorTotal, listaEntradas, idPago) => {
    const params = {
        Entries: [{
            Source: "tickets-module",
            DetailType: "ticket.purchase",
            Detail: JSON.stringify(
                {
                    "mailUsuario": mailUsuario,
                    "idEvento": idEvento,
                    "cantidadGeneral": cantidadGeneral,
                    "cantidadVip": cantidadVip,
                    "cantidadIzquierda": cantidadIzquierda,
                    "cantidadDerecha": cantidadDerecha,
                    "valorTotal": valorTotal,
                    "idEntradas": listaEntradas,
                    "idPago": idPago
                }
            ),
            EventBusName: "arn:aws:events:us-east-1:442042507897:event-bus/default",
        },],
    };
    try {
        const response = await eventBridge.send(new
            PutEventsCommand(params));
        console.log("Evento publicado con éxito:", response);
    } catch (err) {
        console.error("Error al publicar evento:", err);
    }
};

const repurchaseTicket = async (mailUsuarioCompra, mailUsuarioVenta, idNFT, idEntrada, idEvento, idPago, valorTotal) => {
    const params = {
        Entries: [{
            Source: "tickets-module",
            DetailType: "ticket.repurchase",
            Detail: JSON.stringify(
                {
                    "mailUsuarioCompra": mailUsuarioCompra,
                    "mailUsuarioVenta": mailUsuarioVenta,
                    "idNFT": idNFT,
                    "idEntrada": idEntrada,
                    "idEvento": idEvento,
                    "idPago": idPago,
                    "valorTotal": valorTotal
                }
            ),
            EventBusName: "arn:aws:events:us-east-1:442042507897:event-bus/default",
        },],
    };
    try {
        const response = await eventBridge.send(new
            PutEventsCommand(params));
        console.log("Evento publicado con éxito:", response);
    } catch (err) {
        console.error("Error al publicar evento:", err);
    }
};

const reimburseTicket = async (mailUsuario, idEvento, idEntrada, idNFT, valorTotal) => {
    const params = {
        Entries: [{
            Source: "tickets-module",
            DetailType: "ticket.reimburse",
            Detail: JSON.stringify(
                {
                    "mailUsuario": mailUsuario,
                    "idEvento": idEvento,
                    "idEntrada": idEntrada,
                    "idNFT": idNFT,
                    "valorTotal": valorTotal
                }
            ),
            EventBusName: "arn:aws:events:us-east-1:442042507897:event-bus/default",
        },],
    };
    try {
        const response = await eventBridge.send(new
            PutEventsCommand(params));
        console.log("Evento publicado con éxito:", response);
    } catch (err) {
        console.error("Error al publicar evento:", err);
    }
}

export { purchaseTicket, repurchaseTicket, reimburseTicket }