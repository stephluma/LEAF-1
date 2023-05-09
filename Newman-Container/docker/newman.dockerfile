FROM node:19

# Set environment variables
ENV LANG="en_US.UTF-8" LANGUAGE="en_US.UTF-8" 
RUN apt update
RUN apt install -y wget libpng-dev zlib1g-dev \
    libzip-dev git zip unzip iputils-ping netcat vim \
    default-mysql-client \
    apt-transport-https vim
    
WORKDIR /var/newman
RUN npm install newman --save
RUN npm install async --save

WORKDIR /var/newman/scripts
COPY Newman-Container/scripts /var/newman/scripts
COPY Postman-Collections /var/newman/collections

# ENTRYPOINT ["newman"]
