FROM --platform=linux/amd64 node:12

# Install apt dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install mongodb-database-tools
RUN wget -q https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian92-x86_64-100.3.1.deb && \
    apt-get install -y --no-install-recommends ./mongodb-database-tools-*.deb && \
    rm -f mongodb-database-tools-*.deb

# Install http-server
RUN npm install -g http-server

# Copy source
COPY . /plo-backend

WORKDIR /plo-backend

# Installation
RUN npm install

ENTRYPOINT "/plo-backend/run.sh"
