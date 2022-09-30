# Docekr training





## CLI Commands:

### Listing images volumes and containers
- `docker image ls` -> lists all images
- `docker ps` -> lists all running containers
- `docker ps -a` -> lists all containers
- `docker volume ls` -> lists all volumes
- `docker network ls` -> lists all networks 

### removing images volumes and containers
- `docker rm "container_id" -> removes container
- `docker rmi "image id" or"image name` -> removes image
- `docker volume rm volume_id` -> removes volume by id
- `docker volume rm prune` -> removes all volumes not attached to a docker container

### other very useful commands
- `--help` -> displays the help menu with command options. This can be used at the end of the commands like `docker logs name_of_container --help` for example
- `docker exec -it container_name bash` -> go into bash terminal inside the container
- `docker exec -it moongo_container_name -u "username" -p "password" bash` -> go into bash terminal inside the container
- `docker logs name_of_container` -> shows logs of processes inside the container
- `docker inspect "id of whatever you want to inspect" -> gives detailed info about what is being inspected
- `docker rm name_of_container -f` -> forcefully removes container without having to stop it
- `docker rm name_of_container -fv` -> forcefully removes container without having to stop it and removes the volumes as well


### Building the image

**basic command**: 
`docker build .` -> where "." refers to current directory where the dockerfile is in

**additional flags**:
- `-t image_name:1.0` -. gives the image a name


### Running the container from the image

`docker run image_name`

**Additional flags**
- `-d` -> datached (don't have to have the terminal open)
- `-p hostPortNumber:containerPortContainer`
- `--name` "name of docker container" -> self explanatory
- `-v pathToFolderOnHostMachine:pathToFolderOnContainer`-> adds bind mount volumes. This is for dev purposes, and syncs the folder of the host machine to the folder in the container, so that the image does not need to be rebuild every time a code change is done. To not delete the node_modules in the container when these are deleted in the host, another volume is added, like so: `-v /app/node_modules`
  - pathToFolderOnHOstMachine = `$(pwd)` -> shortcut command to not have to type the whole path   
  - `:ro` -> read only, so that chnages in the code inside the container don't affect code on the host; full command to add a read only bind-mount is `-v $(pwd)/app:ro`
- `--env KEY=VALUE` -> set up environment variable, for more than one, just keep adding the command, Example `--env PORT=3000
- `--env-file pathToEnvFile` -> use environment file: `--env-file ./.env`

### Using docker compose to build image and run container

- `docker-compose [options] up` starts the container
- `docker-compose down [options]` stops the container
**Options**
- `-d` -> runs in detached mode, no need for open terminal
- `-v` -> destroys the volumes created when doing the `up` command: `docker-compose down -v`
- `--build` -> forces the rebuild of the image when changes have been made: `docker-compose up --build`
- `-f docker_compose_file` -> to build and run container using the docker-compose config files (of one or more files).
  - dev -> `docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d`
  - prod -> `docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d`
- `-V` substitutes the anonimous volumes created when building images
- `--scale name_of_app_in_compose_file=num_of_replicas` -> to scale on or more apps: `docker-compose -f [files] up -d -V --build --scale node-app=2` 

**Notes**
- when using docker-compose it will create a network for the containers. this network has a DNS (name) that can be referred to in your docker files by the name put into the volumes section