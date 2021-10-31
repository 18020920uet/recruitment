#!/bin/sh
sudo rm -r database dist node_modules
docker-compose --env-file ./.env.development up work --build
