import AWS from 'aws-sdk';
import axios from 'axios';

// Configurar AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: 'us-east-1',
});
// Crear instancia de SNS
const sns = new AWS.SNS();
async function subscribeToTopics() {
    try {
        // Obtener tópicos dinámicos desde el endpoint
        const response = await
            axios.get('https://edaapi.deliver.ar/v1/health');
        const topics = response.data?.resources?.topics;
        if (!topics || topics.length === 0) {
            console.error('No hay tópicos para suscribirse.');
            return;
        }
        const endpointUrl = `${process.env.URL_BACK}/api/sns/handler`;
        console.log(endpointUrl)
        //const endpointUrl = "https://fcd3-201-213-225-125.ngrok-free.app/api/sns/handler"
        for (const topic of topics) {
            const topicArn = topic.TopicArn;
            // Crear suscripción HTTPS
            const params = {
                Protocol: 'https', // Protocolo HTTPS
                TopicArn: topicArn,
                Endpoint: endpointUrl, // URL de tu endpoint HTTPS
            };
            try {
                const subscription = await sns.subscribe(params).promise();
                console.log(`Suscripción exitosa:
                ${subscription.SubscriptionArn} para el tópico: ${topicArn}`);
            } catch (err) {
                console.error(`Error suscribiéndose al tópico ${topicArn}:`,
                    err.message);
            }
        }
    } catch (error) {
        console.error('Error obteniendo la lista de tópicos:',
            error.message);
    }
}

export {subscribeToTopics}