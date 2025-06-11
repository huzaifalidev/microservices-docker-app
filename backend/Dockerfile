# Use official Node.js image
FROM node:22

WORKDIR /app

# Copy only package.json and install inside container
COPY package*.json ./
RUN npm install

# Now copy the rest of your backend code
COPY . .

# Optional: Expose port (if using localhost testing)
EXPOSE 5001

CMD ["node", "server.js"]
