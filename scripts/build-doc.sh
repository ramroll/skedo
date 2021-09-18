#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd BASEDIR/..
yarn global add ts-node 
yarn install
yarn global add serve
npm run install-dep -- --name @skedo/doc-service
npm run install-link -- --name @skedo/doc-service
npm run build-ts -- --name @skedo/doc-service
cp -r ./packages/skedo-ui/build ./
rm -rf ./node_modules
rm -rf ./packages

