#!/bin/sh
docker-compose --env-file ./.env.development -f docker-compose.yml -f docker-compose.development.yml up application
