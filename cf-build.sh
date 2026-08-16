#!/bin/sh
# Cloudflare Pages build: strip .git so wrangler never uploads pack files (>25 MiB).
set -e
rm -rf .git
echo "Cloudflare build ready (static root, .git removed)."
