.PHONY: web interactive
web:
	g++ Hex.cpp
	node app.js

interactive:
	g++ Hex.cpp
	./a.out interactive
