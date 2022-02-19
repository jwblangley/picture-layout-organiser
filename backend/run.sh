#!/usr/bin/env bash

export PORT_BASE=${PORT_BASE:-"8008"}
export DATA_DIRECTORY=${DATA_DIRECTORY:-"~.plo/"}

# Export
if [ "$1" == "--export" ]; then
  # Only proceed if this will not override an existing export
  if test -f "export.zip"; then
    echo "Cannot create export as export.zip already exists";
    exit 1;
  fi

  # Only proceed if this does not override an existing directory

  if ! mkdir "export"; then
    echo "Cannot create export as export working directory already exists";
    exit 2;
  fi

  # At this point there are no name clashes
  pushd "export" || exit 2;
  mongoexport --collection=users --db=pictureLayoutOrganiser --out=users.json;
  mongoexport --collection=content --db=pictureLayoutOrganiser --out=content.json;
  cp -r "$DATA_DIRECTORY" "./media";
  popd || exit 2;
  zip -r "export.zip" "export";
  printf "\nSuccessfully exported to %s/export.zip\n" "$(pwd)";

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

  mongoimport --collection=users --db=pictureLayoutOrganiser --file=users.json;
  mongoimport --collection=content --db=pictureLayoutOrganiser --file=content.json;

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
