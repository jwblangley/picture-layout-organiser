#!/usr/bin/env bash
PORT=$((PORT_BASE+1))

defaultjson=$(cat "$(dirname $0)/defaultManager.json")
wd=$(cat .config/directory.txt | envsubst)

# If directory does not exist, create it and change to it
cd $wd &> /dev/null || { mkdir $wd && echo "Creating directory: $wd" && cd $wd; }
echo "Switching to directory: $wd"

test -f "$wd/manager.json" || (echo "$defaultjson" > "$wd/manager.json" && echo "Creating empty manager")

# Serve the files
http-server --cors -p $PORT
