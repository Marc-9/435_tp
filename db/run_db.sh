IMAGE_NAME=speechtimerdb:latest

# build image
docker build --rm -t $IMAGE_NAME .

# kill old run 
docker ps -a | grep 435_db
CONTAINER_RUNNING=$?

if [ $CONTAINER_RUNNING -eq 0 ]; then
    docker stop 435_db
    docker container rm 435_db
    echo "killed running container"
fi
# run image
docker run --name 435_db -d $IMAGE_NAME 

docker ps