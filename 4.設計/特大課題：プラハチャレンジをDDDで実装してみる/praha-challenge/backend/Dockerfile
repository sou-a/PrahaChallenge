FROM node:12-alpine
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
CMD [ "yarn", "dev" ]
