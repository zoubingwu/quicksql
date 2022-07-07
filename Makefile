build:
	go build -o bin/quicksql app/main.go

build-local:
	pnpm --filter "@quicksql/local" build

build-remote:
	pnpm --filter "@quicksql/remote" build

dev:
	go run app/main.go start