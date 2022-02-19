#!/usr/bin/env bash

export PORT_BASE=${PORT_BASE:-"8008"}
export DATA_DIRECTORY=${DATA_DIRECTORY:-"~.plo/"}
export MONGODB_LOCATION=${MONGODB_LOCATION:-"127.0.0.1:27017"}

# Export
if [ "$1" == "--export" ]; then
  # Only proceed if this will not override an existing export
  if test -f "$2"; then
    echo "Cannot create export as $2 already exists";
    exit 1;
  fi

  # Only proceed if this does not override an existing directory

  if ! mkdir "export"; then
    echo "Cannot create export as export working directory already exists";
    exit 2;
  fi

  # At this point there are no name clashes
  pushd "export" || exit 2;
  mongoexport --host="$MONGODB_LOCATION" --collection=users --db=pictureLayoutOrganiser --out=users.json;
  mongoexport --host="$MONGODB_LOCATION" --collection=content --db=pictureLayoutOrganiser --out=content.json;
  cp -r "$DATA_DIRECTORY" "./media";
  popd || exit 2;
  zip -r "$2" "export";
  printf "\nSuccessfully exported to $2\n";

  # Cleanup
  rm -rf "export/";

  exit 0;
fi


# Import
if [ "$1" == "--import" ]; then
  # Only proceed if this does not override an existing directory
  if test -d "export"; then
    echo "Cannot import as export directory already exists";
    exit 2
  fi

  unzip "$2"
  pushd "export" || exit 2;

  mongoimport --host="$MONGODB_LOCATION" --collection=users --db=pictureLayoutOrganiser --file=users.json;
  mongoimport --host="$MONGODB_LOCATION" --collection=content --db=pictureLayoutOrganiser --file=content.json;

  # If data directory does not already exist, make it
  mkdir "$DATA_DIRECTORY" &> /dev/null;
  cp -r media/* "$DATA_DIRECTORY";

  printf "\nSuccessfully imported\n";

  # Cleanup
  popd || exit 2;
  rm -rf "export/";
  exit 0;
fi


# Compress Existing
if [ "$1" == "--compress-existing" ]; then

  if [ -d "$DATA_DIRECTORY" ]; then
    node processAll.js "$DATA_DIRECTORY";
    exit $?;
  else
    echo "$DATA_DIRECTORY not found";
    exit 1;
  fi

fi


# Default run
bash ./serveData.sh & node index.js;
