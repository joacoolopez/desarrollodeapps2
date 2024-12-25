import axios from 'axios';
import { recitalHandler } from '../integrations/handlers/recitalHandler.js';
import { walletHandler } from '../integrations/handlers/walletHandler.js';

const snsHandler = async (req, res) => {
    const messageType = req.headers['x-amz-sns-message-type'];
    const message = req.body
    console.log(message)
    
    if (messageType === 'SubscriptionConfirmation') {
        // Confirmar la suscripción
        axios
            .get(message.SubscribeURL)
            .then(() => console.log('Suscripción confirmada'))
            .catch((err) => console.error('Error confirmando suscripción:',
                err.message));
    } else if (messageType === 'Notification') {

        const msj = JSON.parse(message.Message); // Convertir de nuevo a objeto

        console.log(`Mensaje recibido del tópico ${message.TopicArn}:`,
            message.Message);

        switch (message.TopicArn) {
            case 'arn:aws:sns:us-east-1:442042507897:artist-topic':
                break;
            case 'arn:aws:sns:us-east-1:442042507897:recital-topic':
                recitalHandler(msj)
                break;
            case 'arn:aws:sns:us-east-1:442042507897:wallet-topic':
                walletHandler(msj)
                break;
            // Agregar más casos según sea necesario
            default:
                console.log('Mensaje de tópico desconocido:', message.TopicArn);
        }
    }
    res.sendStatus(200);
}

export {snsHandler}