# **Do research, write blog post and publish**

**Propmt:** `Based on the README of FellouAI/eko on github, search for competitors, highlight the key contributions of Eko, write a blog post advertising Eko, and post it on Write.as.`

## Setup
``` shell
# install cli (used to initialize browser extension projects)
pnpm install @eko-ai/eko-cli -g
# initialize project
eko-cli init browser-extension-demo

cd browser-extension-demo
#The code required to build a Chrome browser extension is generated in the dist directory
# install dependencies
pnpm install

# Build dev
pnpm run build:dev

# build prod
pnpm run build
```
