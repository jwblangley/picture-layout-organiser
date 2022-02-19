FROM node:12

# Install dependencies
RUN npm install -g serve

# Copy source
COPY . /plo-frontend

WORKDIR /plo-frontend

# Install
RUN npm install

# Create production build
RUN npm run build

CMD ["serve", "-p", "8000", "build"]
