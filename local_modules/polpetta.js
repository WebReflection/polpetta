/*!p(^.^)lpetta!*/
require(
  require('cluster').isMaster ?
    './queen.js' : './slave.js'
);