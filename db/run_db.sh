#!/bin/bash

IMAGE_NAME=speechtimerdb:latest

# build image
docker build --no-cache --rm -t $IMAGE_NAME .

# kill old run 
docker ps -a | grep 435_db
CONTAINER_RUNNING=$?

if [ $CONTAINER_RUNNING -eq 0 ]; then
    docker stop 435_db
    docker container rm 435_db
    echo "killed running container"
fi
# run image
docker run --name 435_db -p 3306:3306 -d $IMAGE_NAME 

docker ps

