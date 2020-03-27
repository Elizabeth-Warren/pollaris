# Make Pollaris

STAGE?=dev

install:
	pipenv install

install-dev:
	pipenv install -d

test: install-dev
	pipenv run pytest

install-deploy-dependencies:
	npm install

create-domain: install-deploy-dependencies
	sls create_domain -s $(STAGE)

deploy-preflight: install-deploy-dependencies
	(export STAGE=$(STAGE) && ./make-deploy-preflight)

run-preflight: deploy-preflight
	(export STAGE=$(STAGE) && ./make-run-preflight)

deploy: install-deploy-dependencies create-domain
	sls deploy -s $(STAGE)

deploy-with-preflight: install-deploy-dependencies create-domain run-preflight
	sls deploy -s $(STAGE)
	# Run the migrations again. Because migrations are idempotent it shouldn't be
	# a problem to just run them again after a deploy. This "re-run" ensures that if
	# this is your first time standing up the dev stage, the database does get
	# migrated
	sls wsgi manage -c "migrate" -s $(STAGE)
