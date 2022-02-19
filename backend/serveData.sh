#!/usr/bin/env bash
PORT=$((PORT_BASE+1))

# If directory does not exist, create it and change to it
if [[ ! -d "$DATA_DIRECTORY" ]];
then
    mkdir "$DATA_DIRECTORY";
    echo "Creating directory: $DATA_DIRECTORY"
fi;

cd "$DATA_DIRECTORY" || exit 1

# Serve the files
http-server --cors -p $PORT
