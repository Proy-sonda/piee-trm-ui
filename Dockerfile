FROM node:18.16-alpine

ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ADS_URL
ARG NEXT_PUBLIC_THRESHOLD_ALERTA_EXPIRA_SESION_MS
ARG NEXT_PUBLIC_URL_BACKEND_TRAMITACION
ARG NEXT_PUBLIC_URL_BACKEND_SUPER_USUARIO

WORKDIR /app

RUN apk add git

COPY package.json yarn.lock ./

RUN npm install

COPY . .

ENV NEXT_PUBLIC_APP_VERSION ${NEXT_PUBLIC_APP_VERSION}
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ADS_URL ${NEXT_PUBLIC_ADS_URL}
ENV NEXT_PUBLIC_THRESHOLD_ALERTA_EXPIRA_SESION_MS ${NEXT_PUBLIC_THRESHOLD_ALERTA_EXPIRA_SESION_MS}
ENV NEXT_PUBLIC_URL_BACKEND_TRAMITACION ${NEXT_PUBLIC_URL_BACKEND_TRAMITACION}
ENV NEXT_PUBLIC_URL_BACKEND_SUPER_USUARIO ${NEXT_PUBLIC_URL_BACKEND_SUPER_USUARIO}

RUN npm run build

CMD ["npm", "start"]