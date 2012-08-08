.PHONY: clean types

# list of files
POLPETTA =  src/intro.js                      \
            src/config.js                     \
            src/function/*.js                 \
            src/descriptor/*.js               \
            src/errors/*.js                   \
            src/polpetta_internals/*.js       \
            src/var.js                        \
            src/EXTENSION_TO_MIME.js          \
            src/htaccess/*.js                 \
            src/Polpetta/constructor.js       \
            src/Polpetta/prototype.js         \
            src/__init__.js

# default build task
build: $(POLPETTA)
	mkdir -p build
	cat $(POLPETTA) >build/polpetta
	chmod +x build/polpetta
	node utility/setversion.js
	cat src/chef.js >build/chef
	chmod +x build/chef
	node test/unit.njs

# clean/remove build folder
clean:
	rm -rf build

# generate EXTENSION_TO_MIME variable then build
types:
	curl -0 http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types >./types
	node utility/transform.js
	rm types
	make


