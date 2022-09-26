FROM node:16.13.0-alpine3.11
WORKDIR /home/brispot-konsumer
RUN mkdir -p /home/brispot-konsumer
RUN cd /home/brispot-konsumer
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm","start"]
