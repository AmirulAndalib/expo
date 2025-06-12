#!/bin/bash

function killUpdatesServerIfNeeded() {
  kill -9 $(lsof -t -i:4747)
}

function cleanup()
{
  echo 'Cleaning up...'
  killUpdatesServerIfNeeded
  yarn maestro:android:debug:uninstall
}

# Fail if anything errors
set -eox pipefail
# If this script exits, trap it first and clean up the emulator
trap cleanup EXIT

function beforeTest()
{
  killUpdatesServerIfNeeded
  yarn start-updates-server
  yarn maestro:android:debug:uninstall
  yarn maestro:android:debug:install
}

beforeTest
maestro test maestro/startAndStop.yml
beforeTest
maestro test maestro/checkLastRequestHeaders.yml
beforeTest
maestro test maestro/reload.yml
beforeTest
maestro test maestro/runUpdate.yml
cleanup
