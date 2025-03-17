# Usar la imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de configuración primero
COPY package.json package-lock.json ./

# Instalar dependencias sin conflictos
RUN npm install --legacy-peer-deps

# Copiar el resto del código después de instalar dependencias
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]