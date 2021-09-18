#!/bin/bash
set -e
BASEDIR=$(dirname "$0")
cd BASEDIR/../
yarn global add ts-node
yarn install
npm run install-dep -- --name @skedo/ui
npm run install-link -- --name @skedo/ui
npm run build-ts -- --name @skedo/ui
npm run build -- --name @skedo/ui
