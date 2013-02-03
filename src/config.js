
// constants as configuration
const

  LIST_FILES_AND_FOLDERS = true,  // display the list of files
                                  // if no index.njs, index.html or htm is found

  STREAM_FILES_BIGGER_THAN = 1024 * 512,
                                  // 0 to always stream files
                                  // N as amount of bytes


  HOST_NAME = process.env.IP || "",
                                  // default host name, force it if needed
                                  // otherwise it will be resolved automatically

  HOST_INITIAL_PORT = process.env.PORT || 1337,
                                  // choose a port to start with
                                  // this is for automatic port recognition
                                  // if argument [port] is not provided

  HTACCESS_NAME = ".htaccess"     // experimental .htaccess name
;

// after this point, if you don't know what you are doing .. please DON'T !!!

