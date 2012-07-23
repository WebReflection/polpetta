.PHONY: clean types

# list of files
POLPETTA =  src/intro.js                      \
            src/config.js                     \
            src/function/*.js                 \
            src/EXTENSION_TO_MIME.js          \
            src/var.js                        \
            src/polpetta.js                   \
            src/htaccess.js                   \
            src/__init__.js

# default build task
build: $(POLPETTA)
	mkdir -p build
	cat $(POLPETTA) >build/polpetta
	chmod +x build/polpetta
	cp -R node_modules build

# clean/remove build folder
clean:
	rm -rf build

# generate EXTENSION_TO_MIME variable then build
types:
	curl -0 http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types >./types
	node utility/transform.js
	rm types
	make


