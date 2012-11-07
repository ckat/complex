echo off
call set_env
echo ********************************
echo *		1 Install adminws   *
echo ********************************
Set FileName=""
FOR %%i IN ("adminws*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% adminws
echo ********************************
echo *		2 Install auditws   *
echo ********************************
Set FileName=""
FOR %%i IN ("auditws*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% auditws
echo ********************************
echo *		3 Install corews    *
echo ********************************
Set FileName=""
FOR %%i IN ("corews*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% corews
echo ********************************
echo *		4 Install refws	    *
echo ********************************
Set FileName=""
FOR %%i IN ("refws*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% refws
echo ********************************
echo *		5 Install reportws  *
echo ********************************
Set FileName=""
FOR %%i IN ("reportws*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% reportws
echo ********************************
echo *	6 Install richclientproxy   *
echo ********************************
Set FileName=""
FOR %%i IN ("richclientproxy*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% richclientproxy
echo ********************************
echo *		7 Install timer	    *
echo ********************************
Set FileName=""
FOR %%i IN ("timer*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% timer
echo ********************************
echo *		8 Install versionws *
echo ********************************
Set FileName=""
FOR %%i IN ("versionws*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% versionws
echo ********************************
echo *		9 Install webclient *
echo ********************************
Set FileName=""
FOR %%i IN ("webclient*.war") DO Set FileName=%%~ni
echo find file %FileName%.war
call install_war_flextera %FileName% webclient
echo on