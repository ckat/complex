@SET JAVA_HOME=c:\glassfish3\jdk
@SET MAVEN_HOME=d:\installed\apache-maven-3.0.4
@SET MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=256m -Dfile.encoding=UTF-8


@SET PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%;

@SET ROOT_DIR="%~dp0.."

@set WAS_HOME=d:\installed\IBM\ALBOAS7
@SET DIST_DIR=%ROOT_DIR%\war
