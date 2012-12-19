#Group operations
##Страницы
##

#Явки, пароли
baenova/Gkjirf1384

#Client
Server console   =	https://127.0.0.1:9046/ibm/console/login.do
webclient		 =	http://localhost:9083/webclient
clientfacadews   =	http://localhost:9083/clientfacadews/clientfacadews
paymentws        =	http://localhost:9083/paymentws/paymentws
statementws      =	http://localhost:9083/statementws/statementws
messagesws       =	http://localhost:9083/messagesws/messagesws
debug port       =	7780

#Employee
Server console   =	https://127.0.0.1:9047/ibm/console/login.do
webclient		 =	http://localhost:9084/webclient
employeefacadews =	http://localhost:9084/employeefacadews/employeefacadews 
linkadminws      =	http://localhost:9084/linkadminws/linkadminws 
dictionariesws   =	http://localhost:9084/dictionariesws/dictionariesws 
notificationsws  =	http://localhost:9084/notificationsws/notificationsws 
mqadapterws      =	http://localhost:9084/mqadapterws/mqadapterws 
debug port       =	7781



#flextera7
https://localhost:9048/ibm/console
http://localhost:9085/webclient/

Собирать через Oracle JRE, иначе проблемы с xml библиотекой в runtime вылезут


#Денежные клиенты
UAB8M8 - ООО Лютик

###Полезные команды
dm.bat -u --url=jdbc:oracle:thin:@epruizhst0001.moscow.epam.com:1521:ALFADBO --database=AK_FLEXTERA703 --username=AK_FLEXTERA703 --password=AK_FLEXTERA703 --logFile=updatedb.log
git archive --format zip --output ../jmsEQMediation.zip master 
mvn install:install-file -Dfile=common-rmi-7.03.01-12102901.jar -DgroupId=ru.diasoft.fa.platform.lib -DartifactId=common-rmi -Dversion=7.03.01-12102901 -Dpackaging=jar
mvn install:install-file -Dfile=ws-security-7.02.01-12101201.jar -DgroupId=ru.diasoft.fa.platform.lib -DartifactId=ws-security -Dversion=7.03.01-12102901 -Dpackaging=jar
sed 's/function \(\w*\)(/\1 = function(/'


# БД
## Правила
	K01_FTS_CLIENT - имя индекса, K<номер индекса>_<имя таблицы с префиксом>


#Запрос на изменение типа пользователя
insert into ak_ladm_1_1.LADM_USERACCROLE (useraccountid,roleid) 
	values ((select useraccountid from ak_flextera703.CORE_USERACCOUNT where login='alfasys'),
		(select id from ak_ladm_1_1.LADM_ROLE where sysname='SysRole')); 
commit;

#поставить колонку id у таблицы для работы выделенения



#Cayenne Velocity:
	$value - ссылка на входной параметр в мапе
	#result - преобразование результата запроса в DataRow с проверкой типа (ResultSet -> DO)
	#bind	-	привязка к значению, может раскрывать коллекции, выполнять преобразования над числами(scale)
	#chain	-	A custom Velocity directive to conditionally join a number of chunks. #chain(operator [prefix]), operator - соеденитель для chunks, prefix добавляется в начало, если срабатывает хотябы один chunk
	#chunk	-	If context contains paramKey and it's value isn't null, chunk is included in the chain, and if it is not the first chunk, it is prefixed with chain join (OR/AND). If context doesn't contain paramKey or it's value is null, chunk is skipped. 