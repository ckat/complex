::-----------------------------------------------------------------------------------------------------------------------
:: DEPLOY ENVIRONMENT SETTINGS
::-----------------------------------------------------------------------------------------------------------------------

@set deploy.java.home=c:\glassfish3\jdk

@set deploy.was.home=d:\installed\IBM\ALBOAS7

@set deploy.was.profile.flextera.employee.path=flextera7
@set deploy.was.profile.flextera.client.path=flextera7

@set deploy.was.profile.employee.path=employee
@set deploy.was.profile.employee.admin.host=localhost
@set deploy.was.profile.employee.admin.soap.port=8884
@set deploy.was.profile.employee.admin.name=employee
@set deploy.was.profile.employee.admin.password=employee
@set deploy.was.profile.employee.node=EPRUIZHW0032Node05
@set deploy.was.profile.employee.server=server1

@set deploy.was.profile.client.path=client
@set deploy.was.profile.client.admin.host=localhost
@set deploy.was.profile.client.admin.soap.port=8883
@set deploy.was.profile.client.admin.name=client
@set deploy.was.profile.client.admin.password=client
@set deploy.was.profile.client.node=EPRUIZHW0032Node04
@set deploy.was.profile.client.server=server1

::-----------------------------------------------------------------------------------------------------------------------
:: WAS RESOURCES SETTINGS
::-----------------------------------------------------------------------------------------------------------------------

@set set.jdbc.levn.alias=LEVN
@set set.jdbc.files.alias=FILES
@set set.jdbc.lsta.alias=AlfaSource
@set set.jdbc.lpmt.alias=LPMT
@set set.jdbc.lntf.alias=LNTF
@set set.jdbc.lms.alias=LMS
@set set.jdbc.ladm.alias=LADM
@set set.jdbc.lcpmt.alias=LCPMT
@set set.jdbc.lcc.alias=LCC
@set set.jdbc.lemf.alias=LEMF
@set set.jdbc.ldic.alias=LDIC
@set set.jdbc.flextera.alias=AlfaCS_SERVICE_DS
@set set.jdbc.lclf.alias=LCLF
@set set.jdbc.lrqtimer.alias=rqTimerDs
@set set.jdbc.lrq.alias=rqDs
@set set.jdbc.monlog.alias=MONLOG

::-----------------------------------------------------------------------------------------------------------------------
:: UPDATE DB SETTINGS
::-----------------------------------------------------------------------------------------------------------------------

@set db.connection.url=jdbc:oracle:thin:@epruizhst0001.moscow.epam.com:1521:ALFADBO
@set db.liquibase.context=prod
REM @set db.liquibase.context=dev
REM @set db.liquibase.context="prod,demo"

@set db.connection.admin.name=system
@set db.connection.admin.password=manager
@set db.user.flextera.name=AK_FLEXTERA703
@set db.user.flextera.password=AK_FLEXTERA703
@set db.user.ldic.name=AK_LDIC_1_1
@set db.user.ldic.password=AK_LDIC_1_1
@set db.user.ladm.name=AK_LADM_1_1bp
@set db.user.ladm.password=AK_LADM_1_1bp
@set db.user.lpmt.name=AK_LPMT_1_1
@set db.user.lpmt.password=AK_LPMT_1_1
@set db.user.lms.name=AK_LMS_1_1
@set db.user.lms.password=AK_LMS_1_1
@set db.user.lntf.name=AK_LNTF_1_1
@set db.user.lntf.password=AK_LNTF_1_1
@set db.user.lenv.name=AK_LEVN_1_1
@set db.user.lenv.password=AK_LEVN_1_1
@set db.user.lrq.name=AK_LRQ_1_1
@set db.user.lrq.password=AK_LRQ_1_1
@set db.user.monlog.name=AK_MONLOG_1_1
@set db.user.monlog.password=AK_MONLOG_1_1
@set db.user.lsta.name=AK_LSTA_1_1
@set db.user.lsta.password=AK_LSTA_1_1
@set db.user.lclf.name=AK_LCLF_1_1
@set db.user.lclf.password=AK_LCLF_1_1
@set db.user.lemf.name=AK_LEMF_1_1
@set db.user.lemf.password=AK_LEMF_1_1
@set db.user.lcc.name=AK_LCC
@set db.user.lcc.password=AK_LCC
@set db.user.lcpmt.name=AK_LCPMT
@set db.user.lcpmt.password=AK_LCPMT
@set db.user.alfalog.name=AK_ALFALOG_1_1
@set db.user.alfalog.password=AK_ALFALOG_1_1
@set db.user.files.name=AK_ATTACHMENTS_1_1
@set db.user.files.password=AK_ATTACHMENTS_1_1
::-----------------------------------------------------------------------------------------------------------------------
:: ALBO CONFIGURATION FILES SETTIGS
:: WARN: Use only direct slash! For example: D:/FLEXTERA/METADATA instead D:\FLEXTERA\METADATA
::-----------------------------------------------------------------------------------------------------------------------


