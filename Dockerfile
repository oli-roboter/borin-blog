# This is the setup phase
FROM node:16-alpine
WORKDIR /app 
COPY package.json .
# Variable that needs to be set in the docker compose file for each env to be used in the RUN block
ARG NODE_ENV
# THis installs only the dependencied when in production mode (not dev dependencies)
RUN if [ "$NODE_ENV" = "development" ]; \
          then npm install; \
          else npm install --only=production; \
          fi
# This is the build phase
# Copying is done in separate steps to optimise cashing
COPY . ./
# Set env variables
ENV PORT 3000 
EXPOSE $PORT
CMD [ "node", "index.js" ]
