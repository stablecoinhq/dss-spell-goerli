#!/bin/bash -eu

# Get current date
CURRENT_DATE=$(date "+%Y-%m-%d")

# Copy whatever in the contracts directory in the archive/${date}-DssSpell directory
cp -r contracts archives/${CURRENT_DATE}-DssSpell