FROM node:12.16-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git curl openssh make python \
    busybox-extras

#
RUN mkdir -p /home/mock-premier-league

# COPY package*.json ./
#
COPY . /home/mock-premier-league

WORKDIR /home/mock-premier-league

EXPOSE 3000
#
ADD docker-entrypoint.sh /usr/local/bin/
#
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
#
CMD ["/usr/local/bin/docker-entrypoint.sh"]
