DEV_SERVICE = vite-dev
PROD_SERVICE = vite-prod

.PHONY: run-dev prod build-dev build-prod stop bash

run-dev:
	docker compose up $(DEV_SERVICE)

prod:
	docker compose up $(PROD_SERVICE)

build-dev:
	docker compose build $(DEV_SERVICE)

build-prod:
	docker compose build $(PROD_SERVICE)

stop:
	docker compose down

restart:
	docker compose restart

bash:
	docker compose exec -it vite-dev sh
