#!/bin/bash
echo "Setting up local compose stack"

docker compose version
git --version

read -p "Confirm setting up btms in $(pwd) (y/n)?" CONT
if [ "$CONT" = "n" ]; then
  echo "booo";
  exit
fi

echo "Cloning repos"

git clone git@github.com:DEFRA/btms-frontend.git
git clone git@github.com:DEFRA/btms-backend.git
git clone git@github.com:DEFRA/btms-telemetry-extensions.git

echo "Copying config files"
cp ./config-files/btms-backend/Btms.Backend/Properties/local.env btms-backend/Btms.Backend/Properties/local.env
cp ./config-files/btms-frontend/compose/* btms-frontend/compose

echo "Building docker images"

cd ./btms-frontend
ls -la
docker compose build

echo "Bringing up compose stack"

docker compose up