:: Common settings
@set deploy.albo.metadata.path=D:/Projects/Alfabank/runtime/METADATA
@set config.db.connectionPool.min=1
@set config.db.connectionPool.max=4
@set config.systemUserName=alfasys
@set config.systemUserPassword=12345678
@set config.systemUserHash=7c222fb2927d828af22f592134e8932480637c0d
@set config.outputPath=D:/Projects/Alfabank/runtime/OUTPUT
@set config.useJNDIDataSources=false
@set config.logger.level=WARN
@set config.logger.maxFileSize=8MB
@set config.logger.MaxBackupIndex=4
@set config.logger.flexteraEmplPrefixPath=logs_fx_empl/
@set config.logger.flexteraClPrefixPath=logs_fx_cl/
@set config.logger.alboEmplPrefixPath=logs_albo_empl/
@set config.logger.alboClPrefixPath=logs_albo_cl/

:: RMI settings
@set config.rmi.enable=true

@set config.rmi.emplServerPort=12000
@set config.rmi.servicePorts.employeefacadews=12010
@set config.rmi.servicePorts.emplDictionariesws=12020
@set config.rmi.servicePorts.emplLinkadminws=12030
@set config.rmi.servicePorts.emplMessagesws=12040
@set config.rmi.servicePorts.emplNotificationws=12050
@set config.rmi.servicePorts.emplPaymentws=12060
@set config.rmi.servicePorts.emplStatementws=12070
@set config.rmi.servicePorts.emplMqadapterws=12080
@set config.rmi.servicePorts.emplFtcconvws=12090
@set config.rmi.servicePorts.emplFtcpaymentsws=12100
@set config.rmi.servicePorts.emplCorews=12110

@set config.rmi.clServerPort=13000
@set config.rmi.servicePorts.clientfacadews=13010
@set config.rmi.servicePorts.clDictionariesws=13020
@set config.rmi.servicePorts.clLinkadminws=13030
@set config.rmi.servicePorts.clMessagesws=13040
@set config.rmi.servicePorts.clNotificationws=13050
@set config.rmi.servicePorts.clPaymentws=13060
@set config.rmi.servicePorts.clStatementws=13070
@set config.rmi.servicePorts.clFtcconvws=13080
@set config.rmi.servicePorts.clFtcpaymentsws=13090
@set config.rmi.servicePorts.clCorews=13100

:: Flextera settings
@set config.flextera.emplHost=localhost
@set config.flextera.emplPort=9085
@set config.flextera.clHost=localhost
@set config.flextera.clPort=9085
@set config.flextera.guestUserName=dca
@set config.flextera.guestUserPassword=12345678

:: ALBO settings
@set config.albo.emplHost=localhost
@set config.albo.emplPort=9084
@set config.albo.clHost=localhost
@set config.albo.clPort=9083
@set config.albo.refGuestUserName=dca
@set config.albo.refGuestUserPassword=12345678
@set config.albo.emplWebclient.guestUserName=employeeguest
@set config.albo.emplWebclient.guestUserPassword=12345678
@set config.albo.emplWebclient.project=LEMF
@set config.albo.emplWebclient.title=ALBO
@set config.albo.clWebclient.guestUserName=clientguest
@set config.albo.clWebclient.guestUserPassword=12345678
@set config.albo.clWebclient.project=LCLF
@set config.albo.clWebclient.title=ALBO
@set config.albo.rqws.resultFolderPath=D:/Projects/Alfabank/runtime/rqws
@set config.albo.rqws.bootStrapAddressCl=2810
@set config.albo.rqws.bootStrapAddressEmpl=2810
@set config.albo.rqws.timerInterval=100
@set config.albo.rqws.requestExpireHours=20
@set config.albo.alfacs.testOutXMLDir=D:/Projects/Alfabank/runtime/alfacs
@set config.albo.equation.userId=WSLK
@set config.albo.equation.externalSystemCode=LKK21
@set config.albo.equation.externalSystemMnemo=LK
@set config.albo.equation.externalUserCode=WSLK
@set config.albo.equation.branchNumber=0000
@set config.albo.smsService.userId=IBSR
@set config.albo.smsService.externalSystemCode=GRCHB01
@set config.albo.smsService.externalUserCode=IBSR
@set config.albo.smsService.branchNumber=0000

@set config.albo.cryptoproCafile=d:/albo/root.cer
@set config.albo.cryptoproKeyStoreType=HDImageStore
@set config.albo.cryptoproKeyStoreAlias=correct
@set config.albo.cryptoproKeyStorePassword=111111

