#!/bin/bash
docker build -t sonsor/blog .
docker push sonsor/blog

ssh deploy@$DEPLOY_SERVER << EOF
docker pull sonsor/blog
docker stop api-sonsor || true
docker rm api-sonsor || true
docker rmi sonsor/blog:current || true
docker tag sonsor/blog:latest sonsor/blog:current
docker run -d --restart always --name api-sonsor -p 3000:3000 sonsor/blog:current
EOF
