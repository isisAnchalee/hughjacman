# 
# Binaries
#

BIN := ./node_modules/.bin
ESLINT = ./node_modules/.bin/eslint

#
# Files
# ALL JS files, to be broken up into tests/src at a later point :)
#

JS = $(shell find server client -type f -name "*.js")

#
# Maintenance tasks.
#

# Install node dependencies.
node_modules:
	@npm install

# Remove all temporary files and vendor dependencies.
distclean: clean
	@rm -rf node_modules
.PHONY: distclean

#
# Testing tasks.
#

# Lint all files.
lint: node_modules
	@$(ESLINT) -- $(JS)
.PHONY: lint

#
# Server
#

# Start the server.
server: 
	@node server/index.js
.PHONY: server