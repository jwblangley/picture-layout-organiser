FROM node:12

# Set build args
ARG REACT_APP_BACKEND_LOCATION=backend
ARG REACT_APP_BACKEND_PORT_BASE=8008

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
