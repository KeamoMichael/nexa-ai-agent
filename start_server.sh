#!/bin/bash
echo "Starting server..." > server_debug.log
node server/index.js >> server_debug.log 2>&1
echo "Server exited with code $?" >> server_debug.log
