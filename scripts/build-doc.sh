#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd BASEDIR/..
yarn global add ts-node 
yarn install
npm run install-dep -- --name @skedo/doc-service
npm run install-link -- --name @skedo/doc-service
npm run build-ts -- --name @skedo/doc-service


