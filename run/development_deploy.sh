#!/bin/sh
docker-compose --env-file ./.env.development -f docker-compose.yml up -d application 
