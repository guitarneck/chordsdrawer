build:
	@make build-fontawesome
	@make build-normalize
	@make build-chordsdrawer

clean:
	@rm css/*
	@rm js/*

build-fontawesome:
	@./src/fontawesome-builder.js

build-normalize:
	@./src/normalize-builder.js

build-chordsdrawer:
	@./src/chordsdrawer-builder.js
