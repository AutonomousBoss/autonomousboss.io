##
## Help
##
.DEFAULT_GOAL := help
.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

##
## Content generation
##
.PHONY: site listings build-deps

site: ## Generate site from source
	@hugo --gc --minify

listings: ## Generate all listings from the CMS
	@mkdir -p content/jobs
	@poetry run scripts/export-listings.py

build-deps: ## Ensure all required dependencies are installed
	@which poetry || pip install -q poetry
	@(stat poetry.lock && poetry update) || poetry install
