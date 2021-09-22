#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd BASEDIR/..
yarn global add ts-node 
yarn install
npm run install-dep -- --name @skedo/packager-service
npm run install-link -- --name @skedo/packager-service
npm run build-ts -- --name @skedo/packager-service


