build:
	go build -o bin/qs main.go

build-local:
	pnpm --filter "@quicksql/local" build

build-remote:
	pnpm --filter "@quicksql/remote" build

dev:
	go run main.go -h localhost
