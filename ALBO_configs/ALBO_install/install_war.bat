rem %1 - application name
rem %2 - application context
rem %3 - client/employee

@set APP_NAME=%1
@set APP_CONTEXT=%2
@set APP_WAR=%APP_NAME%%INSTALLING_APPS_VERSION_SUFFIX%.war

if  $%3$==$employee$ goto employee
if  $%3$==$client$ goto client

:client
@set WAS_PROFILE=%deploy.was.profile.client.path%
@set WAS_SERVERNODE=%deploy.was.profile.client.node%
@set WAS_SERVERNAME=%deploy.was.profile.client.server%
@set CONN=%CONN_CLT%
goto install

:employee
@set WAS_PROFILE=%deploy.was.profile.employee.path%
@set WAS_SERVERNODE=%deploy.was.profile.employee.node%
@set WAS_SERVERNAME=%deploy.was.profile.employee.server%
@set CONN=%CONN_EMP%
goto install

:install
@copy /y %WAR_DIR%\%APP_WAR% %deploy.was.home%\profiles\%WAS_PROFILE%\bin\%APP_WAR%
pushd %deploy.was.home%\profiles\%WAS_PROFILE%\bin

@echo INSTALL APP %APP_NAME%...
@set CMD_OPTIONS=-verbose -node %WAS_SERVERNODE% -server %WAS_SERVERNAME% -distributeApp -nodeployejb -contextroot /%APP_CONTEXT% -appname %APP_NAME%%WAS_INSTALLING_APPS_VERSION_SUFFIX% -defaultbinding.virtual.host default_host -usedefaultbindings
@set CMD=$AdminApp install %APP_WAR% {%CMD_OPTIONS%}
call wsadmin %CONN% -c "%CMD%" -lang jacl
if not %ERRORLEVEL%==0 goto error
@set CMD=$AdminApp startApplication {%CMD_OPTIONS%}
call wsadmin %CONN% -c "%CMD%" -lang jacl

goto done

:done
@if exist %APP_WAR% del %APP_WAR%
popd
exit /B 0

:error
@if exist %APP_WAR% del %APP_WAR%
popd
exit /B 1