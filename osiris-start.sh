#!/bin/bash

# kill running osiris containers 
docker kill osiris

# download latest image of osiris 
docker pull gitlab.immergis.fr:4567/osiris/osiris-front/develop:latest

# run osiris on port 4200
docker run -it --rm -d -p 4200:80 --name osiris gitlab.immergis.fr:4567/osiris/osiris-front/develop:latest

echo ""
echo "🎉 Osiris last develop is running !"
echo ""
echo "See a demo on http://localhost:4200/"
echo ""
echo ""
