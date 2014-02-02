#!/bin/sh
cd `dirname $0`
for i in test-*.js
do
  env echo -e "\033[34m Beginning test case: \033[1;34m'$i'\033[0m"
  if node "$i"
  then
    env echo -e "  \033[1;32mPASS!\033[0m"
  else
    env echo -e "  \033[1;31mFail :(\033[0m"
  fi
done
