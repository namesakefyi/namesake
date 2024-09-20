# !/bin/bash

# Deploy preview branches to Cloudflare Pages.
# Production deploys are handled via `.github/workflows/deploy.yml`.

if [ ! "$CF_PAGES_BRANCH" == "main" ]; then
  npx convex deploy --cmd "pnpm build" --preview-create "$CF_PAGES_BRANCH" --preview-run "seed"
fi
