.PHONY: build build-local build-remote dev

build:
	go build -o bin/qs main.go

build-local:
	pnpm --filter "@quicksql/local" build

dev:
	go run main.go -h localhost
