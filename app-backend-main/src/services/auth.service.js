import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import findOrCreate from 'mongoose-findorcreate';
import passport from 'passport';
import Usuario from '../models/Usuario.js';
import dotenv from 'dotenv';
import { generarTokenUsuario } from '../utils/jwt.js';
import axios from 'axios'; // Para descargar la imagen
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // Para subir la imagen a S3

dotenv.config();

dotenv.config();
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

passport.use(Usuario.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

// Configura la estrategia de Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.URL_BACK}/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    const nombreCompleto = profile.displayName.split(' ');
    const nombre = nombreCompleto[0];
    const apellido = nombreCompleto.slice(1).join(' ');

    // Descarga la imagen del perfil
    const imageUrl = profile._json.picture; // URL de la imagen
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' }); // Descarga la imagen como buffer

    const imagenBuffer = Buffer.from(response.data, 'binary'); // Convierte a buffer

    // Subir la imagen a S3
    const bucketName = process.env.S3_BUCKET_NAME;
    const key = `usuarios/${profile.id}.jpg`; // Genera una clave para la imagen en S3

    try {
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: imagenBuffer,
            ContentType: 'image/jpeg', // Tipo de contenido
        }));
    } catch (err) {
        console.error('Error al subir la imagen a S3:', err);
    }

    Usuario.findOrCreate(
      { googleId: profile.id }, 
      { username: profile.displayName, email: profile.emails[0].value, nombre, apellido, imageUrl: key }, // Guarda la clave de la imagen en tu modelo
      function (err, user) {
        return cb(err, user);
      }
    );
  }
));

const loginWithGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/iniciar-sesion' }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect('/iniciar-sesion');
        req.logIn(user, (err) => {
            if (err) return next(err);
            const token = generarTokenUsuario(user.googleId);
            console.log(token)
            res.cookie('token', token);
            res.redirect(`${process.env.URL_FRONT}/eventos?token=${encodeURIComponent(token)}&nombre=${encodeURIComponent(user.nombre)}&apellido=${encodeURIComponent(user.apellido)}&email=${encodeURIComponent(user.email)}&idUsuario=${encodeURIComponent(user.googleId)}`);
        });
    })(req, res, next);
};

export default { loginWithGoogle, googleCallback };
