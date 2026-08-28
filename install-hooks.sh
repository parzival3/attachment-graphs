#!/usr/bin/env bash
# Enable this repo's committed git hooks (see .githooks/).
# Run once after cloning:  ./install-hooks.sh
set -euo pipefail
cd "$(dirname "$0")"
git config core.hooksPath .githooks
echo "Hooks enabled: core.hooksPath -> .githooks"
