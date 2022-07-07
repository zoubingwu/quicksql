build:
	go build

build-ui:
	cd app && pnpm run build

dev:
	go run main.go start
