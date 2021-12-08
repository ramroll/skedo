#!/bin/bash

set -e

BASEDIR=$(dirname $0)
cd $BASEDIR/../

yarn global add ts-node
yarn install
yarn global add serve
npm run install-dep -- --name @skedo/ui
npm run install-link -- --name @skedo/ui
npm run build-ts -- --name @skedo/ui
npm run build -- --name @skedo/ui
cp -r ./packages/skedo-ui/build ./
rm -rf ./packages