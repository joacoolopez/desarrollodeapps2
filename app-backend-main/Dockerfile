# Usa la imagen base de Node.js
FROM node:20.18.0

# Establece el directorio de trabajo.
WORKDIR /usr/src/app

# Copia el archivo package.json e instala dependencias.
COPY package.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]
