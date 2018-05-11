FROM node:latest

ADD musician.js /opt/src/

WORKDIR /opt/src/

RUN npm install

ENTRYPOINT ["node", "/opt/src/musician.js"]