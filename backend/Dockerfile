FROM --platform=linux/amd64 node:12

RUN apt-get update && apt-get install -y \
    bash \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian92-x86_64-100.3.1.deb && \
    apt-get install ./mongodb-database-tools-*.deb && \
    rm -f mongodb-database-tools-*.deb

COPY . plo-backend

WORKDIR plo-backend

RUN npm install

# ENTRYPOINT "run.sh"
