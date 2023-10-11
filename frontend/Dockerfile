FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app source code into the container
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 5173

CMD ["npm", "run", "dev"]