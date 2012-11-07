rem %1 - application name
rem %2 - application context

@set APP_NAME=%1
@set APP_CONTEXT=%2
@set APP_WAR=%APP_NAME%.war

@SET DIST_DIR="%~dp0"


@set CONN=conntype SOAP -host %WAS_ADMINHOST_EMP% -port %WAS_ADMINSOAP_EMP% -username %WAS_USERNAME_EMP% -password %WAS_PASSWORD_EMP%

pushd %WAS_HOME%\profiles\%WAS_PROFILE%\bin

@copy /y %DIST_DIR%\%APP_WAR% %APP_WAR%

@echo INSTALL APP %APP_NAME%...
@set CMD_OPTIONS=-verbose -node %WAS_SERVERNODE% -server %WAS_SERVERNAME% -distributeApp -nodeployejb -contextroot /%APP_CONTEXT% -appname %APP_CONTEXT% -defaultbinding.virtual.host default_host -usedefaultbindings
@set CMD=$AdminApp install %APP_WAR% {%CMD_OPTIONS%}
call wsadmin %CONN% -c "%CMD%" -lang jacl
if not %ERRORLEVEL%==0 goto error

goto done

:done
@if exist %APP_WAR% del %APP_WAR%
popd
exit /B 0

:error
@if exist %APP_WAR% del %APP_WAR%
popd
exit /B 1