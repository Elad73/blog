FROM node:16-alpine

# env variables for create-react-app bugs 8688, 11779
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]