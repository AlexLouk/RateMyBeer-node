# Use a base image
FROM node:19-alpine

# Set the working directory
WORKDIR /

# Copy package.json and yarn.lock to the container
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN yarn build

# Set the production environment
ENV NODE_ENV=production

# Expose the desired port
EXPOSE 3000

# Start the React app
CMD ["yarn", "start"]