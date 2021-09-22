#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd BASEDIR/..
yarn global add ts-node 
yarn install
npm run install-dep -- --name @skedo/upload-service
npm run install-link -- --name @skedo/upload-service


