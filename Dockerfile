FROM node:alpine


WORKDIR /app

COPY package*.json ./

RUN npm install


# Copy the rest of the application code
COPY . .

# Expose the port on which your NestJS application runs
EXPOSE 5000

# Command to run your NestJS application
CMD ["npm", "run", "start:prod"]
