FROM node:latest

ADD auditor.js /opt/src/

WORKDIR /opt/src/

RUN npm install

ENTRYPOINT ["node", "/opt/src/auditor.js"]