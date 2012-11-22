:uninstall

@set WAS_DEINSTALLING_APPS_VERSION_SUFFIX=
IF NOT "%DEINSTALLING_APPS_VERSION%"=="" (
	@set WAS_DEINSTALLING_APPS_VERSION_SUFFIX=-%DEINSTALLING_APPS_VERSION:.=_%
)
IF "%SKIP_DEINSTALLING_APPS%"=="yes" goto installingApps
IF NOT "%WAS_DEINSTALLING_APPS_SUFFIX_EXT%"=="" set WAS_DEINSTALLING_APPS_VERSION_SUFFIX=%WAS_DEINSTALLING_APPS_SUFFIX_EXT%

REM call uninstall webclient employee
call uninstall employeefacadews employee
call uninstall mqadapterws employee
call uninstall notificationsws employee
call uninstall ftcconvws employee
call uninstall ftcpaymentsws employee

REM call uninstall webclient client
call uninstall clientfacadews client
call uninstall messagesws client
call uninstall paymentws client
call uninstall statementws client
call uninstall rqws client
call uninstall WSUserAuthentication client
call uninstall WSUserOrgList client
call uninstall WSCreateAccountMovementListRequest client
call uninstall WSCreatePaymentDocRUR client
call uninstall WSGetAccountMovementList client
call uninstall dictionariesws client
call uninstall linkadminws client
call uninstall notificationsws client
call uninstall ftcconvws client
call uninstall ftcpaymentsws client

:installingApps
REM call install_war webclient webclient employee
call install_war employeefacadews employeefacadews employee
call install_war mqadapterws mqadapterws employee
call install_war notificationsws notificationsws employee
call install_war ftcconvws ftcconvws employee
call install_war ftcpaymentsws ftcpaymentsws employee

REM call install_war webclient webclient client
call install_war clientfacadews clientfacadews client
call install_war messagesws messagesws client
call install_war paymentws paymentws client
call install_war statementws statementws client
call install_war dictionariesws dictionariesws client
call install_war linkadminws linkadminws client
call install_war notificationsws notificationsws client
call install_war ftcconvws ftcconvws client
call install_war ftcpaymentsws ftcpaymentsws client
call install_ear rqws client
call install_ear WSCreateAccountMovementListRequest client
call install_ear WSCreatePaymentDocRUR client
call install_ear WSGetAccountMovementList client
call install_ear WSUserAuthentication client
call install_ear WSUserOrgList client