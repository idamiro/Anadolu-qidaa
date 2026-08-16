#!/bin/sh
# Cloudflare deploy command — put this in the dashboard "Deploy command" field:
#   sh cf-build.sh
set -e
rm -rf .git
npx wrangler pages deploy . --commit-dirty=true
