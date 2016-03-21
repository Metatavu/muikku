#!/bin/bash
if [[ $run_tests = "true" ]]; then
  mvn clean
  mvn install -Pmongo-log-plugin,jndi-mail-plugin,pyramus-plugins,elastic-search-plugin,atests-plugin,evaluation-plugin -Dfindbugs.skip=$findbugs_skip -Dmaven.javadoc.skip=true -Dsource.skip=true
fi;