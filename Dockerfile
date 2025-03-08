# Base on Node.js LTS (Long Term Support)
FROM --platform=linux/amd64 node:22-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm i --no-optional --ignore-scripts && npm run docker:prepare

# Copy the rest of the application
COPY . .

# Build the Nuxt application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built application from build stage
COPY --from=build /app/.output /app/.output
COPY --from=build /app/.nuxt /app/.nuxt
COPY --from=build /app/package*.json /app/

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["node", ".output/server/index.mjs"]