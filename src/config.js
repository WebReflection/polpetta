
// constants as configuration
const

  HOST_NAME = process.env.IP || "localhost",
                                // choose a name for your server

  HOST_INITIAL_PORT = process.env.PORT || 1337,
                                // choose a port to start with
                                // this is for automatic port recognition
                                // if argument [port] is not provided

  LIST_FILES_AND_FOLDERS = true,// display the list of files
                                // if no index.njs or index.html is found

  HTACCESS_NAME = ".htaccess"   // experimental .htaccess name
;

// after this point, if you don't know what you are doing .. please DON'T !!!

