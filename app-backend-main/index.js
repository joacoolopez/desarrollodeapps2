import express from "express";
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import { dbConnection } from './src/config/dbconfig.js';

import healthcheckRoutes from './src/routes/healthcheck.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import eventosRoutes from './src/routes/eventos.routes.js';
import entradasRoute from './src/routes/entradas.routes.js';
import mercadoSecundarioRoute from './src/routes/mercadosecundario.routes.js';
import usuarioRoute from './src/routes/usuario.routes.js';
import { subscribeToTopics } from "./src/integrations/suscribeEvents.js";
import { snsHandler } from "./src/controllers/sns.controller.js";

dotenv.config();
dbConnection()

const PORT = process.env.PORT || 3000;

const app = express()
app.use(express.json());

app.use(cors({
  origin: [
      'https://devops-mariano.d3jz4h7jb7cgb4.amplifyapp.com',
      'http://localhost:5173',  // Agrega el puerto 5173
      'https://eventify-sales.deliver.ar',
      'https://edaapi.deliver.ar',
      'https://intranet.deliver.ar',
      '*'
  ],
  credentials: true
}));


app.use(cookieParser());

app.listen(PORT);
console.log("Server on port", PORT);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

subscribeToTopics()

app.use('/auth', authRoutes);
app.use('/api/evento', eventosRoutes);
app.use('/api/entrada', entradasRoute);
app.use('/api/mercadosecundario', mercadoSecundarioRoute);
app.use('/api/usuario', usuarioRoute);
app.use('/', healthcheckRoutes);
app.use('/api/sns', snsHandler);

