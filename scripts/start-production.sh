#!/bin/bash
# NOTE: patient-portal uses static export (output: 'export') and is served
# as static files from artifacts/patient-portal/dist/public by the Replit
# deployment system. This script is no longer needed for production.
# The deployment build command (in artifact.toml) runs 'next build' which
# outputs static HTML/CSS/JS directly to dist/public/.
echo "patient-portal is deployed as a static site. No server process needed."
echo "Static files are served from artifacts/patient-portal/dist/public/"
exit 0