:: Alfa Customer Services
@set config.albo.alfaCS.WSDistributeSendSMS=http://evrumossd0135:8080/axis2/services/WSDistributeSendSMSService
@set config.albo.alfaCS.WSCustomerBaseInfo=http://evrumossd0135:8080/axis2/services/WSCustomerBaseInfo11Service
@set config.albo.alfaCS.WSCustomerAddressList=http://evrumossd0135:8080/axis2/services/WSCustomerAddressListService
@set config.albo.alfaCS.WSCodeCountryInfo=http://evrumossd0135:8080/axis2/services/WSCodeCountryInfoService
@set config.albo.alfaCS.WSCodeBranchInfo=http://evrumossd0135:8080/axis2/services/WSCodeBranchInfoService
@set config.albo.alfaCS.WSCodeAddInfValueInfo=http://evrumossd0135:8080/axis2/services/WSCodeAddInfValueInfoService
@set config.albo.alfaCS.WSCustomerAccountList=http://evrumossd0135:8080/axis2/services/WSCustomerAccountListService
@set config.albo.alfaCS.WSAccountBaseInfo=http://evrumossd0135:8080/axis2/services/WSAccountBaseInfoService
@set config.albo.alfaCS.WSCustomerIdentityCardList=http://evrumossd0135:8080/axis2/services/WSCustomerIdentityCardList11Service
@set config.albo.alfaCS.WSCodeUniqueTypeInfo=http://evrumossd0135:8080/axis2/services/WSCodeUniqueTypeInfoService
@set config.albo.alfaCS.WSCodeBICInfo=http://evrumossd0135:8080/axis2/services/WSCodeBICInfoService
@set config.albo.alfaCS.WSSettlementCreateDocRUR=http://evrumossd0135:8080/axis2/services/WSSettlementCreateDocRUR11Service
@set config.albo.alfaCS.WSAccountPayDocInfo=http://evrumossd0135:8080/axis2/services/WSAccountPayDocInfo11Service
@set config.albo.alfaCS.WSAccountMovementList=http://evrumossd0135:8080/axis2/services/WSAccountMovementList11Service
@set config.albo.alfaCS.WSCustomerExternalSystem=http://evrumossd0135:8080/axis2/services/WSCustomerExternalSystem11Service
@set config.albo.alfaCS.WSCodeCurrencyCalendar=http://evrumossd0135:8080/axis2/services/WSCodeCurrencyCalendarService
@set config.albo.alfaCS.WSAccountTurnoverList=http://evrumossd0135:8080/axis2/services/WSAccountTurnoverListService
@set config.albo.alfaCS.WSCodeAddressElementsInfo=http://evrumossd0135:8080/axis2/services/WSCodeAddressElementsInfoService
@set config.albo.alfaCS.WSCodeAccountTypeInfo=http://evrumossd0135:8080/axis2/services/WSCodeAccountTypeInfoService
@set config.albo.alfaCS.WSAccountHoldList=http://evrumossd0135:8080/axis2/services/WSAccountHoldListService
@set config.albo.alfaCS.WSAccountPayDocCumulativeHold=http://evrumossd0135:8080/axis2/services/WSAccountPayDocCumulativeHoldService
@set config.albo.alfaCS.WSAccountPayDocInFutureList=http://evrumossd0135:8080/axis2/services/WSAccountPayDocInFutureListService
@set config.albo.alfaCS.WSAccountPayDocInQueueList=http://evrumossd0135:8080/axis2/services/WSAccountPayDocInQueueListService
@set config.albo.alfaCS.WSAccountPayDocInCardfileList=http://evrumossd0135:8080/axis2/services/WSAccountPayDocInCardfileListService
@set config.albo.alfaCS.WSCodeCurrencyInfo=http://evrumossd0135:8080/axis2/services/WSCodeCurrencyInfoService
@set config.albo.alfaCS.WSCustomerSearchClients=http://evrumossd0135:8080/axis2/services/WSCustomerSearchClientsService
@set config.albo.alfaCS.WSCustomerTrustPersons=http://evrumossd0135:8080/axis2/services/WSCustomerTrustPersons10Service
@set config.albo.alfaCS.WSCodeSwiftInfoService=http://evrumossd0135:8080/axis2/services/WSCodeSwiftInfoService
@set config.albo.alfaCS.WSSettlementCreateDocCUR=http://localhost:8080/axis2/services/WSSettlementCreateDocCURService
@set config.albo.alfaCS.WSCustomerAccountListGBA=http://localhost:8080/axis2/services/WSCustomerAccountListGBAService
@set config.albo.alfaCS.WSCodeCurrencyExchange=http://localhost:8080/axis2/services/WSCodeCurrencyExchangeService