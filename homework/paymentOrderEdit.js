var Client = Client || {};
Client.Payment = Client.Payment || {};
Client.Payment.PaymentOrderEdit = {};

// Ext.Loader.load(["static/js/client/payment/paymentOrderEdit.js",
//                  "static/js/client/payment/paymentUtils.js",
//                  "static/js/client/account/accountUtils.js"], 
                 



//<editor-fold desc="Глобальные переменные" defaultstate="collapsed">
Client.Payment.PaymentOrderEdit.me = this;
Client.Payment.PaymentOrderEdit.errors = [];
// Флаг того что форма изменена
Client.Payment.PaymentOrderEdit.isFormChanged = false;
Client.Payment.PaymentOrderEdit.isLoadCompleted = false;
Client.Payment.PaymentOrderEdit.DATE_FORMAT = "d.m.Y"; // format extjs
// this is analog stage name (is page rendering loading, or page is initialized already
Client.Payment.PaymentOrderEdit.isOnChangeEnabled = false; 
Client.Payment.PaymentOrderEdit.documentStatus = 'New';
Client.Payment.PaymentOrderEdit.recipientBankEr1 = null;
Client.Payment.PaymentOrderEdit.paymentTypeCase = null;
Client.Payment.PaymentOrderEdit.docMode = null;
// Указатель отправки формы на печать - необходим для отключения перехвата изменения формы при печати
Client.Payment.PaymentOrderEdit.isPrintForm = false;

//выбранный счет плательщика
Client.Payment.PaymentOrderEdit.selectedPayerAccountNumber = null;

//Выбранный вид платежа
Client.Payment.PaymentOrderEdit.selectedPaymentType = null;

// Создано из шаблона
Client.Payment.PaymentOrderEdit.fromTemplateId = null;

Client.Payment.PaymentOrderEdit.isSaveRecipient = true;
Client.Payment.PaymentOrderEdit.isCreateOneMore = true;
Client.Payment.PaymentOrderEdit.isSendToBank = false;

Client.Payment.PaymentOrderEdit.isUpdateNdsText = true;
//Строка, которая будет заменена на посчитанный НДС
Client.Payment.PaymentOrderEdit.chargeNdsAddTextToken = 'xxx';
//Суффикс, который будет добавлен к посчитанному НДС
Client.Payment.PaymentOrderEdit.chargeNdsAddTextSufix = ' руб';
//Сумма НДС, на которую была увеличена Сумма платежа
Client.Payment.PaymentOrderEdit.chargeNdsIncreaseSumOn = 0;
//Шаблон текста, который будет добавлен к Назначению платежа при выборе НДС
Client.Payment.PaymentOrderEdit.chargeNdsAddText = '';
//Сумма НДС, которая включена в Сумму платежа и была добавлена в Назанчение платежа
Client.Payment.PaymentOrderEdit.chargeNdsAddSumToText = 0;
//Текст с суммой НДС, который был добавлен к Назначению платежа
Client.Payment.PaymentOrderEdit.chargeNdsFinalText = '';
//Определяет, нужно ли пересчитывать НДС (true - нет, уже посчитан)
Client.Payment.PaymentOrderEdit.isChargeNdsChanged = true;
//Ключевое слово для поиска по шаблону
Client.Payment.PaymentOrderEdit.keyword = '';
//Список масок счетов нерезидентов.
Client.Payment.PaymentOrderEdit.nonResAccGrouplist = null;

// Код подразделения для выбранного счета
Client.Payment.PaymentOrderEdit.departmentCode = 0;
//Адрес клиента
Client.Payment.PaymentOrderEdit.payerAddress = '';
Client.Payment.PaymentOrderEdit.payerName = '';
// Минимальная сумма для включения адреса в наименование плательщика (в рублях)
Client.Payment.PaymentOrderEdit.minSumRUR = 15000;

Client.Payment.PaymentOrderEdit.FORM_NAME_EDIT = "Редактирование платёжного документа в рублях";
Client.Payment.PaymentOrderEdit.FORM_MAIN_HEADER = "Платёж";

Client.Payment.PaymentOrderEdit.AMOUNT_ERROR_MESSAGE = "Значение в поле суммы некорректно";
Client.Payment.PaymentOrderEdit.DELETED_TEMPLATE_WARNING = "Данный шаблон был удален пользователем";

Client.Payment.PaymentOrderEdit.SHOW_ALL_TEMPLATES_NAME = "Показать все шаблоны";
Client.Payment.PaymentOrderEdit.SHOW_ALL_TEMPLATES_ID = "SHOW_ALL_TEMPLATES";

//clientByAcc[accountNumber].pinEq, clientByAcc[accountNumber].clientId
Client.Payment.PaymentOrderEdit.clientByAcc = {};

Client.Payment.PaymentOrderEdit.SPACEBAR_KEY_CODE = 32;
Client.Payment.PaymentOrderEdit.ENTER_KEY_CODE = 13;




// Цепочки вызовов
//var payerInfoChain = new DSCallChain([preProcess, getaymentNextNumber, getClientBaseInfo, getClientAccounts, getPayerAccountBaseInfo, getPayerBankFields, calculatePaymentType, postProcess]);
//var recipientInfoChain = new DSCallChain([preProcess, getRecipientBaseInfo, getRecipientAccountInfo, getRecipientBankFields, calculatePaymentType, postProcess]);

// Поля поиска


Client.Payment.PaymentOrderEdit.oldRecipientInn = "";
Client.Payment.PaymentOrderEdit.oldRecipientBic = "";
Client.Payment.PaymentOrderEdit.oldPeriod = "";

Client.Payment.PaymentOrderEdit.memRecipientName_OnKey = function(event) {
    event = event ? event : window.event;
    var srcEl = event.srcElement;
    this.cutElementLength(srcEl, 160);
};

Client.Payment.PaymentOrderEdit.hkRegistry = function (){
     var PaymentRegisterIDList = getNewList();
     var PaymentRegisterID = getInputParams("payRegisterID");
     var map = getNewMap();
     map.put("PaymentRegisterID", PaymentRegisterID); 
     PaymentRegisterIDList.add(map);
     setOutputParams("PaymentRegisterIDList", PaymentRegisterIDList);
     sendForm("REGISTRY");
 };

Client.Payment.PaymentOrderEdit.initDSCallers = function (){
    // DScallers
    this.serviceGetChargeNDSById = new DSCaller('[dictionariesws]', 'getchargendsbyid', 'setChargeNds', 'id'); 
    this.serviceIsClientUrgencyHasFee = new DSCaller('[paymentws]', 'isclienturgencyhasfee', 'checkPaymentUrgency');
    this.serviceGetClientPinEqById = new DSCaller('[linkadminws]', 'getclientpineqbyid', false, 'id');
    this.serviceGetClientInfoByPinEq = new DSCaller('[linkadminws]', 'getclientinfobypineq', 'setClientId', 'pinEq');
    this.serviceGetClientAccList = new DSCaller('[linkadminws]', 'getclientacclist', 'setClientAccounts', 'pinEq');
    this.serviceGetUserAccList = new DSCaller('[linkadminws]', 'getuseracclistforpayment', 'setUserAccounts', false);
    this.serviceGetAccountBaseInfo = new DSCaller('[linkadminws]', 'getclientacc', 'setPayerAccountBaseInfo', 
        'accountNumber');
    this.serviceGetPaymentNextNumber = new DSCaller('[paymentws]', 'getpaymentnextnumber', 'setPaymentNextNumber', 
        false);
    this.serviceGetDocNumberForIdAndClient = new DSCaller('[paymentws]', 'getDocNumberForIdAndClient', false, false);
    this.serviceGetClientBaseInfo = new DSCaller('[linkadminws]', 'getclientbaseinfo', 'setClientBaseInfo', 'pinEq');
    this.serviceGetCagentAccById = new DSCaller('[dictionariesws]', 'getcagentaccbyid', 'setRecipientAccountInfo', 
        'id');
    this.serviceGetCagentById = new DSCaller('[dictionariesws]', 'getcagentbyid', 'setRecipientBaseInfo', 'id');
    this.serviceGetPaymentTypeList = new DSCaller("[paymentws]", "getpaymenttypelist", "onPaymentTypeLoad", false);
    this.serviceBicBrowseListByParam = new DSCaller('[dictionariesws]', 'bicbrowselistbyparam', 
        'populatePayerBankFields', 'bic');
    this.serviceGetClientCotByBranch = new DSCaller('[linkadminws]', 'getclientcotbybranch', 'setSendTodayFlag');
    //setRecipientBankFields
    this.serviceCheckCBC = new DSCaller('[dictionariesws]', 'checkcbc', 'showKbkAlert', false);
    this.serviceCheckOkato = new DSCaller('[dictionariesws]', 'checkokato', 'showOkatoAlert', 'okato');
    this.serviceGetCalendar = new DSCaller('[dictionariesws]', 'getcalendar', 'validatePaymentDate', false); 
    this.serviceCheckAccountToNonResAccGroup = new DSCaller('[dictionariesws]', 'checkaccounttononresaccgroup', '???', 
        false);
    this.serviceGetClientInfoById = new DSCaller('[linkadminws]', 'getclientinfobyid', 'setClientPinEq', false);
    this.serviceGetMultiButtonOptions = new DSCaller('[paymentws]', 'getpaymentmultibuttonoptions', false, false);
    this.serviceGetClientAdderss = new DSCaller('[linkadminws]', 'getorganizationaddresses', 'getClientAddress', false);
    this.serviceGetMinSumSettings = new DSCaller('[linkadminws]', 'getsettingbyname', '???', false);
    this.serviceGetNonResAccGrouplist = new DSCaller('[dictionariesws]', 'ui_getnonresaccgrouplist', false, false);
};

Client.Payment.PaymentOrderEdit.initLookups = function () {
    var me = this;

    this.clientLookup = { pageflow:'client/payment/selectPayer', width: 650, height: 370, title:"Выбор плательщика", 
        callback:function(){
            me.onPayerSelected();
            me.onChangeForm();          
        }
    };

    this.recipientLookup = { pageflow:'client/payment/selectCagent', width: 650, height: 370, 
    title:"Выбор получателя", 
    callback: function(){
            me.onRecipientSelected();
            me.onChangeForm();
        }
    }

    this.templateLookup = { pageflow:'client/payment/selectTemplate', width: 650, height: 370, title:"Выбор шаблона", 
        callback:function(){
            me.onTemplateSelected();         
        }
    };

    this.budgetBaseValueLookup = {pageflow:'client/payment/selectBudgetValue', width: 500, height: 500, 
    title:"Выбор статуса плательщика", 
        callback:function(){
            me.budgetStatusValueSelected();
            me.onChangeForm();  
        }
    }

    this.budgetBaseValueLookup = {pageflow:'client/payment/selectedBudgetBaseValue', width: 500, height: 500, 
    title:"Выбор основания платежа", 
        callback:function(){
            me.budgetBaseValueSelected();
            me.onChangeForm();      
        }
    }

    this.budgetPeriodPrefixLookup = {pageflow:'client/payment/selectBudgetPeriodPrefix', width: 500, height: 500, 
    title:"Выбор налогового периода", 
        callback:function(){
            me.budgetPeriodPrefixSelected();
            me.onChangeForm();   
        }
    }
}

/**
 * Инициализация оберток для элементов формы.
 */
Client.Payment.PaymentOrderEdit.initWrappers = function () {
    // Form Panels
    this.frmPaymentOrderEdit = new TWPanelWrapper("frmPaymentOrderEdit");
    this.pnlTopMenu = new TWPanelWrapper("frmPaymentOrderEdit.pnlTopMenu");
    this.pnlPaymentOrder = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder");
    this.pnlGeneralInfo = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo");
    this.pnlPayerInfo = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo");
    this.pnlRecipientInfo = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo");
    this.pnlPaymentPurposeInfo = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo");
    this.pnlBudgetDetailsBlock = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock");
    this.pnlPayerBankInfo = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerBankInfo");
    this.pnlRecipientBankInfo = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientBankInfo");
    this.pnlPaymentAdditionalInfo = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlPaymentAdditionalInfo");
    this.pnlPaymentKindChoose = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlPaymentKindChoose");
    this.pnlBudgetDetailsControl = new TWPanelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsControl");
    this.pnlSubscribers = new TWPanelWrapper("frmPaymentOrderEdit.pnlSubscribers");
    this.pnlBottomButtons2 = new TWPanelWrapper("frmPaymentOrderEdit.pnlBottomButtons2");

    //Заголовки
    this.lblFormName = new TWLabelWrapper("frmPaymentOrderEdit.pnlTopMenu.lblFormName");
    this.lblMainHeader = new TWLabelWrapper("frmPaymentOrderEdit.pnlTopMenu.lblMainHeader");

    // Общая информация о платеже
    this.edtPaymentNumber = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.edtPaymentNumber");
    this.elkTemplateSelect = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.elkTemplateSelect");
    this.cmbTemplateSelect = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.cmbTemplateSelect");
    this.edtPaymentAmountValue = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.pnlPaymentAmount.edtPaymentAmountValue");
    this.lblAmountInWordsValue = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.pnlPaymentAmount.lblAmountInWordsValue");
    this.edtPaymentKindValue = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.edtPaymentKindValue");
    this.chbSendToday = new TWCheckBoxWrapper("frmPaymentOrderEdit.pnlTopMenu.chbSendToday");
    this.lblSendTodayWarning = new TWLabelWrapper("frmPaymentOrderEdit.pnlTopMenu.lblSendTodayWarning");
    this.clnProcessDateValue = new TWCalendarWrapper("frmPaymentOrderEdit.pnlTopMenu.clnProcessDateValue");
    this.clnPaymentDateValue = new TWCalendarWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.clnPaymentDateValue");
    this.lblSumWarning = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.pnlPaymentAmount.lblSumWarning");
    this.edtTemplateSelect = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.edtTemplateSelect");
    this.lblTemplateTitle = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlGeneralInfo.lblTemplateTitle");

    // Информация о плательщике
    this.elkPayerSelect = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerHeader.elkPayerSelect");
    this.edtPayerSelectId = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerHeader.edtPayerSelectId");
    this.edtPayerSelectName = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerHeader.edtPayerSelectName");
    this.lblPayerSelect = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerHeader.lblPayerSelect");
    this.lblPayerTinValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.lblPayerTinValue");
    this.cmbPayerKppValue = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerKppValue");
    this.lblPayerNameValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.lblPayerNameValue");
    this.cmbPayerAccountNumber = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerAccountNumber");
    this.lblAvailableAmountValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.lblAvailableAmountValue");
    this.lblPayerBankBicValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerBankInfo.lblPayerBankBicValue");
    this.lblPayerBankCorAccountValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerBankInfo.lblPayerBankCorAccountValue");
    this.lblPayerBankNameValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerBankInfo.lblPayerBankNameValue");
    this.imgPayerBankShow = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.imgPayerBankShow");
    this.imgPayerBankHide = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.imgPayerBankHide");
    this.payerBankExpander = new PanelExpander(this.pnlPayerBankInfo, this.imgPayerBankShow, this.imgPayerBankHide);
    this.lblPayerBankRegionValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerBankInfo.lblPayerBankRegionValue");
    this.lblKppMandatory = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.lblKppMandatory");
    // Информация о получателе
    this.elkRecipientSelect = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientHeader.elkRecipientSelect");
    this.elkRecipientBankBicSelect = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.elkRecipientBankBicSelect");
    this.memRecipientNameValue = new TWMemoWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.memRecipientNameValue");
    this.edtRecipientTin = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.edtRecipientTin");
    this.edtRecepientTinContainer = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.edtRecipientTin.container");
    this.edtRecipientKpp = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.edtRecipientKpp");
    this.cmbRecipientKppSelect = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.cmbRecipientKppSelect");
    this.edtRecipientAccountNumber = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.edtRecipientAccountNumber");
    this.cmbPriorityValue = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.cmbPriorityValue");
    this.lblRecipientBankNameValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientBankInfo.lblRecipientBankNameValue");
    this.lblRecipientBankCorAccountValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientBankInfo.lblRecipientBankCorAccountValue");
    this.edtRecipientBankBic = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientBankInfo.edtRecipientBankBic");
    this.edtRecipientBankBicContainer = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientBankInfo.edtRecipientBankBic.container");
    this.lblRecipientBankRegionValue = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientBankInfo.lblRecipientBankRegionValue");
    this.lblRecipientKppMandatory = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.lblRecipientKppMandatory");
    this.wrnBic = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientBankInfo.wrnBic");
    this.wrnRecepientAccountNumber = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.wrnRecepientAccountNumber");
    this.lblRecipientSelect = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.pnlRecipientHeader.lblRecipientSelect");
    this.lblRecipientBankTitle = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.lblRecipientBankTitle");

    // Информация о назначении платежа
    this.imgAdditionalInfoShow = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.imgAdditionalInfoShow");
    this.imgAdditionalInfoHide = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.imgAdditionalInfoHide");
    this.memPaymentAdditionalInfo = new TWMemoWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlPaymentAdditionalInfo.memPaymentAdditionalInfo");
    this.additionalInfoExpander = new PanelExpander(this.pnlPaymentAdditionalInfo, this.imgAdditionalInfoShow, this.imgAdditionalInfoHide);
    this.imgBudgetDetailsShow = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsControl.imgBudgetDetailsShow");
    this.imgBudgetDetailsShowContainer = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsControl.imgBudgetDetailsShow.container");
    this.imgBudgetDetailsHide = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsControl.imgBudgetDetailsHide");
    this.imgBudgetDetailsHideContainer = new TWElementWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsControl.imgBudgetDetailsHide.container");
    this.budgetDetailsExpander = new PanelExpander(this.pnlBudgetDetailsBlock, this.imgBudgetDetailsShow, this.imgBudgetDetailsHide);
    this.cmbPaymentKindChoose = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlPaymentKindChoose.cmbPaymentKindChoose");
    this.cmbChargeNdsDisplayValue = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.cmbChargeNdsDisplayValue");
    this.memPaymentDetailsValue = new TWMemoWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.memPaymentDetailsValue");
    // Поля бюджетного платежа
    this.chbBudgetPaymentFlag = new TWCheckBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsControl.chbBudgetPaymentFlag");
    this.edtBudgetOkato = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetOkatoValue");
    this.edtBudgetOkatoContainer = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetOkatoValue.container");
    this.wrnOkato = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.wrnOkato");
    this.edtBudgetPaymentType = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetPaymentTypeValue");
    this.edtBudgetDocDate = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetDocDateValue");
    this.edtBudgetKbk = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetKbkValue");
    this.edtBudgetKbkContainer = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetKbkValue.container");
    this.wrnKbk = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.wrnKbk");
    this.edtBudgetDocNum = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetDocNumValue");
    this.edtBudgetBase = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetBaseValue");
    this.edtBudgetStatusValue = new TWComboBoxWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetStatusValue");
    this.edtBudgetPeriodValue = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetPeriodValue");
    this.edtBudgetPeriod = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetPeriod");
    this.elkBudgetStatusValue = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.elkBudgetStatusValue");
    this.lblBudgetStatusValueError = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.lblBudgetStatusValueError");
    this.edtBudgetPeriodPrefix = new TWEditWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetPeriodPrefix");
    this.lblBudgetPeriodPrefix = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.lblBudgetPeriodPrefix");
    this.lblBudgetPeriodPrefixError = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.lblBudgetPeriodPrefixError");
    this.elkBudgetBaseValue = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.elkBudgetBaseValue");
    this.lblBudgetBaseValueError = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.lblBudgetBaseValueError");
    this.elkBudgetPeriodPrefix = new TWDBLookupWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.elkBudgetPeriodPrefix");
    this.lblBudgetPeriodTitle = new TWStyledLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.lblBudgetPeriodTitle");

    this.chbCreateTemplate = new TWCheckBoxWrapper("frmPaymentOrderEdit.pnlSubscribers.chbCreateTemplate");
    this.chbSaveAsDraft = new TWCheckBoxWrapper("frmPaymentOrderEdit.pnlSubscribers.chbSaveAsDraft");

    this.lblPrintLink = new TWLabelWrapper("frmPaymentOrderEdit.pnlTopMenu.lblPrintLink");
    this.mlbMore = new TWMultiButtonWrapper('frmPaymentOrderEdit.pnlBottomButtons2.mlbMore');

    //FIXME: fx7, no autocomplete
    this.cagentInnSearch = new TWElementWrapper(this.edtRecipientTin.id)
    this.budgetKbkSearch = new TWElementWrapper(this.edtBudgetKbk.id);
    this.cagentBicSearch = new TWElementWrapper(this.edtRecipientBankBic.id);
    this.budgetOkatoSearch = new TWElementWrapper(this.edtBudgetOkato.id);
    // this.cagentInnSearch = new TWAutocompleteWrapper(edtRecipientTin.id, {
    //     minChars : 0,
    //     isTable : true,
    //     maskRe : /\d/,
    //     pageSize : 10,
    //     dsCallService : "[dictionariesws]",
    //     dsCallMethod : "searchusercagentswithacc",
    //     dsCallQueryMapping : function(query, defaultDsCallParams) {
    //         var params = getNewMap();
    //         if (defaultDsCallParams)
    //         var defaultKeySet = defaultDsCallParams.keySet();
    //         for (var i = 0; i < defaultKeySet.size(); i++){
    //             params.put(defaultKeySet.get(i), defaultDsCallParams.get(defaultKeySet.get(i)));
    //         }
    //         params.put("innkeyword", query);
    //         return params;
    //     },
    //     columns : [
    //         {field : 'inn', title : 'ИНН', width : 100},
    //         {field : 'name', title : 'Название', width : 300},
    //         {field : 'cagentId', title : 'cagentId', hidden:true},
    //         {field : 'cagentAccId', title : 'cagentAccId', hidden:true},
    //         {field : 'clientId', title : 'clientId', hidden:true},
    //         {field : 'kpp', title : 'kpp', hidden:true},
    //         {field : 'kpp2', title : 'kpp2', hidden:true},
    //         {field : 'bic', title : 'bic', hidden:true},
    //         {field : 'acc', title : 'Счет', hidden:true}
    //     ],
    //     idProperty : 'inn',
    //     valueField: 'inn',
    //     displayField: 'inn',
    //     listeners : {
    //         select : function(component, record, index){
    //             _disableOnChange(function() {
    //                 Client.Payment.PaymentOrderEdit.populateRecipientBaseInfo(record.get("inn"),
    //                  record.get("name"), record.get("kpp"), record.get("kpp2"));
    //                 Client.Payment.PaymentOrderEdit.populateRecipientAccountInfo(record.get("acc"), record.get("bic"));
    //             });
    //             Client.Payment.PaymentOrderEdit.getRecipientBankFields(record.get("bic"));
    //             Client.Payment.PaymentOrderEdit.cagentBicSearch.setValue(record.get("bic"));
    //         },
    //         change : function(component, newValue, oldValue) {
    //             _disableOnChange(function(){
    //                 edtRecipientTin.setValue(newValue);
    //             })
    //         }
    //     }
    // });

    // this.cagentBicSearch = new TWAutocompleteWrapper(edtRecipientBankBic.id, {
        //     minChars : 0,
        //     isTable : true,
        //     pageSize : 10,
        //     maskRe : /\d/,
        //     dsCallService : "[dictionariesws]",
        //     dsCallMethod : "bicbrowselistbyparam",
        //     dsCallQueryMapping : function(query, defaultDsCallParams) {
        //         var params = getNewMap();
        //         var defaultKeySet = defaultDsCallParams.keySet();
        //         for (var i = 0; i < defaultKeySet.size(); i++){
        //             params.put(defaultKeySet.get(i), defaultDsCallParams.get(defaultKeySet.get(i)));
        //         }
        //         params.put("bickeyword", query);
        //         return params;
        //     },
        //     columns : [
        //         {field : 'bic', title : 'БИК', width : 100},
        //         {field : 'koName', title : 'Название', width : 300}
        //     ],
        //     idProperty : 'bic',
        //     valueField: 'bic',
        //     displayField: 'bic',
        //     listeners : {
        //         select : function(component, record, index){
        //             Client.Payment.PaymentOrderEdit.edtRecipientBankBic.setValue(record.get("bic"));
        //         },
        //         change : function(component, newValue, oldValue) {
        //             Client.Payment.PaymentOrderEdit.edtRecipientBankBic.setValue(newValue);
        //         }
        //     }
        // }
    // );

    // this.budgetKbkSearch = new TWAutocompleteWrapper(edtBudgetKbk.id, {
    //         listAlign : "bl-tl",
    //         minChars : 0,
    //         isTable : true,
    //         pageSize : 10,
    //         dsCallService : "[dictionariesws]",
    //         dsCallMethod : "findCbc",
    //         dsCallQueryMapping : function(query, defaultDsCallParams) {
    //             var params = getNewMap();
    //             var defaultKeySet = defaultDsCallParams.keySet();
    //             for (var i = 0; i < defaultKeySet.size(); i++){
    //                 params.put(defaultKeySet.get(i), defaultDsCallParams.get(defaultKeySet.get(i)));
    //             }
    //             params.put("keyword", query);
    //             return params;
    //         },
    //         columns : [
    //             {field : 'taxcbc_code', title : 'КБК', width : 150},
    //             {field : 'description', title : 'Описание', width : 400}
    //         ],
    //         idProperty : 'taxcbc_code',
    //         valueField: 'taxcbc_code',
    //         displayField: 'taxcbc_code',
    //         listeners : {
    //             select : function(component, record, index){
    //                 Client.Payment.PaymentOrderEdit.edtBudgetKbk.setValue(record.get("taxcbc_code"));
    //             },
    //             change : function(component, newValue, oldValue) {
    //                 Client.Payment.PaymentOrderEdit.edtBudgetKbk.setValue(newValue);
    //             }
    //         }
    //     }
    // );

    // this.budgetOkatoSearch = new TWAutocompleteWrapper(edtBudgetOkato.id, {
    //         listAlign : "br-tr",
    //         minChars : 0,
    //         isTable : true,
    //         pageSize : 10,
    //         dsCallService : "[dictionariesws]",
    //         dsCallMethod : "findokato",
    //         dsCallQueryMapping : function(query, defaultDsCallParams) {
    //             var params = getNewMap();//[].concat(defaultDsCallParams);
    //             var defaultKeySet = defaultDsCallParams.keySet();
    //             for (var i = 0; i < defaultKeySet.size(); i++){
    //                 params.put(defaultKeySet.get(i), defaultDsCallParams.get(defaultKeySet.get(i)));
    //             }
    //             params.put("keyword", query);
    //             return params;
    //         },
    //         columns : [
    //             {field : 'taxokato_code', title : 'ОКАТО', width : 100},
    //             {field : 'description', title : 'Описание', width : 400}
    //         ],
    //         idProperty : 'taxokato_code',
    //         valueField: 'taxokato_code',
    //         displayField: 'taxokato_code',
    //         listeners : {
    //             select : function(component, record, index){
    //                 Client.Payment.PaymentOrderEdit.edtBudgetOkato.setValue(record.get("taxokato_code"));
    //             },
    //             change : function(component, newValue, oldValue) {
    //                 Client.Payment.PaymentOrderEdit.edtBudgetOkato.setValue(newValue);
    //             }
    //         }
    //     }
    // );
//</editor-fold>
};


Client.Payment.PaymentOrderEdit.onShow = function () {
    this.docMode = getInputParam("docMode");
    this.userContext = JSON.parse(getInputParam('userContextJSON'));
    this.initWrappers();
    this.initDSCallers();
    this.initLookups();
    this.createPanelHierarchy();
    this.applyInputParams();
    this.getNonResidentAccountList();
    this.buildSumInWords();
    this.incPaymentSumOn(0);
    this.pnlPaymentOrder.addClass("border");
    this.pnlSubscribers.addClass("border");
    this.edtRecipientAccountNumber.setValue(AccountUtils.maskAccount(this.edtRecipientAccountNumber.getText()));
   
    //FIXME: fx7, waiting for Diasoft
    // gbi("frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.edtRecipientAccountNumber").onkeyup = accountControl_OnKeyUp;
    
    //FIXME: fx7
    // для IE изменение значения
    // gbi(memRecipientNameValue.id).onkeypress = memRecipientName_OnKey;
    // gbi(memRecipientNameValue.id).onkeyup = memRecipientName_OnKey;
    // gbi(memRecipientNameValue.id).onkeydown = memRecipientName_OnKey;
    
    // Всегда скрываем панель с банком плательщика
    this.payerBankExpander.collapsePanel();
    //устанавливаем tabIndex на стрелки imgPayerBankShow imgPayerBankHide 
    //imgAdditionalInfoShow imgAdditionalInfoHide imgBudgetDetailsShow imgBudgetDetailsSHide
    // FIXME: fx7 tabIndex
    // this.imgPayerBankShow.setTabIndex("110");
    // this.imgPayerBankHide.setTabIndex("115");    
    // this.imgAdditionalInfoShow.setTabIndex("220");
    // this.imgAdditionalInfoHide.setTabIndex("225");    
    // this.imgBudgetDetailsShow.setTabIndex("253");
    // this.imgBudgetDetailsHide.setTabIndex("256");
    // this.lblPayerSelect.setTabIndex("55");
    // this.lblTemplateTitle.setTabIndex("35");
    // this.lblRecipientSelect.setTabIndex("117");
    // this.lblRecipientBankTitle.setTabIndex("165");

    //устанавливаем поддержку горячих клавиш для imgPayerBankShow imgPayerBankHide imgAdditionalInfoShow imgAdditionalInfoHide imgBudgetDetailsShow imgBudgetDetailsSHide
    /*attachKeyPressEvent(imgPayerBankShow, imgPayerBankHide, function(){payerBankExpander.expandPanel(); document.getElementById("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.imgPayerBankHide.parent").className="";document.getElementById("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.imgPayerBankHide.parent").removeAttribute("disabled")}, ENTER_KEY_CODE);
    attachKeyPressEvent(imgPayerBankHide, imgPayerBankShow, function(){payerBankExpander.collapsePanel()}, ENTER_KEY_CODE);
//  imgPayerBankHide.getElement().attachEvent("onkeypress", function(){payerBankExpander.expandPanel()});
    attachKeyPressEvent(imgBudgetDetailsShow, imgBudgetDetailsHide, function(){budgetDetailsExpander.expandPanel()}, ENTER_KEY_CODE);
    attachKeyPressEvent(imgBudgetDetailsHide, imgBudgetDetailsShow, function(){budgetDetailsExpander.collapsePanel()}, ENTER_KEY_CODE);
    attachKeyPressEvent(imgAdditionalInfoShow, imgAdditionalInfoHide, function(){additionalInfoExpander.expandPanel()}, ENTER_KEY_CODE);
    attachKeyPressEvent(imgAdditionalInfoHide, imgAdditionalInfoShow, function(){additionalInfoExpander.collapsePanel()}, ENTER_KEY_CODE);
    attachKeyPressEvent(lblPayerSelect, lblPayerSelect, function(){showPayerSelectLookup()}, ENTER_KEY_CODE);
    attachKeyPressEvent(lblTemplateTitle, lblTemplateTitle, function(){showTemplateSelectLookup()}, ENTER_KEY_CODE);
    attachKeyPressEvent(lblRecipientSelect, lblRecipientSelect, function(){showRecipientSelectLookup()}, ENTER_KEY_CODE);
    attachKeyPressEvent(lblRecipientBankTitle, lblRecipientBankTitle, function(){showRecipientBankBicSelectLookup()}, ENTER_KEY_CODE);
*/
    //устанавливаем TabIndex для edtRecipientTin и edtRecipientBankBiс  
    //edtRecepientTinContainer.getElement().firstChild.tabIndex = edtRecipientTin.getElement().tabIndex+1;
    // this.edtRecepientTinContainer.getElement().firstChild.firstChild.tabIndex = edtRecipientTin.getElement().tabIndex+2;
    //edtRecipientBankBicContainer.getElement().firstChild.tabIndex = edtRecipientBankBic.getElement().tabIndex+1;
    // this.edtRecipientBankBicContainer.getElement().firstChild.firstChild.tabIndex = edtRecipientBankBic.getElement().tabIndex+2;
    // this.edtBudgetKbkContainer.getElement().firstChild.firstChild.tabIndex = edtBudgetKbk.getElement().tabIndex+2;
    // this.edtBudgetOkatoContainer.getElement().firstChild.firstChild.tabIndex = edtBudgetOkato.getElement().tabIndex+2;    
    
    // Скрываем панель с дополнительной информацией, если пустая
    if (this.memPaymentAdditionalInfo.getValue()) {
        this.additionalInfoExpander.collapsePanel();
    }
    // Скрываем панель с бюджетным платежем, если поля не заполнены, иначе отмечаем признак бюджетного платежа
    if (//chbBudgetPaymentFlag.isChecked() ||
        this.edtBudgetStatusValue.getText().length > 0 ||
            this.edtBudgetBase.getText().length > 0 ||
            this.edtBudgetDocNum.getText().length > 0 ||
            this.edtBudgetKbk.getText().length > 0 ||
            this.edtBudgetPeriodPrefix.getText().length > 0 ||
            this.edtBudgetPeriod.getText().length > 0 ||
            // edtBudgetDocDate.getText().length > 0 || Dmitry Fedorenko невозможно отличить ситуацию когда 0 и когда это просто не бюджетный платеж
            // в applyInputParams(); поэтому оно может быть 0
            this.edtBudgetOkato.getText().length > 0 ||
            this.edtBudgetPaymentType.getText().length > 0) {
        this.chbBudgetPaymentFlag.check();
    } else {
        this.budgetDetailsExpander.collapsePanel();
        this.chbBudgetPaymentFlag.unCheck();
        this.edtBudgetDocDate.setValue("");
    }

    this.initialiseChargeNds();

    if (this.docMode == 'edit' || this.docMode == 'copy') {
        this.lblPrintLink.show();
        this.initialiseChargeNds();
    }

    if (this.docMode == 'edit') {
        this.lblFormName.setValue(this.FORM_NAME_EDIT);
        this.lblMainHeader.setValue(this.FORM_MAIN_HEADER);
        this.checkBudgetPeriodFormat();
    }
    if(((this.docMode == 'edit' || this.docMode == 'create' || this.docMode == 'copy')) &&  
        (getInputParams("payRegStatus") === null)){
        // Регистрируем перехват перехода с формы
        WNavigationManager.setNavigationInterceptor(function(){
            if(this.isFormChanged && !this.isPrintForm) {
                WMessageManager.showConfirm({
                    message:"Платежный документ был изменен. Вы действительно хотите покинуть страницу, не сохраняя изменений?",
                    buttons: [
                        {
                            label : "Да",
                            onClick : "continueNavigation()"
                        },
                        {
                            label : "Нет",
                            onClick : "continueEditing()"
                        }
                    ]
                });
                return false;
            } else {
                return true;
            }
        });
        this.getMinSum();
    }

    this.isOnChangeEnabled = true;

    this.getMultiButtonOptions(getInputParam("clientId"));
    this.getLastUsedTemplates();
    this.mlbMore.setText('Ещё');
    this.checkRegistryViewPermission();
    //FIXME: fx7
    // addEvent(document.getElementById('ext-comp-1007'), 'keyup', function(){checkCountSymbols(gbi('ext-comp-1007'), 12);
    //     checkIntNumberValue(document.getElementById('ext-comp-1007'), oldRecipientInn)});
    // addEvent(document.getElementById('ext-comp-1007'), 'keydown', function(){var value = document.getElementById('ext-comp-1007').value;
    //     if(checkInt(value)){oldRecipientInn = value}});
    // addEvent(document.getElementById('ext-comp-1008'), 'keyup', function(){checkCountSymbols(gbi('ext-comp-1008'), 9);
    //     checkIntNumberValue(document.getElementById('ext-comp-1008'), oldRecipientBic)});
    // addEvent(document.getElementById('ext-comp-1008'), 'keydown', function(){var value = document.getElementById('ext-comp-1008').value;
    //     if(checkInt(value)) {oldRecipientBic = value}});
    // addEvent(edtBudgetPeriod.getElement(), 'keyup',function(){checkFloatNumberValue(edtBudgetPeriod.getElement(), oldPeriod)});
    // addEvent(edtBudgetPeriod.getElement(),'keydown', function(){oldPeriod = edtBudgetPeriod.getElement().value});
    // gbi("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetPeriod").onblur = function(){}
};

Client.Payment.PaymentOrderEdit.addEvent = function (elem, type, handler){
    throw 'evil method "addEvent", deprecated';
  /*  if (elem.addEventListener){
        elem.addEventListener(type, handler, false)
    } else {
        elem.attachEvent("on"+type, handler)
    }*/
};

Client.Payment.PaymentOrderEdit.checkIntNumberValue = function (element, oldValue){
    var numReg = /^([0-9]\d*$)/;
    var value = element.value;
    if(value.length > 0 && !numReg.test(value)){
        element.value = oldValue;
    }
};

Client.Payment.PaymentOrderEdit.checkInt = function (value){
    var numReg = /^([0-9]\d*$)/;
    if(numReg.test(value)){
        return true;
    }
    return false;
};

Client.Payment.PaymentOrderEdit.checkFloatNumberValue = function (element, oldValue){
    var numReg = /^([0-9\.]*$)/;
    var value = element.value;
    if(value.length > 0 && !numReg.test(value)){
        element.value = oldValue;
    }
};

Client.Payment.PaymentOrderEdit.checkCountSymbols = function (element, countSymbols){
    var value = element.value;
    if(value.length > countSymbols){
        element.value = element.value.substr(0, countSymbols);
    }
};


Client.Payment.PaymentOrderEdit.onChangeForm = function () {
    WMessageManager.hideConfirm();
    if (this.isLoadCompleted) {
        this.isFormChanged = true;
    }
};

/**
 * Функция заполняет информацию о клиенте
 * @param id Идентификатор клиента в АЛБО
 */
Client.Payment.PaymentOrderEdit.setPayerInfoById = function (id) {
    var params = getNewMap();
    params.put("id", id);
    this.serviceGetClientPinEqById.call(params, function(inArr) {
        Client.Payment.PaymentOrderEdit.edtPayerSelectId.setValue(id);
        Client.Payment.PaymentOrderEdit.edtPayerSelectName.setValue(inArr.get('Result'));
        Client.Payment.PaymentOrderEdit.setPayerInfo();
    }, true);
};

Client.Payment.PaymentOrderEdit.applyInputParams = function () {
    if (this.docMode == 'create') {
        this.isPrintForm = getInputParam("isPrintForm");
        if (!this.isPrintForm) {
            // Очищаем форму если не было возврата с формы просмотра печати
            this.cleanForm();
        } else {
            this.isFormChanged = true;
            this.isPrintForm = false;
        }
    }
    this.selectedPaymentType = getInputParam("paymentType");
    this.businessDate = getInputParam("businessDate");
    var taxPeriod = getInputParam("taxPeriod");
    var paymentDate = getInputParam("paymentDate");
    var processDate = getInputParam("startProcessingDate");
    var budgetDocDate = getInputParam("budgetDocDate");
    var clientId = getInputParam("clientId");
    var receiverBankBIK = getInputParam("receiverBankBIK");
    if (paymentDate) {
        this.clnPaymentDateValue.setDate(paymentDate);
    } else if (this.businessDate) {
        this.clnPaymentDateValue.setDate(this.businessDate);
    }
    if (processDate) {
        this.clnProcessDateValue.setDate(processDate);
    }

    if (typeof(clientId) == "number") {
        this.setPayerInfoById(clientId);
        this.setClientUrgencyFlag();
    } else {
        if (this.docMode == 'create') {
            var caller = new DSCaller("[linkadminws]", "getuserclientsforpayment", "", false);
            caller.call(getNewMap(), function (response) {
                if (response.get('Result').size() == 1) {
                    var listItem = response.get('Result').get(0);
                    if (listItem.get('id')) {
                        Client.Payment.PaymentOrderEdit.setValidClientId(listItem.get('id'));
                    }
                    if (listItem.get('pinEq')) {
                        Client.Payment.PaymentOrderEdit.edtPayerSelectName.setValue(listItem.get('pinEq'));
                    }
                    Client.Payment.PaymentOrderEdit.setPayerInfo();
                } else {
                    Client.Payment.PaymentOrderEdit.getUserAccounts();
                }
            }, true);
        }
    }
    if (taxPeriod) {
        this.setTaxPeriodValue(taxPeriod);
    }
    // Подтягиваем информацию по банку получателя
    if (receiverBankBIK) {
        this.getRecipientBankFields(receiverBankBIK);
    }
    // Если хотяб одно поле бюджетного платежа заполненно то проставляем 0 в дату если она пустая)
    if ((this.edtBudgetStatusValue.getText().length > 0 ||
        this.edtBudgetBase.getText().length > 0 ||
        this.edtBudgetDocNum.getText().length > 0 ||
        this.edtBudgetKbk.getText().length > 0 ||
        this.edtBudgetPeriodPrefix.getText().length > 0 ||
        this.edtBudgetPeriod.getText().length > 0 ||
        this.edtBudgetOkato.getText().length > 0 ||
        this.edtBudgetPaymentType.getText().length > 0)&&
        this.edtBudgetDocDate.getText().length === 0) {
        // Обход 0 в поле типа дата в базе(для бюджетного лпатежа)
        if (budgetDocDate && budgetDocDate !== 0) {
            this.edtBudgetDocDate.setValue(budgetDocDate.format(this.DATE_FORMAT));
        }else if(budgetDocDate === null || budgetDocDate === 0){
            this.edtBudgetDocDate.setValue("0");
        }
    } else {
        // ничего не заполняем.
    }
};

Client.Payment.PaymentOrderEdit.getLastUsedTemplates = function () {
    this.cmbTemplateSelect.addOption(this.SHOW_ALL_TEMPLATES_NAME, this.SHOW_ALL_TEMPLATES_ID);
    var caller = new DSCaller("[paymentws]", "getlastusedtemplates", "", false);
    var me = this;
    caller.call(getNewMap(), function (response) {
        var templates = response.get('Result');
        if(templates && templates.size() > 0) {
            for(var i = 0; i < templates.size(); i++) {
                var listItem = templates.get(i);
                me.addOption(listItem.get('templateName'), listItem.get('id'));
            }
        }
    }, true);
};

/**
 * Осужествляем переход по последней предванной ссылке
 */
Client.Payment.PaymentOrderEdit.continueNavigation = function () {
    WNavigationManager.goToLast();
};

/**
 * Продолжаем редактирование формы, скрываем сообщение.
 */
Client.Payment.PaymentOrderEdit.continueEditing = function () {
    WMessageManager.hideConfirm();
};

Client.Payment.PaymentOrderEdit.getUserAccounts = function () {
    var params = getNewMap();
    params.put('accTypeFiltration', true);
    this.serviceGetUserAccList.call(params, function(inArr) {
        Client.Payment.PaymentOrderEdit.setUserAccounts(inArr);
    }, true);
};

Client.Payment.PaymentOrderEdit.setUserAccounts = function (inArr) {
    this.cmbPayerAccountNumber.clear();
    this.cmbPayerAccountNumber.addOption('', '');
    var result = inArr.get('Result');
    for (var i = 0; i < result.size(); i++) {
        var account = result.get(i);
        var accNum = account.get('accountNumber');
        var clientName = account.get('accountOwner');
        this.cmbPayerAccountNumber.addOption(AccountUtils.maskAccount(accNum) + " " + clientName, accNum);
        this.clientByAcc[accNum] = { pinEq: account.get('pinEq'), clientId: account.get('clientId') };
    }
    this.isLoadCompleted = true;
    // Установка предыдущего плательщика в случае выбора опции "сохранить и создать новый"
    if (this.docMode == 'create' && getInputParam('senderAccount')) {
        this.cmbPayerAccountNumber.selectByValue(getInputParam('senderAccount'));
    }
    else
    {//выбираем первый счет из списка        
        if (result.size() > 0){
            this.cmbPayerAccountNumber.selectByIndex(1);
        }
    }
};

/**
 * Получает идентификатор клиента в EQ
 * @param id идентификатор клиента в АЛБО
 */
Client.Payment.PaymentOrderEdit.getClientPinEq = function (id) {
    var params = getNewMap();
    params.put('id', id);
    this.serviceGetClientInfoById.call(params, function(inArr) {
        var pinEq = inArr.get('extId');
        Client.Payment.PaymentOrderEdit.populateClientPinEq(pinEq);
    });
};

/**
 * Устанавливает на форме pinEq
 * @param pinEq
 */
Client.Payment.PaymentOrderEdit.populateClientPinEq = function (pinEq) {
    this.edtPayerSelectName.setValue(pinEq);
};

/**
 * Устанавливает чекбокс "отправить текущим днем"
 */
Client.Payment.PaymentOrderEdit.setClientUrgencyFlag = function () {
    if ("1001" == getInputParam("urgency")) {
        this.chbSendToday.check();
        this.lblSendTodayWarning.show();
        this.clnProcessDateValue.disable();
        //clnProcessDateValue.setValue(clnPaymentDateValue.getValue());
    }
};

/**
 * Устанавливает струкутру вложенности панелей для получения возможности сворачивать и разворачивать их
 */
Client.Payment.PaymentOrderEdit.createPanelHierarchy = function () {
    this.frmPaymentOrderEdit.addChildrenPanels([this.pnlTopMenu, this.pnlPaymentOrder, this.pnlSubscribers, this.pnlBottomButtons2]);
    this.pnlPaymentOrder.addChildrenPanels([this.pnlGeneralInfo, this.pnlPayerInfo, this.pnlRecipientInfo, this.pnlPaymentPurposeInfo]);
    this.pnlPayerInfo.addChildPanel(this.pnlPayerBankInfo);
    this.pnlPaymentPurposeInfo.addChildrenPanels([this.pnlPaymentAdditionalInfo, this.pnlBudgetDetailsControl, this.pnlBudgetDetailsBlock]);
};

Client.Payment.PaymentOrderEdit.preProcess = function () {
    this.isOnChangeEnabled = false;
};

/**
 * Устанавливает пришедшие на форму значения счета и КПП плательщика
 */
Client.Payment.PaymentOrderEdit.setSelectedPayerFields = function () {
    if ((this.docMode == 'create' || this.docMode == 'edit' || this.docMode == 'copy') && !this.isLoadCompleted ) {
        this._disableOnChange(function() {
            var selectedPayerAccount = getInputParam('senderAccount');
            var selectedSenderKPP = getInputParam('senderKPP');
            if (selectedPayerAccount) {
                this.cmbPayerAccountNumber.selectByValue(selectedPayerAccount);
            }
            if (selectedSenderKPP) {
                this.cmbPayerKppValue.selectByValue(selectedSenderKPP);
            }
        });
    }
};

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Общая информация о платеже (Шаблоны, даты и проч.)
 */

/**
 * Расчет типа платежа.
 */
Client.Payment.PaymentOrderEdit.calculatePaymentType = function () {
    var payerBic = this.lblPayerBankBicValue.getValue();
    var recipientBic = this.edtRecipientBankBic.getText();
    if (payerBic && recipientBic) {
        this.paymentTypeCase = this.calculatePaymentTypeCase(payerBic, recipientBic, this.recipientBankEr1);
        this.edtPaymentKindValue.setValue('');
        var params = getNewMap();
        this.serviceGetPaymentTypeList.call(params, function(inArr) {
            var paymentTypesList = inArr.get('Result');
            this.populatePaymentType(paymentTypesList, paymentTypeCase);
        });
    } else {
        this.isLoadCompleted = true;
    }
};

Client.Payment.PaymentOrderEdit.calculatePaymentTypeCase = function (payerBic, recipientBic, er1) {
    var payerBicFirst4 = payerBic.substring(0, 4);
    var recipientBicFirst4 = recipientBic.substring(0, 4);
    var paymentTypeCase = '';
    // FE-2
    var regionsEquals = payerBic.length >= 4 && recipientBic.length >= 4 && payerBicFirst4 == recipientBicFirst4;
    if (!regionsEquals) {
        regionsEquals = (payerBicFirst4 == "0445" || payerBicFirst4 == "0446") && (recipientBicFirst4 == "0446" || recipientBicFirst4 == "0445");
    }
    // FE-3 = !FE-2
    if (payerBic == recipientBic) {
        // FE-5 в поле «Вид платежа» должно отображаться только «пусто».
        // Поле «Вид платежа» не доступно для редактирования.
        paymentTypeCase = 'FE5';
    } else  if (regionsEquals) {
        if ([2, 3, 4].indexOf(er1) != -1) {
            // FE-7 в поле "Вид платежа" должно отображаться только "пусто".
            // Поле "Вид платежа" не доступно для редактирования.
            paymentTypeCase = 'FE7';
        } else {
            // FE-8 в поле "Вид платежа" должна быть предоставлена возможность выбора из выпадающего списка значения "Почтой" или "Телеграфом".
            // По умолчанию поле "Вид платежа" должно быть заполнено значением "Почтой".
            paymentTypeCase = 'FE8';
        }
    } else {
        if ([1, 3, 4].indexOf(er1) != -1) {
            // FE-9 в поле "Вид платежа" должно отображаться только "Электронно".
            // Поле "Вид платежа" не доступно для редактирования.
            paymentTypeCase = 'FE9';
        } else {
            // FE-10 в поле "Вид платежа" должна быть предоставлена возможность выбора из выпадающего списка значения "Почтой" или "Телеграфом".
            // По умолчанию поле "Вид платежа" должно быть заполнено значением "Почтой".
            paymentTypeCase = 'FE10';
        }
    }
    return paymentTypeCase;
};

Client.Payment.PaymentOrderEdit.populatePaymentType = function (paymentTypes, paymentTypeCase) {
    var allowedPaymentTypes = [];
    switch (paymentTypeCase) {
        case 'FE5':
        case 'FE7':
            //должно отображаться только "пусто"
            break;
        case 'FE9':
            allowedPaymentTypes = ['00'];
            break;
        case 'FE8':
        case 'FE10':
            allowedPaymentTypes = ['01', '02'];
            break;
    }
    this.cmbPaymentKindChoose.clear();
    for (var i = 0; i < paymentTypes.size(); i++) {
        var paymentType = paymentTypes.get(i);
        var paymentCode = paymentType.get('code');
        var paymentDescription = paymentType.get('description');
        if (allowedPaymentTypes.indexOf(paymentCode) != -1) {
            this.cmbPaymentKindChoose.addOption(paymentDescription, paymentCode);
        }
    }

    if(allowedPaymentTypes.length > 0) {
        this.edtPaymentKindValue.setValue(cmbPaymentKindChoose.getSelectedText());
        if (allowedPaymentTypes.length > 1) {
            this.pnlPaymentKindChoose.show();
            // установка выбранного значения типа платежа
            if(selectedPaymentType) {
                this.cmbPaymentKindChoose.selectByValue(selectedPaymentType);
            }
        } else {
            this.pnlPaymentKindChoose.hide();
        }
    } else {
        this.pnlPaymentKindChoose.hide();
        this.edtPaymentKindValue.setValue("");
    }
    this.isLoadCompleted = true;
};

/**
 * Функция получет номер следующего платежного документа для указанного клиента.
 * @param clientId идентификатор клиента (АЛБО)
 */
Client.Payment.PaymentOrderEdit.getPaymentNextNumber = function (clientId) {
    var params = getNewMap();
    params.put('clientId', clientId);
//    params.put('clientId', edtPayerSelectId.getValue());
    this.serviceGetPaymentNextNumber.call(params, function(inArr) {
        var nextPaymentNumber = inArr.get('Result').toString();
        Client.Payment.PaymentOrderEdit.populatePaymentNextNumber(nextPaymentNumber);
    }, true);
};

/**
 * Функция получаем номер документа для указанных ID платежа и клиента
 * Если по указанным критериям номер документа не найден, то вызываем getPaymentNextNumber
 * @param paymentId
 * @param clientId
 */
Client.Payment.PaymentOrderEdit.getDocNumberForIdAndClient = function (paymentId, clientId) {
    var params = getNewMap();
    params.put('paymentId', paymentId);
    params.put('clientId', clientId);
    this.serviceGetDocNumberForIdAndClient.call(params, function(inArr) {
        var result = inArr.get('Result');
        if (result) {
           Client.Payment.PaymentOrderEdit.populatePaymentNextNumber(result.toString());
        } else {
           Client.Payment.PaymentOrderEdit.getPaymentNextNumber(clientId);
        }
    }, true);
};

/**
 * Функция проставляет на форме указанный номер платежного документа
 * @param nextPaymentNumber номер платежного документа
 */
Client.Payment.PaymentOrderEdit.populatePaymentNextNumber = function (nextPaymentNumber) {
    this.edtPaymentNumber.setValue(nextPaymentNumber);
};

// Переключение флага "отправить текущим днем"
Client.Payment.PaymentOrderEdit.onChangeSendTodayFlag = function () {
    if (this.chbSendToday.isChecked()) {
        this.lblSendTodayWarning.setValue('');
        this.lblSendTodayWarning.show();
        this.clnProcessDateValue.disable();
        this.clnProcessDateValue.setValue('');
        this.getCotUserMessage();
    } else {
        this.lblSendTodayWarning.hide();
        this.clnProcessDateValue.enable();
        this.clnProcessDateValue.setValue('');
    }
};

Client.Payment.PaymentOrderEdit.getCotUserMessage = function () {
    var params = getNewMap();
    params.put("id", 0);
    params.put("departmentCode", departmentCode);
    this.serviceGetClientCotByBranch.call(params, function(inArr) {
        if (inArr.get('cotUserMessage')) {
            Client.Payment.PaymentOrderEdit.lblSendTodayWarning.setValue(inArr.get('cotUserMessage').trim());
        }
    });
};

Client.Payment.PaymentOrderEdit.showTemplateSelectLookup = function () {
    // WHelper.mask();
    var payRegisterID = getInputParams("payRegisterID");
    if ((payRegisterID != null) && (payRegisterID != "")){
        var params = getNewMap();
        params.put('clientId', getInputParams("clientId"));
        Lookup.showLookup(this.elkTemplateSelect.id, 'client/payment/selectTemplate', 'Выбор шаблона',
            650, 370, this.onTemplateSelected, params);
    } else {
        Lookup.showLookup(this.elkTemplateSelect.id, 'client/payment/selectTemplate', 'Выбор шаблона',
         650, 370, this.onTemplateSelected);
    }
};

Client.Payment.PaymentOrderEdit.onTemplateSelected = function () {
    var templateId = getInputParam("KEY");
    var templateName = getInputParam("VALUE");
    var state = getInputParam("LOOKUP_RESULT");
    if (state === "OK" && templateName) {
        this._disableOnChange(function(){
            this.edtTemplateSelect.setValue(templateName);
        });
        var params = getNewMap();
        params.put('id', templateId);
        this.serviceGetPaymentTemplateByIdjs.call(params, function(response) {
            this.setFieldsFromTemplate(response);
        }, true);
    }
};

Client.Payment.PaymentOrderEdit.buildSumInWords = function () {
    var sumValue = this.edtPaymentAmountValue.getValue();
    if (sumValue) {
        var sum = parseFloat(sumValue);
        if (sum > 0) {
            var words = Common.sumInWords(sum); // TODO: add italic CSS class
            this.lblAmountInWordsValue.setValue(words);
        } else {
            this.lblAmountInWordsValue.setValue('');
        }
    } else {
        this.lblAmountInWordsValue.setValue('');
    }
};

Client.Payment.PaymentOrderEdit.showCustomLookup(lookup, keyword, hide, params){
    Lookup.showLookup(lookup.pageflow, lookup.title, lookup.width,
        lookup.height, lookup.callback, keyword, hide, params);
}
/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Информация о плательщике
 */

Client.Payment.PaymentOrderEdit.showPayerSelectLookup = function () {
    this.showCustomLookup(this.clientLookup);
};

Client.Payment.PaymentOrderEdit.onPayerSelected = function () {
    var state = getInputParam("LOOKUP_RESULT");
    if (state == "OK"){
        var id = getInputParam("KEY")*1;
        var name = getInputParam("VALUE");

        if (id) {
            this.edtPayerSelectId.setValue(id);
        }

        if (name) {
            this.edtPayerSelectName.setValue(name);
        }
        this.selectedPayerAccountNumber = null;
        this.setPayerInfo();
    }
};

Client.Payment.PaymentOrderEdit.setPayerInfo = function () {
    var clientPinEq = this.edtPayerSelectName.getValue();
    var clientId = this.edtPayerSelectId.getValue();
    if (clientPinEq) {
        if (this.isLoadCompleted || this.docMode == 'create' || this.docMode == 'copy') {
            if (this.docMode == 'edit') {
                // Для режима редактирования ПП запрашиваем номер документа для текущего ID и клиента
                var paymentId = getInputParam("paymentId");
                this.getDocNumberForIdAndClient(paymentId, clientId);
            } else {
                // запрашиваем следующий доступный номер документа
                this.getPaymentNextNumber(clientId);
            }
        }
        this.getClientBaseInfo(clientPinEq);
        this.getClientAccounts(clientPinEq);
    }
    this.checkSignPermission(clientId);
    this.getMultiButtonOptions(clientId);
};

Client.Payment.PaymentOrderEdit.onChangeClientAccount = function () {
    if (this.isOnChangeEnabled) {
        if (!this.edtPayerSelectName.getValue()) {
            this.setValidClientId(this.clientByAcc[cmbPayerAccountNumber.getSelectedValue()].clientId);
            this.edtPayerSelectName.setValue(this.clientByAcc[this.cmbPayerAccountNumber.getSelectedValue()].pinEq);
            this.onPayerSelected();
        }
        this.cmbPayerAccountNumber.hide();
        this.selectedPayerAccountNumber = this.cmbPayerAccountNumber.getSelectedValue();
        var pinEq = this.edtPayerSelectName.getValue();
        if (this.selectedPayerAccountNumber) {
            this.getPayerAccountBaseInfo(this.selectedPayerAccountNumber, pinEq);
            this.checkAccountToNonResAccGroup();
        }
        this.cmbPayerAccountNumber.show();
    }
};

// DSCall - вызовы

/**
 * Функция получает информацию о клиенте из EQ
 * @param clientPinEq идентификатор клиента в EQ (pin)
 */
Client.Payment.PaymentOrderEdit.getClientBaseInfo = function (clientPinEq) {
    var params = getNewMap();
    params.put("id", 0);
    params.put("pinEq", clientPinEq);
    this.serviceGetClientBaseInfo.call(params, function(inArr) {
        var inn = "";
        var kpp = "";
        var kpp2 = "";
        var name = "";
        if (inArr.get('inn')) {
            inn = inArr.get('inn').trim();
        }
        if (inArr.get('kpp')) {
            kpp = inArr.get('kpp').trim();
        }
        if (inArr.get('kpp2')) {
            kpp2 = inArr.get('kpp2').trim();
        }

        if (inArr.get('clientFullName')) {
            name = inArr.get('clientFullName').trim();
        }
        Client.Payment.PaymentOrderEdit.populateClientBaseInfo(inn, kpp, kpp2, name);
    }, true);
};

/**
 * Заполняет информацию о клиенте
 * @param inn ИНН
 * @param kpp КПП
 * @param kpp2 КПП
 * @param name Наименование клиента
 */
Client.Payment.PaymentOrderEdit.populateClientBaseInfo = function (inn, kpp, kpp2, name) {
    this.lblPayerTinValue.setValue(inn);
    this.payerName = name;
    this.lblPayerNameValue.setValue(name);
    this.cmbPayerKppValue.clear();
    this.cmbPayerKppValue.addEmptyOption();
    if (kpp) {
        this.cmbPayerKppValue.addOption(kpp, kpp);
    }
    if (kpp2) {
        this.cmbPayerKppValue.addOption(kpp2, kpp2);
    }
    this.addZeroKpp();
};

Client.Payment.PaymentOrderEdit.onKppChanged = function () {
    this.addZeroKpp();
};

/**
 * Добавление нулевого КПП в зависимости от состояния чекбокса "Бюджетный платеж"
 */
Client.Payment.PaymentOrderEdit.addZeroKpp = function () {
    var zeroKppOption = {
        text: "0",
        value: "0"
    };
    if (this.chbBudgetPaymentFlag.isChecked() && !this.cmbPayerKppValue.contains(zeroKppOption)) {
        var resetValue = this.cmbPayerKppValue.getOptions().length == 0;
        this.cmbPayerKppValue.addOption("0", "0");
        if (resetValue) {
            this.cmbPayerKppValue.setValue("");
        }
    } else if (!this.chbBudgetPaymentFlag.isChecked() && this.cmbPayerKppValue.contains(zeroKppOption)) {
        this.cmbPayerKppValue.removeOption(zeroKppOption);
    }
};

/**
 * Функция получает счета клиента из EQ
 * @param clientPinEq идентификатор клиента в EQ (pin)
 */
Client.Payment.PaymentOrderEdit.getClientAccounts = function (clientPinEq) {
    var params = getNewMap();
    params.put('pinEq', clientPinEq);
    params.put('accTypeFiltration', true);
    params.put('FiltrationCurrency', 'RUR');
    this.serviceGetClientAccList.call(params, function(inArr) {
        var accountsList = inArr.get('Result');
        Client.Payment.PaymentOrderEdit.populateClientAccounts(accountsList);
    }, true);
};

/**
 * Функция заполняет счета клиента
 * @param accountsList список счетов клиента
 */
Client.Payment.PaymentOrderEdit.populateClientAccounts = function (accountsList) {
    this.cmbPayerAccountNumber.clear();
    if (accountsList)
        for (var i = 0; i < accountsList.size(); i++) {
            var acc = accountsList.get(i).get('accountNumber');
            this.cmbPayerAccountNumber.addOption(AccountUtils.maskAccount(acc), acc);
        }
    this.setSelectedPayerFields();

    if (this.selectedPayerAccountNumber) {
        this._disableOnChange(function() {
            this.cmbPayerAccountNumber.selectByValue(this.selectedPayerAccountNumber);
        });
    }
    if (this.docMode == 'create') {
        this.isLoadCompleted = true;
    }
    this.onChangeClientAccount();
};

/**
 * Возвращает информацию о счете клиента
 * @param accountNumber номер счета
 * @param pinEq идентификатор клиента в EQ (pin)
 */
Client.Payment.PaymentOrderEdit.getPayerAccountBaseInfo = function (accountNumber, pinEq) {
    var params = getNewMap();
    params.put('accountNumber', accountNumber);
    params.put('pinEq', pinEq);
    this.serviceGetAccountBaseInfo.call(params, function(inArr) {
        var availableAmount = inArr.get('availableAmount') * 1;
        var bic = inArr.get('departmentBic');
        Client.Payment.PaymentOrderEdit.departmentCode = inArr.get('departmentCode');
        Client.Payment.PaymentOrderEdit.populatePayerAccountBaseInfo(availableAmount, bic);
        if (Client.Payment.PaymentOrderEdit.chbSendToday.isChecked()) {
           Client.Payment.PaymentOrderEdit.getCotUserMessage();
        }
    }, true);
};

Client.Payment.PaymentOrderEdit.populatePayerAccountBaseInfo = function (availableAmount, bic) {
    if (availableAmount) {
        this.lblAvailableAmountValue.setValue(availableAmount);
    } else {
        this.lblAvailableAmountValue.setValue('0');
    }
    if (bic) {
        this.lblPayerBankBicValue.setValue(bic);
        this.getPayerBankFields(bic);
    }
    this.calculatePaymentType();
    this.checkSum();
};

Client.Payment.PaymentOrderEdit.getPayerBankFields = function (bic) {
    if (bic) {
        var params = getNewMap();
        params.put('bic', bic);
        this.serviceBicBrowseListByParam.call(params, function(inArr){
            var ksn = inArr.get('Result').get(0).get('ksn');
            var koName = inArr.get('Result').get(0).get('koName');
            var city = inArr.get('Result').get(0).get('city');
            this.populatePayerBankFields(ksn, koName, city);
        }, true);
    }
};

Client.Payment.PaymentOrderEdit.populatePayerBankFields = function (ksn, koName, city) {
    if (!ksn) {
        ksn = '00000000000000000000';
    }
    this.lblPayerBankCorAccountValue.setValue(AccountUtils.maskAccount(ksn));
    this.lblPayerBankNameValue.setValue(koName);
    if (!city) {
        this.lblPayerBankRegionValue.setValue('');
    } else {
        this.lblPayerBankRegionValue.setValue(city);
    }
};

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Информация о получателе
 */

Client.Payment.PaymentOrderEdit.onChangeRecipientBankBic = function () {
    if (this.isOnChangeEnabled) {
        this.checkRecepientAccountMatchBIC();
        this.getRecipientBankFields(this.edtRecipientBankBic.getValue());
    }
};

Client.Payment.PaymentOrderEdit.showRecipientSelectLookup = function () {
    // WHelper.mask();
    // showExtendedLookup(elkRecipientSelect.id, 650, 370, false, '');
    this.showCustomLookup(this.recipientLookup)
};

Client.Payment.PaymentOrderEdit.onRecipientSelected = function () {
    var cAgentId = getInputParam("KEY");
    var cAgentAccId = getInputParam("VALUE");
    if (cAgentId && cAgentAccId) {
        this.populateCagentInfo(cAgentId, cAgentAccId);
    }
};

Client.Payment.PaymentOrderEdit.populateCagentInfo = function (cAgentId, cAgentAccId) {
    this.getRecipientBaseInfo(cAgentId);
    this.getRecipientAccountInfo(cAgentAccId);
};

Client.Payment.PaymentOrderEdit.onRecipientKppSelected = function () {
    var recipientKpp = this.cmbRecipientKppSelect.getSelectedValue();
    if (recipientKpp) {
        this.edtRecipientKpp.setValue(recipientKpp);
    } else {
        this.edtRecipientKpp.setValue('');
    }
};

Client.Payment.PaymentOrderEdit.onRecipientBankSelected = function () {
    var name = getInputParam("VALUE");
    if (name) {
        var bic = name;
        this.edtRecipientBankBic.setValue(bic);
        this.cagentBicSearch.setValue(bic);
        //getRecipientBankFields(bic);
    }
};

// var recipientLookupKeyword; // TODO это еще нужно?
Client.Payment.PaymentOrderEdit.onRecipientFieldsEdited = function () {
    //recipientLookupKeyword
};

Client.Payment.PaymentOrderEdit.showRecipientBankBicSelectLookup = function () {
    // WHelper.mask();
    // showExtendedLookup(elkRecipientBankBicSelect.id, 680, 370, false);
    Lookup.showLookup(this.elkRecipientBankBicSelect.id, 'client/payment/selectBankBic', 'Выбор БИКа банка получателя',
     650, 370, function(){
        Client.Payment.PaymentOrderEdit.onRecipientBankSelected();
        Client.Payment.PaymentOrderEdit.onChangeForm();
    });
};

/**
 *
 * @param cAgentId
 */
Client.Payment.PaymentOrderEdit.getRecipientBaseInfo = function (cAgentId) {
    var params = getNewMap();
    var me = this;
    params.put("id", cAgentId);
    this.serviceGetCagentById.call(params, function(inArr) {
        var inn = "";
        var kpp = "";
        var kpp2 = "";
        var name = "";
        if (inArr.inn) {
            inn = inArr.get('inn').getText().trim();
        }
        if (inArr.kpp) {
            kpp = inArr.get('kpp').getText().trim();
        }
        if (inArr.kpp2) {
            kpp2 = inArr.get('kpp2').getText().trim();
        }

        if (inArr.name) {
            name = inArr.name.trim();
        }
        me._disableOnChange(function() {
            me.populateRecipientBaseInfo(inn, name, kpp, kpp2);
        });
    }, true);
};

Client.Payment.PaymentOrderEdit.populateRecipientBaseInfo = function (inn, name, kpp, kpp2) {
    this.edtRecipientTin.setValue(inn);
    this.cagentInnSearch.setValue(inn);
    this.memRecipientNameValue.setValue(name);
    this.edtRecipientKpp.setValue('');
    this.cmbRecipientKppSelect.show();
    this.cmbRecipientKppSelect.clear();
    this.cmbRecipientKppSelect.addOption('', '');
    if (kpp) {
        this.cmbRecipientKppSelect.addOption(kpp, kpp);
    }
    if (kpp2) {
        this.cmbRecipientKppSelect.addOption(kpp2, kpp2);
    }
};

/**
 *
 * @param cAgentAccId
 */
Client.Payment.PaymentOrderEdit.getRecipientAccountInfo = function (cAgentAccId) {
    var params = getNewMap();
    params.put("id", cAgentAccId);
    this.serviceGetCagentAccById.call(params, function(inArr) {
        var acc = inArr.get('acc');
        var bic = inArr.get('bic');
        Client.Payment.PaymentOrderEdit._disableOnChange(function() {
            Client.Payment.PaymentOrderEdit.populateRecipientAccountInfo(acc, bic);
        });
        Client.Payment.PaymentOrderEdit.getRecipientBankFields(bic);
    }, true);
};

Client.Payment.PaymentOrderEdit.populateRecipientAccountInfo = function (acc, bic) {
    if (acc) {
        this.edtRecipientAccountNumber.setValue(AccountUtils.maskAccount(acc));
    }
    if (bic) {
        this.cagentBicSearch.setValue(bic);
        this.edtRecipientBankBic.setValue(bic);
    }
};

/**
 *
 * @param bic
 */
Client.Payment.PaymentOrderEdit.getRecipientBankFields = function (bic) {
    if (bic.length < 9) {
        Client.Payment.PaymentOrderEdit._disableOnChange(function() {
            Client.Payment.PaymentOrderEdit.populateRecipientBankFields("", "", "", "");
        });
        Client.Payment.PaymentOrderEdit.wrnBic.show();
    } else {
        var me = this;
        var params = getNewMap();
        params.put('bic', bic);
        this.serviceBicBrowseListByParam.call(params, function(inArr){
            var recipientBankData = inArr.get('Result').get(0);
            if(recipientBankData) {
                var ksn = recipientBankData.get('ksn');
                var koName = recipientBankData.get('koName');
                var city = recipientBankData.get('city');
                var er1 = recipientBankData.get('er1');
                me._disableOnChange(function() {
                    me.populateRecipientBankFields(ksn, koName, city, er1);
                });
                me.wrnBic.hide();
                me.calculatePaymentType();
            } else {
                me._disableOnChange(function() {
                    me.populateRecipientBankFields("", "", "", "");
                });
                me.wrnBic.show();
            }
        }, true);
    }
};

Client.Payment.PaymentOrderEdit.populateRecipientBankFields = function (ksn, koName, city, er1) {
    this.recipientBankEr1 = er1;
    if (ksn === undefined) {
        ksn = '00000000000000000000';
    }
    this.lblRecipientBankCorAccountValue.setValue(AccountUtils.maskAccount(ksn));
    this.lblRecipientBankNameValue.setValue(koName);
    if (!city) {
        this.lblRecipientBankRegionValue.setValue('');
    } else {
        this.lblRecipientBankRegionValue.setValue(city);
    }
};

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Назначение платежа
 */
Client.Payment.PaymentOrderEdit.onChangeBudgetPaymentFlag = function () {
    var lastKppValue =  this.cmbPayerKppValue.getSelectedValue();
        if (this.chbBudgetPaymentFlag.isChecked()) {
            this.budgetDetailsExpander.expandPanel();
            this.lblKppMandatory.show();
            this.lblRecipientKppMandatory.show();
            // Установка очередности по-умолчанию для бюджетного платежа
            this.cmbPriorityValue.selectByValue(4);
        } else {
            this.budgetDetailsExpander.collapsePanel();
            this.clearBudgetFields();
            this.lblKppMandatory.hide();
            this.lblRecipientKppMandatory.hide();
            // Установка очередности по-умолчанию для небюджетного платежа
            this.cmbPriorityValue.selectByValue(6);
        }
    this.addZeroKpp();
    if(lastKppValue != '0') {
     this.cmbPayerKppValue.selectByValue(lastKppValue);
    }
};

/**
 * Переменная означающая тип основания бюджетного платежа -
 *    true, если таможенный платеж
 *    false в других случаях
 */
Client.Payment.PaymentOrderEdit.isCustoms = false;

/**
 * Проверяет, является ли выбранное основание таможенным платежем
 * @param budgetBase тип основания платежа
 */
Client.Payment.PaymentOrderEdit.checkCustoms = function (budgetBase) {
    if (budgetBase != 'ДЕ' &&
                budgetBase != 'ПО' &&
                budgetBase != 'КВ' &&
                budgetBase != 'КТ' &&
                budgetBase != 'ИД' &&
                budgetBase != 'ИП' &&
                budgetBase != 'ТУ' &&
                budgetBase != 'БД' &&
                budgetBase != 'ИН' &&
                budgetBase != 'КП' &&
                budgetBase != 'АП' &&
                budgetBase != 'АР' &&
                budgetBase != '00' &&
                budgetBase != '0'){
        return false;
    } else {
        return true;
    }
};

//Client.Payment.PaymentOrderEdit.onChangeCustomsCode = function () {
//    customsCode = getValue(blockPrefix + "3.pnlBudgetDetailsBlock.edtBudgetCustomsCode");
//    setValue(blockPrefix + "3.pnlBudgetDetailsBlock.edtBudgetPeriodValue", customsCode);
//}

/**
 * Установка необходимого формата поля 107: налоговый период или код таможенного органа
 */
Client.Payment.PaymentOrderEdit.checkBudgetPeriodFormat = function () {
    var isCustomsNewValue = this.checkCustoms(this.edtBudgetBase.getValue());
    if (this.isCustoms != this.isCustomsNewValue) {
        this.isCustoms = isCustomsNewValue;
        if (this.isCustoms) {
            this.lblBudgetPeriodTitle.setClass('form-label');
            this.edtBudgetPeriodPrefix.hide();
            this.edtBudgetPeriodPrefix.setValue('');
            this.edtBudgetPeriod.hide();
            this.edtBudgetPeriod.setValue('');
            this.edtBudgetPeriodValue.show();
        } else {
            this.lblBudgetPeriodTitle.setClass('normal_link');
            this.edtBudgetPeriodPrefix.show();
            this.edtBudgetPeriod.show();
            this.edtBudgetPeriodValue.hide();
            this.edtBudgetPeriodValue.setValue('');
        }
    }
};

Client.Payment.PaymentOrderEdit.clearBudgetFields = function () {
    this.edtBudgetStatusValue.setValue("");

    // Основание платежа 106
    this.edtBudgetBase.setValue("");

    // № документа 108
    this.edtBudgetDocNum.setValue("");

    //  КБК 104
    this.edtBudgetKbk.setValue("");
    this.budgetKbkSearch.setValue("");

    // Налоговый период 107
    this.edtBudgetPeriodPrefix.setValue("");
    this.edtBudgetPeriod.setValue("");
    this.edtBudgetPeriodValue.setValue("");

    // Дата документа 109
    this.edtBudgetDocDate.setValue("");

    // ОКАТО 105
    this.edtBudgetOkato.setValue("");
    this.budgetOkatoSearch.setValue("");

    // Тип платежа 110
    this.edtBudgetPaymentType.setValue("");
};

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Валидация элементов
 */

/**
 *  Получение дополнительной информации при изменении Начисления НДС
 */
Client.Payment.PaymentOrderEdit.onChangeChargeNds = function () {
    if (this.isOnChangeEnabled) {
        var elId = this.cmbChargeNdsDisplayValue.getSelectedValue();
        if (elId) {//FIXME: fx7 может приходить null и падает
            var params = getNewMap();
            params.put('id', elId);
            this.serviceGetChargeNDSById.call(params, function(inArr) {
                Client.Payment.PaymentOrderEdit.setChargeNds(inArr);
                Client.Payment.PaymentOrderEdit.onChangeSum();
            });
        }
    }
};

Client.Payment.PaymentOrderEdit.initialiseChargeNds = function () {
    var elId = this.cmbChargeNdsDisplayValue.getSelectedValue();
    if (elId){//FIXME: fx7 может приходить null и падает
        var params = getNewMap();
        params.put('id', elId);
        this.serviceGetChargeNDSById.call(params, function(inArr) {
            Client.Payment.PaymentOrderEdit.setChargeNds(inArr);
            Client.Payment.PaymentOrderEdit.chargeNdsFinalText = Client.Payment.PaymentOrderEdit.buildNdsText();
        });
    }
};

//При необходимости пересчитывает Сумму платежа и изменят текст Назначения платежа.
//Вызывается при получении дополнительной информации при изменении Начислений НДС.
Client.Payment.PaymentOrderEdit.setChargeNds = function (inArr) {
    this.isChargeNdsChanged = false;
    this.decPaymentSumWithCurrentValues();
    if (inArr.get('increaseSumOn')) {
        this.chargeNdsIncreaseSumOn = inArr.get('increaseSumOn');
    } else {
        this.chargeNdsIncreaseSumOn = 0;
    }

    this.chargeNdsAddText = inArr.get('addText');

    if (inArr.get('addSumToText')) {
        this.chargeNdsAddSumToText = inArr.get('addSumToText');
    } else {
        this.chargeNdsAddSumToText = 0;
    }
};

//onChange обработчик для Суммы платежа
Client.Payment.PaymentOrderEdit.onChangeSum = function () {
    if (this.isOnChangeEnabled) {
        this.deleteCurrentNdsText();
        if (this.validateMessagePaymentAmount()) {
            this.addNdsText();
            if (this.isChargeNdsChanged) {
                this.isChargeNdsChanged = false;
                this.incPaymentSumWithCurrentValues();
            }
            this.buildSumInWords();
            this.checkSum();
            this.checkAccountToNonResAccGroup();
            this.isOnChangeEnabled = false;
            this.addFractionalAmountPart(this.edtPaymentAmountValue.getValue());
            this.isOnChangeEnabled = true;
        } else {
            this.lblAmountInWordsValue.setValue('');
        }
    }
};

Client.Payment.PaymentOrderEdit.checkSum = function () {
    //проверяем доступный остаток
    var regex = new RegExp("\\s", "gm");
    var maxAmount = this.lblAvailableAmountValue.getValue();//FIXME: why from label???
    maxAmount = maxAmount?maxAmount.replace(regex, ""):'0';//пропускаем пробелы
    maxAmount = parseFloat(maxAmount.replace(",", "."));// берем число, заменяя все запятые на точки(для парсера)
    var curAmount = this.edtPaymentAmountValue.getText() * 1;
//    if (curAmount < 1) {  Надо дописывать 0 перед суммой типа .26
//        edtPaymentAmountValue.setValue('0' + edtPaymentAmountValue.getValue());
//    }
    if (this.cmbPayerAccountNumber.getValue() && maxAmount < curAmount) {
        this.lblSumWarning.show();
        return false;
    } else {
        this.lblSumWarning.hide();
        return true;
    }
};

//Функции для пересчета Суммы платежа с учетом НДС
Client.Payment.PaymentOrderEdit.incPaymentSumWithCurrentValues = function () {
    if (this.chargeNdsIncreaseSumOn > 0) {
        this.incPaymentSumOn(this.chargeNdsIncreaseSumOn);
    }
    this.isChargeNdsChanged = true;
};

//
Client.Payment.PaymentOrderEdit.decPaymentSumWithCurrentValues = function () {
    if (this.chargeNdsIncreaseSumOn > 0) {
        this.decPaymentSumOn(this.chargeNdsIncreaseSumOn);
    }
    this.isChargeNdsChanged = true;
};

//
Client.Payment.PaymentOrderEdit.incPaymentSumOn = function (percent) {
    var sum = parseFloat(this.edtPaymentAmountValue.getValue());
    sum = roundTo(sum + sum * percent / 100, 2);
    this.edtPaymentAmountValue.setValue('' + sum);
};

//
Client.Payment.PaymentOrderEdit.decPaymentSumOn = function (percent) {
    var sum = parseFloat(this.edtPaymentAmountValue.getValue());
    sum = roundTo((sum * 100) / (100 + percent), 2);
    this.edtPaymentAmountValue.setValue('' + sum);
};

Client.Payment.PaymentOrderEdit.addFractionalAmountPart = function (sum) {
    if (/[.][0-9]{2}/.test(sum)) {
        this.edtPaymentAmountValue.setValue(sum);
    } else if (/[.][0-9]/.test(sum)) {
        this.edtPaymentAmountValue.setValue(sum + 0);
    } else {
        this.edtPaymentAmountValue.setValue(sum + '.00');
    }
};

//Добавляет текст о начислениях НДС в Назначение платежа
Client.Payment.PaymentOrderEdit.addNdsText = function () {
   this.chargeNdsFinalText = this.buildNdsText();
    if (this.isUpdateNdsText == true) {
        var finalText = this.memPaymentDetailsValue.getValue();
        if (this.chargeNdsFinalText) {
            if (finalText) {
                finalText = this.deleteSpaceToEnd(finalText);
                finalText = finalText + " " + this.chargeNdsFinalText;
            } else {
                finalText = this.chargeNdsFinalText;
            }
        }
        this.memPaymentDetailsValue.setValue(finalText);
    } else {
        this.isUpdateNdsText = true;
    }
};

//удаление симолов переноса из строки
Client.Payment.PaymentOrderEdit.clearnl = function (text) {
    var result = text;
    result = result.replace(/\r\n/g, ' ');
    result = result.replace(/(\n(\r)?)/g, ' ');
    return result;
};

//удаляет из элемента все символы *, заменяя их на пробелы.
Client.Payment.PaymentOrderEdit.removeStarsFromElement = function (obj) {
    var oldValue = getValue(obj.id);
    setValue(obj.id, oldValue.replace(/\*/g,' '));
};

//удаляем сиволы переносы из элемента
Client.Payment.PaymentOrderEdit.removeBadCharFromElement = function (obj) {
    var oldValue = getValue(obj.id);
    setValue(obj.id, clearnl(oldValue));
};

//Удаляет все пробелы в конце "назначения платежа".
Client.Payment.PaymentOrderEdit.deleteSpaceToEnd = function (text) {
    if (!text) {
        return text;
    }
    var regex = new RegExp("\\s+$", "gm");
    return text.replace(regex, "");
};

//Удаляет текст о начислениях НДС из Назначение платежа
Client.Payment.PaymentOrderEdit.deleteCurrentNdsText = function () {
    var finalText = (this.memPaymentDetailsValue.getText()).replace(this.chargeNdsFinalText, '');
    this.memPaymentDetailsValue.setValue(finalText);
    this.chargeNdsFinalText = '';
};

//Формирует текст о начислениях НДС
Client.Payment.PaymentOrderEdit.buildNdsText = function () {
    var finalText = '';
    if (this.chargeNdsAddText && this.chargeNdsAddSumToText > 0) {
        var sum = parseFloat(this.edtPaymentAmountValue.getText());
        var sumNds = roundTo(sum * this.chargeNdsAddSumToText / (100 + this.chargeNdsAddSumToText), 2);
        finalText = chargeNdsAddText.replace(this.chargeNdsAddTextToken, formatAmount(sumNds) + this.chargeNdsAddTextSufix);
    } else if(this.chargeNdsAddText && this.chargeNdsAddSumToText == 0){
        finalText = this.chargeNdsAddText;
    }
    return finalText;
};

/**
 * Получение списка групп счетов нерезидентов
 */
Client.Payment.PaymentOrderEdit.getNonResidentAccountList = function () {
    var params = getNewMap();
    this.serviceGetNonResAccGrouplist.call(params, function(inArr) {
        this.nonResAccGrouplist = inArr.get('Result');
    }, false);
}

/**
 * Функция, проверяющая принадлежность данного счета к группам счетов нерезидентов.
 * True, если принадлежит.
 * @param account счет, который нужно проверить
 */
Client.Payment.PaymentOrderEdit.checkAccountNonResident = function (account) {
    if (this.nonResAccGrouplist === undefined) {
        return;
    }
    for (var i = 0; i < this.nonResAccGrouplist.size(); i++) {
        var accGroupMask = this.nonResAccGrouplist.get(i).get('accGroupMask');
        if (account.indexOf(accGroupMask) == 0) {
            return true;
        }
    }
    return false;
}

Client.Payment.PaymentOrderEdit.checkErrors = function () {
    if (this.errors.length > 0) {
        WMessageManager.showError({
            message:"Не все поля формы заполнены корректно.",
            errors:this.errors
        });
        return false;
    } else {
        WMessageManager.hideError();
        return true;
    }
}

Client.Payment.PaymentOrderEdit.validateMessagePaymentAmount = function () {
    // Сумма платежа
    if (this.errors.indexOf(this.AMOUNT_ERROR_MESSAGE) >= 0) {
        this.errors.splice(this.errors.indexOf(this.AMOUNT_ERROR_MESSAGE), 1);
    }
    var result = Client.Payment.Common.isAmountValid(this.edtPaymentAmountValue, this.AMOUNT_ERROR_MESSAGE, this.errors);
    this.checkErrors();
    return result;
}

/**
 * Проверка наличия в полях формы счетов нерезидентов
 * @param errors список ошибок валидации
 */
Client.Payment.PaymentOrderEdit.validateAccountNonResidentRestriction = function (errors) {
    // Запрет платежей в пользу нерезидентов - маска счета для поиска в полях названия получателя и назначения платежа
    var accountMask = /[0-9]{20}/g;
    // Запрет платежей в пользу нерезидентов - счет, найденный по маске
    var account;
    // Запрет платежей в пользу нерезидентов - временный индикатор наличия счета нерезидента для разных полей
    var hasNonResAccTemp = false;
    // Запрет платежей в пользу нерезидентов - глобальный индикатор наличия счета нерезидента
    var hasNonResAcc = false;

    // Запрет платежей в пользу нерезидентов - проверка счета получателя
    hasNonResAccTemp = this.checkAccountNonResident(AccountUtils.unmaskAccount(this.edtRecipientAccountNumber.getValue()));
    if (hasNonResAccTemp) {
        hasNonResAcc = true;
        this.edtRecipientAccountNumber.setError(true);
    }
    WValidator.checkCondition(!hasNonResAccTemp, this.edtRecipientAccountNumber, '', this.errors);

    // регулярные выражения для проверки нерезидентов
    var dotReg = new RegExp("[.]","g");
    var spsReg = new RegExp(" ","g");
    
    if (this.memPaymentDetailsValue.getValue()) {
        // Запрет платежей в пользу нерезидентов - проверка счета, указанного в назначении платежа
        hasNonResAccTemp = false;
        while ((account = accountMask.exec(this.memPaymentDetailsValue.getValue().replace(dotReg, '').replace(spsReg, ''))) != null) {
        var currencyCode = account[0].substring(5,8);            
        if (!hasNonResAccTemp && currencyCode == '810') {
                hasNonResAccTemp = this.checkAccountNonResident(account[0]);
                if (hasNonResAccTemp) {
                    hasNonResAcc = true;
                }
            }
        }
        WValidator.checkCondition(!hasNonResAccTemp, this.memPaymentDetailsValue, '', this.errors);
    }

    if (this.memRecipientNameValue.getValue()) {
        // Запрет платежей в пользу нерезидентов - проверка счета, указанного в наименовании получателя
        hasNonResAccTemp = false;
        while ((account = accountMask.exec(this.memRecipientNameValue.getValue().replace(dotReg, '').replace(spsReg, ''))) != null) {
        var currencyCode = account[0].substring(5,8);    
        if (!hasNonResAccTemp && currencyCode == '810') {
                hasNonResAccTemp = this.checkAccountNonResident(account[0]);
                if (hasNonResAccTemp) {
                    hasNonResAcc = true;
                }
            }
        }
        WValidator.checkCondition(!hasNonResAccTemp, this.memRecipientNameValue, '', this.errors);
    }

    // Запрет платежей в пользу нерезидентов - выводим ошибку, если нашелся хотя бы один счет нерезидента
    if (hasNonResAcc) {
        this.errors.push(getResourceBundle('form.paymentEdit.validation.nonResidentAccountsRestricted'));
    }
    return hasNonResAcc;
}

/**
 * Запрет платежей на валютные счета
 * @param errors список ошибок валидации
 */
Client.Payment.PaymentOrderEdit.validateForeignCurrencyRestriction = function (errors) {
    var account = AccountUtils.unmaskAccount(this.edtRecipientAccountNumber.getText());
    var currencyCode = account.substring(5,8);
    WValidator.checkCondition(currencyCode == '810' || currencyCode == '', this.edtRecipientAccountNumber,
        getResourceBundle('form.paymentEdit.validation.foreignCurrencyPaymentRestricted'), errors);
}

Client.Payment.PaymentOrderEdit.validateMessageCreateDraftForm = function () {
    this.errors = [];
    this.resetErrors();

    // Плательщик Счет №
    WValidator.isNotEmpty(this.cmbPayerAccountNumber, "Не указан счет плательщика", this.errors);

    // Плательщик Название
    if(WValidator.isNotEmpty(this.lblPayerNameValue, "Не указано имя плательщика", this.errors)) {
        WValidator.isNotEmpty(this.edtPayerSelectName , "Не указано имя плательщика", this.errors);
    }

    // Плательщик ИНН
    WValidator.isNotEmpty(this.lblPayerTinValue, "Не указан ИНН плательщика", this.errors);
    // Сумма платежа
    if (Client.Payment.Common.isAmountNotZero(this.edtPaymentAmountValue)) {
        this.validateMessagePaymentAmount();
    }
    if (this.edtRecipientAccountNumber.getValue()){
        // Проверка наличия счетов нерезидентов
        var hasNonResAcc = this.validateAccountNonResidentRestriction(this.errors);

        // Запрет платежей на валютные счета
        this.validateForeignCurrencyRestriction(this.errors);

        if (hasNonResAcc) {
            this.edtRecipientAccountNumber.setError(true);
        }
    }
    
    // Дата ПП
    if (!this.chbSaveAsDraft.isChecked() && WValidator.isNotEmpty(this.clnPaymentDateValue, 
        "Не указана дата платежного поручения", this.errors)) {
        WValidator.dateAfter(
            this.businessDate.add(Date.DAY, -10),
            this.clnPaymentDateValue,
            "Дата платежного поручения не может быть меньше " + this.businessDate.add(Date.DAY, -10).format("d.m.Y"),
            this.errors
        );
    }
    // Проерка поля номер платежа
    if(this.edtPaymentNumber.getValue()){
        WValidator.isMatchRegExp("^\\d{1,5}$", this.edtPaymentNumber, "Неверное значение номера", this.errors);
    }
    if (this.edtBudgetKbk.getValue()) {
        WValidator.isMatchRegExp("^\\d{0,20}$", this.edtBudgetKbk, "Поле КБК (104) заполнено неверно", this.errors);
    }
    if (this.edtRecipientTin.getValue()) {
        WValidator.isMatchRegExp("^\\d{0,12}$", this.edtRecipientTin, "Неверное значение ИНН получателя", this.errors);
    }
    if (this.edtRecipientBankBic.getValue()) {
        WValidator.isMatchRegExp("^\\d{0,9}$", this.edtRecipientBankBic, "Неверное значение БИК получателя", this.errors);
    }
    return this.checkErrors();
}

/**
 * Вилидируем форму
 *
 * @returns {Boolean}
 */
Client.Payment.PaymentOrderEdit.validateMessageCreateForm = function () {
    this.errors = [];
    this.resetErrors();

    // Номер платежного поручения
    // 5-ти значный цифровой номер(ненулевой номер "0","00","000")
    WValidator.and(
        this.edtPaymentNumber, [
            WValidator.isMatchRegExp("^\\d{1,5}$", this.edtPaymentNumber, "Неверное значение номера", this.errors),
            WValidator.isNotMatchRegExp("\\d{1,}000$", this.edtPaymentNumber, "Последние 3 цифры номера НЕ должны быть равны 000", this.errors),
            WValidator.isNotMatchRegExp("^0{1,3}$", this.edtPaymentNumber, "Номер платежа не может быть нулевым", this.errors)
        ], "", this.errors
    );

    // Отправить не ранее
    if (!this.chbSendToday.isChecked() && this.clnProcessDateValue.getText().length > 0) {
        WValidator.checkCondition(
            this.clnProcessDateValue.getDate() > this.businessDate.clearTime(true),
            this.clnProcessDateValue,
            "Значение в поле \"Отправить не ранее\" не может быть меньше или равно " + this.businessDate.format("d.m.Y"),
            this.errors
        );
    }

    // Дата ПП
    if (WValidator.isNotEmpty(this.clnPaymentDateValue, "Не указана дата платежного поручения", this.errors)) {
        WValidator.dateAfter(
            this.businessDate.add(Date.DAY, -10),
            this.clnPaymentDateValue,
            "Дата платежного поручения не может быть меньше " + this.businessDate.add(Date.DAY, -10).format("d.m.Y"),
            this.errors
        );
    }

    // Вид платежа
    //var paymentKind = edtPaymentKindValue.getValue();

    //Юридический адресс
    if ((this.lblPayerNameValue.getText().replace(this.payerAddress, '') + this.payerAddress).length > 160) {
        errors.push('К сожалению, отправка данного платежа в электронном виде невозможна. Пожалуйста обратитесь к Вашему менеджеру');
    }

    // Сумма платежа
    WValidator.isNotEmpty(this.edtPaymentAmountValue, "Не указана сумма", this.errors);
    Client.Payment.Common.isAmountValid(this.edtPaymentAmountValue, this.AMOUNT_ERROR_MESSAGE, this.errors);

    // Плательщик Счет №
    WValidator.isNotEmpty(this.cmbPayerAccountNumber, "Не указан счет плательщика", this.errors);
    Client.Payment.Common.isRasAccountValid(this.cmbPayerAccountNumber, this.lblPayerBankBicValue,
        "Номер расчетного счета плательщика не соответствует БИКу банка", this.errors);

    // Проверка наличия счетов нерезидентов
    var hasNonResAcc = this.validateAccountNonResidentRestriction(this.errors);

    // Запрет платежей на валютные счета
    this.validateForeignCurrencyRestriction(this.errors);

    // Получатель ИНН
    if (!this.edtRecipientTin.getValue()) {
        WValidator.isNotEmpty(this.cagentInnSearch, "ИНН получателя обязателен для заполнения. \n" +
            "    Для отправки документа поле автоматически было заполнено нулями. \n" +
            "    При необходимости отредактируйте значение поля.", this.errors);
        this._disableOnChange(function() {
            this.cagentInnSearch.setValue('0000000000');
            this.edtRecipientTin.setValue('0000000000');
        });
        this.cagentInnSearch.setError(true);
    } else if (this.edtRecipientTin.getValue() == '0000000000') {
        // Считаем такое значение ИНН валидным
    } else {
        Client.Payment.Common.isInnValid(this.cagentInnSearch, "Неверное значение ИНН получателя", this.errors);
    }
//    WValidator.isNotEmpty(edtRecipientTin, "ИНН получателя обязателен для заполнения.", errors);

    // Получатель КПП
    //WValidator.isNotEmpty(edtRecipientKpp, "Не указан КПП получателя", errors);

//    // Получатель № счета
//    WValidator.isNotEmpty(edtRecipientAccountNumber, "Не указан расчетный счет получателя", errors);
//    Client.Payment.Common.isRasAccountValid(edtRecipientAccountNumber, edtRecipientBankBic, "Номер расчетного счета получателя не соответствует БИКу банка", errors);

    // Получатель № счета
    if (WValidator.isNotEmpty(edtRecipientAccountNumber, "Не указан расчетный счет получателя", this.errors)) {
        Client.Payment.Common.isRasAccountValid(this.edtRecipientAccountNumber, this.edtRecipientBankBic, "Номер расчетного счета получателя не соответствует БИКу банка", errors);
    }

    // Получатель Название
    WValidator.isNotEmpty(this.memRecipientNameValue, "Не указано имя получателя", this.errors);
    if (this.memRecipientNameValue.getValue()) {
        WValidator.isLengthBetween(0, 160, this.memRecipientNameValue, "Наименование получателя не должно превышать 160 символов", this.errors);
    }

    // Плательщик Название
    if(WValidator.isNotEmpty(this.lblPayerNameValue, "Не указано имя плательщика", this.errors)){
        WValidator.isNotEmpty(this.edtPayerSelectName, "Не указано имя плательщика", this.errors);
    }

    // Плательщик ИНН
    WValidator.isNotEmpty(this.lblPayerTinValue, "Не указан ИНН плательщика", this.errors);
    // Получатель Очередность
    //var cmbPriorityValue = cmbPriorityValue.getValue();

    // Получатель. пустой БИК
    if (WValidator.isNotEmpty(this.cagentBicSearch, "Не указан БИК получателя", this.errors)) {
        // Получатель. отсутствующий в справочнике БИК
        WValidator.checkCondition(!this.wrnBic.isVisible(), this.cagentBicSearch, "Указан не существующий БИК получателя", this.errors);
    }

    // Назначение платежа
    WValidator.isNotEmpty(this.memPaymentDetailsValue, "Не указано назначение платежа", this.errors);

    // Получатель. валидация КПП
    WValidator.isMatchRegExp("(^\\d{9}$)|(^$)", this.edtRecipientKpp, "Указан некорректный КПП получателя", this.errors);

    // Назначение платежа. Начисление НДС
    var cmbChargeNdsDisplay = this.cmbChargeNdsDisplayValue.getValue();

    // Назначение платежа. Дополнительная информация
    //WValidator.isNotEmpty(memPaymentAdditionalInfo, "Не указана дополнительная информация", errors);

    // Бюджетный платеж
    var chbBudgetPaymentFlagValue = this.chbBudgetPaymentFlag.getValue();
    var isValidBudget = true;

    if (this.chbBudgetPaymentFlagValue) {
        // Плательщик КПП
        WValidator.isNotEmpty(cmbPayerKppValue, "Поле КПП плательщика обязательно к заполнению для бюджетных платежей", errors);

        // Получатель КПП валидация кпп плателдьщика при бюджетном платеже
        WValidator.isMatchRegExp("^\\d{9}$", edtRecipientKpp, "Поле КПП получателя обязательно к заполнению для бюджетных платежей", errors);

        // Статус плательщика 101
        if (!WValidator.isNotEmpty(this.edtBudgetStatusValue, "", this.errors)) {
            isValidBudget = false;
        }

        // Основание платежа 106
        if (!WValidator.isNotEmpty(this.edtBudgetBase, "", this.errors)) {
            isValidBudget = false;
        }

        // № документа 108
        if (!WValidator.isNotEmpty(this.edtBudgetDocNum, "", this.errors)) {
            isValidBudget = false;
        }
        //FIXME: unknown function
        if (!rightVal(getElementById("frmPaymentOrderEdit.pnlPaymentOrder.pnlPaymentPurposeInfo.pnlBudgetDetailsBlock.edtBudgetDocNumValue"))) {
            this.errors.push("В поле № документа(108) можно вводить только цифры");
            isValidBudget = false;
        }

        //  КБК 104
        if (!WValidator.isNotEmpty(budgetKbkSearch, "", this.errors)) {
            isValidBudget = false;
        } else {
            WValidator.isMatchRegExp("\\d{20}|^0$", this.budgetKbkSearch, "Поле КБК(104) бюджетного платежа должно быть 20 символов", this.errors);
        }

        var isEmptyBudgetPeriod = false;

        if (isCustoms) {
            // Код таможенного органа 107
            if (!WValidator.isNotEmpty(edtBudgetPeriodValue, "", this.errors)) {
                isValidBudget = false;
                isEmptyBudgetPeriod = true;
            }

            if ((this.edtBudgetBase.getText() == 'АП' || this.edtBudgetBase.getText() == 'АР') &&
                !WValidator.isEqualsTo("0" , this.edtBudgetPeriodValue, "В поле налогового периода(107) должно быть указано значение 0", this.errors)) {
                isValidBudget = false;
            }
        } else {
            // Налоговый период 107
            if (!WValidator.isNotEmpty(this.edtBudgetPeriodPrefix, "", errors)) {
                isEmptyBudgetPeriod = true;
            }

            if ((this.edtBudgetPeriodPrefix.getText() != '0') && (this.edtBudgetPeriodPrefix.getText() != '00') && !WValidator.isNotEmpty(this.edtBudgetPeriod, "", errors)) {
                isEmptyBudgetPeriod = true;
            }

            if(!isEmptyBudgetPeriod){
                // Отмечаем оба поля красным, если итоговое значение невалидно
                var isValid = this.validateBudgetPeriod(this.edtBudgetBase.getText(), this.edtBudgetPeriodPrefix.getText(), edtBudgetPeriod.getText());
                WValidator.checkCondition(isValid, this.edtBudgetPeriodPrefix, "", this.errors);
                WValidator.checkCondition(isValid, this.edtBudgetPeriod, "", this.errors);
                if (!isValid) {
                    this.errors.push("Поле налогового периода(107) заполнено некорректно");
                    isValidBudget = false;
                }
            } else {
                // Если хотя бы одно поле пустое - отмечаем красным оба
                WValidator.checkCondition(!isEmptyBudgetPeriod, this.edtBudgetPeriodPrefix, "", this.errors);
                WValidator.checkCondition(!isEmptyBudgetPeriod, this.edtBudgetPeriod, "", this.errors);
                isValidBudget = false;
            }
        }

        if (!WValidator.isNotEmpty(this.edtBudgetDocDate, "", this.errors)) {
            isValidBudget = false;
            // Дата документа 109
            // DD.MM.YYYY
        } else if (this.edtBudgetDocDate.getValue() != 0 && (this.edtBudgetDocDate.getText().length != 10 || !trueDate(this.edtBudgetDocDate))) {
            this.errors.push("Указана некорректная дата: Дата документа (109).");
        }

        // ОКАТО 105
        if (!WValidator.isNotEmpty(this.budgetOkatoSearch, "", this.errors)) {
            isValidBudget = false;
        }

        // Тип платежа 110
        if (!WValidator.isNotEmpty(this.edtBudgetPaymentType, "", this.errors)) {
            isValidBudget = false;
        }

        // для бюджетного платежа очередность не может быть больше 4
        WValidator.isMatchRegExp("^[1-4]$", this.cmbPriorityValue, "Для бюджетного платежа очередность не может быть больше 4", errors);
    } else {
        WValidator.checkCondition(this.cmbPayerKppValue.getSelectedText() != "0", this.cmbPayerKppValue,
            "Поле КПП плательщика заполнено некорректно", errors);
    }
    if (!isValidBudget) {
        errors.push("Не все поля бюджетного платежа заполнены");
    }

    return checkErrors();
}


Client.Payment.PaymentOrderEdit.resetErrors = function () {
    this.edtPaymentNumber.setError(false);
    this.clnProcessDateValue.setError(false);
    this.clnPaymentDateValue.setError(false);
    this.edtPaymentAmountValue.setError(false);
    this.cmbPayerAccountNumber.setError(false);
    this.edtRecipientTin.setError(false);
    this.edtRecipientAccountNumber.setError(false);
    this.memRecipientNameValue.setError(false);
    this.edtRecipientBankBic.setError(false);
    this.memPaymentDetailsValue.setError(false);
    this.edtRecipientKpp.setError(false);
    this.cmbPayerKppValue.setError(false);
    this.edtBudgetStatusValue.setError(false);
    this.edtBudgetBase.setError(false);
    this.edtBudgetDocNum.setError(false);
    this.edtBudgetKbk.setError(false);
    this.edtBudgetPeriodValue.setError(false);
    this.edtBudgetPeriodPrefix.setError(false);
    this.edtBudgetPeriod.setError(false);
    this.edtBudgetDocDate.setError(false);
    this.edtBudgetOkato.setError(false);
    this.edtBudgetPaymentType.setError(false);
    this.cagentInnSearch.setError(false);
}

Client.Payment.PaymentOrderEdit.saveUniquePayment = function (nextAction) {
    var caller = new DSCaller("[paymentws]", "searchpayment", "", false);
    var isUnique = true;
    var params = getNewMap();
    params.put('filterClient', this.edtPayerSelectId.getValue());
    params.put('startDate', this.clnPaymentDateValue.getDate());
    var endDate = this.clnPaymentDateValue.getDate();
    if(endDate != null){
      endDate.setDate(this.clnPaymentDateValue.getDate().getDate() + 1);
    }
    params.put('endDate', endDate);
    params.put('filterAmountStart', this.edtPaymentAmountValue.getValue() * 1);
    params.put('filterAmountEnd', this.edtPaymentAmountValue.getValue() * 1);
    params.put('filterRecipientAccount', AccountUtils.unmaskAccount(this.edtRecipientAccountNumber.getText()));
    params.put('filterNumber3', (this.edtPaymentNumber.getText().length > 3)
        ? this.edtPaymentNumber.getValue().substr(this.edtPaymentNumber.getText().length - 3, 3) * 1
        : this.edtPaymentNumber.getValue() * 1);
    if (this.docMode == 'edit') {
        params.put("thisId", getInputParam("id"));
    }
    caller.call(params, function (response) {
        var totalCount = response.get("Result").get(0).get('TOTALCOUNT');
            if(totalCount == '0') {
                switch(nextAction){
                    case 'SAVE': // сохранить ПП
                        sendForm("SAVE", false, true);
                        break;
                    case 'SIGN': // подписать ПП
                        Client.Payment.PaymentOrderEdit.checkSignRuleWithMinSum("SIGN_SAVE");
                        break;
                    default:
                        break;
                }


            } else {
                WMessageManager.showError({
                    message:"Подобный платежный документ уже заведен в системе."
                });
            }
    }, true);
}

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Работа с платежами
 */
Client.Payment.PaymentOrderEdit.savePayment = function () {
    // validate all
    this.setPaymentOutputData();
    if(this.chbCreateTemplate.isChecked()){
        if (Client.Payment.PaymentOrderEdit.validateMessageCreateDraftForm()) {
            //FIXME: fx7 запрос на сохранение шаблона
            /*
            Ext.Msg.prompt('Наименование шаблона', 'Введите наименование нового Шаблона:', function(btn, text){
                if ((btn == 'ok') && (text.length > 0)){
                    setOutputParam("templateName", text);
                    checkTemplateExists(text, function(templateId) {
                        if (templateId != 0) {
                            if (confirm("Шаблон с таким названием уже существует! Удалить и создать новый?")) {
                                setOutputParams("conflictTemplateId", templateId);
                                sendForm("ADD_TEMPLATE", false, true);
                            }
                        } else {
                            sendForm("ADD_TEMPLATE", false, true);
                        }
                    });
                }
            }, this, false, memRecipientNameValue.getValue());
            */
        }
    } else {
        if (this.chbSaveAsDraft.isChecked()) {
            if (validateMessageCreateDraftForm()) {
                setOutputParam("statusKey", "Draft");
                saveUniquePayment("SAVE");
            }
        } else if (this.validateMessageCreateForm()) {
            setOutputParam("statusKey", "OnSigning");
            this.saveUniquePayment("SAVE");
        }
    }
}

Client.Payment.PaymentOrderEdit.signPayment = function (sendToBankFlag) {
    if (validateMessageCreateForm()) {
        this.setPaymentOutputData();
        setOutputParam("statusKey", "OnSigning");
        setOutputParam("isAutoSend", sendToBankFlag);
        this.isFormChanged = false;
        this.saveUniquePayment("SIGN");
    }
}

var serviceInsertPayment = new DSCaller('[paymentws]', 'insertpayment', 'onPaymentSaved', false);
//var serviceInsertPayment = new DSCaller('[paymentws]', 'insertpayment', 'onPaymentSaved', false);
//var serviceInsertPayment = new DSCaller('[paymentws]', 'insertpayment', 'onPaymentSaved', false);

Client.Payment.PaymentOrderEdit.updatePayment = function () {

}

Client.Payment.PaymentOrderEdit.onPaymentUpdated = function (inArr) {

}

Client.Payment.PaymentOrderEdit.setPaymentOutputData = function () {
    setOutputParam("isPrintForm", this.isPrintForm);
    var urgency = 1000;
    if (this.chbSendToday.isChecked()) {
        urgency = 1001;
    }
    setOutputParam("clienturgencyId", urgency);
    setOutputParam("urgency", urgency);
    setOutputParam("docNumber", this.edtPaymentNumber.getValue());
    setOutputParam("docDate", this.tlnPaymentDateValue.getDate());
    setOutputParam("startProcesDate", this.tlnProcessDateValue.getDate());
    if (this.cmbPaymentKindChoose.getSelectedValue()) {
        setOutputParam("paymentType", this.tmbPaymentKindChoose.getSelectedValue());
    }
    setOutputParam("amount", this.tdtPaymentAmountValue.getValue());
    setOutputParam("payerAccNumber", this.tnmaskAccount(cmbPayerAccountNumber.getSelectedValue()));
    setOutputParam("senderAccount", this.tnmaskAccount(cmbPayerAccountNumber.getSelectedValue()));
    setOutputParam("payerKpp", this.tmbPayerKppValue.getSelectedValue());
    setOutputParam("senderKpp", this.tmbPayerKppValue.getSelectedValue());
    setOutputParam("payerTin", this.tblPayerTinValue.getValue());
    setOutputParam("payerName", this.tblPayerNameValue.getValue().replace(payerAddress, ''));
    setOutputParam("payerBankName", this.tblPayerBankNameValue.getValue());
    setOutputParam("payerBankRegion", this.tblPayerBankRegionValue.getValue());
    setOutputParam("payerBankBic", this.tblPayerBankBicValue.getValue());
    setOutputParam("payerBankCorAcc", this.tnmaskAccount(lblPayerBankCorAccountValue.getValue()));
    setOutputParam("benefTin", this.tdtRecipientTin.getValue());
    setOutputParam("benefKpp", this.tdtRecipientKpp.getValue());

    setOutputParam("benefName", this.temRecipientNameValue.getValue());
    setOutputParam("benefAccNumber", this.tnmaskAccount(edtRecipientAccountNumber.getValue()));
    setOutputParam("benefBankName", this.tblRecipientBankNameValue.getValue());
    setOutputParam("benefBankRegion", this.tblRecipientBankRegionValue.getValue());
    setOutputParam("benefBankBic", this.tdtRecipientBankBic.getValue());
    setOutputParam("benefBankCorAcc", this.tnmaskAccount(lblRecipientBankCorAccountValue.getValue()));

    setOutputParam("paymentPurpose", this.temPaymentDetailsValue.getValue());
    setOutputParam("chargeNdsId", this.tmbChargeNdsDisplayValue.getSelectedValue());
    setOutputParam("priority", this.tmbPriorityValue.getSelectedValue());


    setOutputParam("taxReason", this.edtBudgetBase.getValue());
    var edtValue = this.edtBudgetDocDate.getValue();
    if (this.edtBudgetDocDate.getValue() == 0) {
        setOutputParam("taxDocDate", null);
    } else {
        var insertedBudgetDocDate = Date.parseDate(this.edtBudgetDocDate.getValue(), this.DATE_FORMAT);
        if (insertedBudgetDocDate) {
            setOutputParam("taxDocDate", insertedBudgetDocDate);
        }
    }

    setOutputParam("taxDocNumber", this.edtBudgetDocNum.getValue());


    setOutputParam("taxCbc", this.edtBudgetKbk.getValue());


    setOutputParam("taxOkato", this.edtBudgetOkato.getValue());


    setOutputParam("taxType", this.edtBudgetPaymentType.getValue());

    setOutputParam("taxPeriod", this.getTaxPeriodValue());


    setOutputParam("taxSt", this.edtBudgetStatusValue.getValue());


    setOutputParam("additionalInformation", this.memPaymentAdditionalInfo.getValue());
    setOutputParam("benefId", null);
    setOutputParam("clientId", this.edtPayerSelectId.getValue());
    setOutputParam("payerAddress", this.payerAddress);
    setOutputParam("isSaveRecipient", this.isSaveRecipient);
    setOutputParam("isCreateOneMore", this.isCreateOneMore);
    setOutputParam("fromTemplateId", this.fromTemplateId);
}

/**
 * Определяем значение для Налогового периода (107)
 */
Client.Payment.PaymentOrderEdit.getTaxPeriodValue = function () {
    if (!chbBudgetPaymentFlag.isChecked()) {
        return null;
    }
    var taxPeriodValue = edtBudgetPeriodValue.getValue();
    var taxPeriodPrefix =  edtBudgetPeriodPrefix.getValue();
    var taxPeriodSuffix = edtBudgetPeriod.getValue();
    if (!taxPeriodValue) {
        return taxPeriodPrefix + "." + taxPeriodSuffix;
    } else {
        return taxPeriodValue;
    }
}

Client.Payment.PaymentOrderEdit.setTaxPeriodValue = function (tax) {
    if (tax && tax.length > 0) {
        var prefix = tax.substring(0, tax.indexOf("."));
        var suffix = tax.substring(tax.indexOf(".") + 1);
        if(prefix) {
            isCustoms = false;
            lblBudgetPeriodTitle.setClass('normal_link');
            edtBudgetPeriodValue.hide();
            edtBudgetPeriodPrefix.show();
            edtBudgetPeriodPrefix.setValue(prefix);
            edtBudgetPeriod.show();
            edtBudgetPeriod.setValue(suffix);
        } else {
            isCustoms = true;
            lblBudgetPeriodTitle.setClass('form-label');
            edtBudgetPeriodPrefix.hide();
            edtBudgetPeriod.hide();
            edtBudgetPeriodValue.show();
            edtBudgetPeriodValue.setValue(tax);
        }
    }
}

Client.Payment.PaymentOrderEdit.onPaymentSaved = function (inArr) {

}

Client.Payment.PaymentOrderEdit.loadPayment = function () {

}

Client.Payment.PaymentOrderEdit.onPaymentLoaded = function (inArr) {

}

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Работа с шаблонами
 */
var serviceCheckTemplateExists = new DSCaller('[paymentws]', 'checktemplateexists', '???', false);
var serviceRemoveTemplate = new DSCaller('[paymentws]', 'removetemplate', '???', false);
var serviceInsertTemplate = new DSCaller('[paymentws]', 'insertpaymenttemplate', '???', false);
var serviceGetPaymentTemplateByIdjs = new DSCaller('[paymentws]', 'getpaymenttemplatebyidjs', 'setFieldsFromTemplate', false);
var serviceSearchTemplates = new DSCaller('[paymentws]', 'searchtemplate', 'checkTemplateCount', false);
var serviceSearchContragent = new DSCaller('[dictionariesws]', 'searchusercagentswithacc', 'contragentFound', false);
var serviceSearchBudgetPayValues = new DSCaller('[dictionariesws]', 'getSimpleReference', 'onBudgetPayValueFound', false);

Client.Payment.PaymentOrderEdit.onTemplateComboChange = function () {
    var me = Client.Payment.PaymentOrderEdit;
    if (me.isOnChangeEnabled) {
        var id = me.cmbTemplateSelect.getSelectedValue();
        var name = me.cmbTemplateSelect.getSelectedText();
        if (id == me.SHOW_ALL_TEMPLATES_ID) {
            // Выбираем пустую строку
            me._disableOnChange(function(){
                me.cmbTemplateSelect.selectByValue("");
            });
            me.showTemplateSelectLookup();
        } else if (id) {
            me._disableOnChange(function(){
                me.edtTemplateSelect.setValue(name);
            });
            var params = getNewMap();
            params.put('id', id);
            me.cmbTemplateSelect.hide();
            me.serviceGetPaymentTemplateByIdjs.call(params, function(response) {
                Client.Payment.PaymentOrderEdit.setFieldsFromTemplate(response);
                Client.Payment.PaymentOrderEdit.cmbTemplateSelect.show();
            }, true);
        } else {
            me._disableOnChange(function(){
                Client.Payment.PaymentOrderEdit.edtTemplateSelect.setValue(name);
                Client.Payment.PaymentOrderEdit.cleanForm();
            })
        }
    }
}

Client.Payment.PaymentOrderEdit.budjPayment = function (element) {
    //FIXME: fx7 unknown
    // if (element.value.length > 0) {
    //     this.chbBudgetPaymentFlag.check();
    // }
}

Client.Payment.PaymentOrderEdit.validateKbk = function () {
    this.wrnKbk.hide();
    if (this.edtBudgetKbk.getText() != '') {
        var inParams = getNewMap();
        inParams.put('cbc', this.edtBudgetKbk.getValue());
        dsCall2('[dictionariesws]', 'checkcbc', inParams, function(inArr) {
            if (inArr.get('Result').get('count') == 0) {
                Client.Payment.PaymentOrderEdit.wrnKbk.show();
            } else {
                Client.Payment.PaymentOrderEdit.wrnKbk.hide();
            }
        });
    }
}

Client.Payment.PaymentOrderEdit.validateOkato = function () {
    this.wrnOkato.hide();
    if (this.edtBudgetOkato.getText() != '') {
        var inParams = getNewMap();
        inParams.put('okato', this.edtBudgetOkato.getValue());
        dsCall2('[dictionariesws]', 'checkokato', inParams, function(inArr) {
            if (inArr.get('Result').get('count') == 0) {
                Client.Payment.PaymentOrderEdit.wrnOkato.show();
            } else {
                Client.Payment.PaymentOrderEdit.wrnOkato.hide();
            }
        });
    }
}

/**
 * Очищаем форму
 */
Client.Payment.PaymentOrderEdit.cleanForm = function () {
    this.chbBudgetPaymentFlag.unCheck();
    this.clearBudgetFields();
    this.edtPaymentNumber.setValue("");

    this.lblPayerTinValue.setValue("");
    this.cmbPayerKppValue.clear();
    this.lblPayerNameValue.setValue("");
    this.payerName = "";

    this.cmbPayerAccountNumber.clear();

    this.edtPaymentAmountValue.setValue('0');
    this.lblAvailableAmountValue.setValue('0');
    this.lblPayerBankBicValue.setValue("");
    this.lblPayerBankCorAccountValue.setValue("");
    this.lblPayerBankNameValue.setValue("");

    this.lblRecipientBankCorAccountValue.setValue("");
    this.lblRecipientBankNameValue.setValue("");
    this.edtRecipientBankBic.setValue("");
    this.cagentBicSearch.setValue("");

    this.edtPayerSelectId.setValue("");
    this.edtPayerSelectName.setValue("");

    this.edtPaymentKindValue.setValue("");

    this.lblPayerTinValue.setValue("");

    this.lblPayerBankBicValue.setValue("");

    this.lblPayerBankCorAccountValue.setValue("");

    this.edtRecipientTin.setValue("");
    this.cagentInnSearch.setValue("");

    this.edtRecipientKpp.setValue("");

    this.edtRecipientAccountNumber.setValue("");

    this.cmbPriorityValue.selectByValue(6);

    this.cmbChargeNdsDisplayValue.selectByIndex(0);

    this.memRecipientNameValue.setValue("");

    this.memPaymentDetailsValue.setValue("");

    this.memPaymentAdditionalInfo.setValue("");
}

/*
 * Загрузка данных для из шаблона завершена
 */
Client.Payment.PaymentOrderEdit.setFieldsFromTemplate = function (templateValue) {
    //<editor-fold desc="Приватные функции">

    // Получаем клиента по ID из шаблона
    function _getClientInfo (clientId, callback) {
        var getclientlistParams = getNewMap();
        getclientlistParams.put('ID', clientId);
        var caller = new DSCaller("[linkadminws]", "getclientlist", "", "ID");
        caller.call(getclientlistParams, callback, true);
        //dsCall("[linkadminws]", "getclientlist", getclientlistParams, callback);
    }

    // Получаем номер нового платежного поручения
    function _getNextPaymentNumber (clientId, callback) {
        var params = getNewMap();
        params.put('clientId', clientId);
        this.serviceGetPaymentNextNumber.call(params, callback, true);
    }

    // Получаем информацию о клиенте по pin_eq
    function _getClientBaseInfo (pinEq, callback) {
        var params = getNewMap();
        params.put("id", 0);
        params.put("pinEq", pinEq);
        this.serviceGetClientBaseInfo.call(params, callback, true);
    }

    // Получаем список счетов клиента
    function _getClientAccounts (pinEq, callback) {
        var params = getNewMap();
        params.put('pinEq', pinEq);
        this.serviceGetClientAccList.call(params, callback, true);
    }

    // Получение информации о аккаунте
    function _getAccountBaseInfo (pinEq, accountNumber, callback) {
        var params = getNewMap();
        params.put('accountNumber', accountNumber);
        params.put('pinEq', pinEq);
        this.serviceGetAccountBaseInfo.call(params, callback, true);
    }

    // Получаем информацию о банке по БИК
    function _getBicInfo (bic, callback) {
        var params = getNewMap();
        params.put('bic', bic);
        this.serviceBicBrowseListByParam.call(params, callback, true);
    }

    // Заполняем значение номера ПП
    function _populatePaymentNumber (paymentNumber) {
        var nextPaymentNumber = paymentNumber.toString();
        var leadingZeroCount = 5 - nextPaymentNumber.length;
        for (var i = 0; i < leadingZeroCount; i++) {
            nextPaymentNumber = '0' + nextPaymentNumber;
        }
        this.edtPaymentNumber.setValue(nextPaymentNumber);
    }

    // Заполняем часть значений для Плательщика
    function _populatePayerInfo (clientBaseInfo) {
        var inn = clientBaseInfo.get('inn') || "";
        this.lblPayerTinValue.setValue(inn);

        this.cmbPayerKppValue.clear();
        this.cmbPayerKppValue.addEmptyOption();
        var kpp = clientBaseInfo.kpp || "";
        if (kpp) {
            this.cmbPayerKppValue.addOption(kpp, kpp);
        }
        var kpp2 = clientBaseInfo.kpp2 || "";
        if (kpp2) {
            this.cmbPayerKppValue.addOption(kpp2, kpp2);
        }
        this.addZeroKpp();

        var name = clientBaseInfo.clientFullName || "";
        this.lblPayerNameValue.setValue(name);
        payerName = name;
    }

    // Заполняем счета Плательщика
    function _populatePayerAccounts (accounts) {
        this.cmbPayerAccountNumber.clear();
        for (var i = 0; i < accounts.size(); i++) {
            var acc = accounts.get(i).get('accountNumber');
            this.cmbPayerAccountNumber.addOption(acc, acc);
        }
    }

    // Выделяем счет Плательщика
    function _selectPayerAccounts (selectedAccount) {
        this.cmbPayerAccountNumber.selectByValue(selectedAccount);
    }

    // Заполняем общую информацию о счете Плательщика
    function _populatePayerAccountBaseInfo (info) {
        var availableAmount = info.get('availableAmount');
        var bic = info.get('departmentBic');
        if (availableAmount) {
            this.lblAvailableAmountValue.setValue(availableAmount);
        } else {
            this.lblAvailableAmountValue.setValue('0');
        }
        if (bic) {
            this.lblPayerBankBicValue.setValue(bic);
        }
    }

    // Заполняем информацию о банке Плательщика
    function _populatePayerBankInfo (info) {
        this.lblPayerBankCorAccountValue.setValue(AccountUtils.maskAccount(info.get('ksn')));
        this.lblPayerBankNameValue.setValue(info.get('koName'));
    }

    // Заполняем информацию о банке Получателя
    function _populateRecipientBankInfo (info) {
        this.lblRecipientBankCorAccountValue.setValue(info.get('ksn'));
        this.lblRecipientBankNameValue.setValue(info.get('koName'));
        this.edtRecipientBankBic.setValue(info.get('bic'));
        this.cagentBicSearch.setValue(info.get('bic'));
    }

    //</editor-fold>

    if (templateValue.get('Status') != 'OK') {
        WMessageManager.showConfirm({message : this.DELETED_TEMPLATE_WARNING});
        return;
    }

    this.isOnChangeEnabled = false;
    this.cleanForm();
    var fromTemplateId = templateValue.get("id");

    //<editor-fold defaultstate="collapsed" desc="Заполнение полей не требующих подгрузки данных">
    if(templateValue.get("urgency") == "1001") {
        this.chbSendToday.check();
    } else {
        this.chbSendToday.unCheck();
    }
    this.onChangeSendTodayFlag();

    // Тип платежа
    if (templateValue.get("paymentType")) {
        this.cmbPaymentKindChoose.selectByValue(templateValue.get("paymentType"));
        this.selectedPaymentType = templateValue.get("paymentType");
    }

    // ИНН Плательшика
    if (templateValue.get("payerTin")) {
        this.lblPayerTinValue.setValue(templateValue.get("payerTin"));
    }
    // БИК
    if (templateValue.get("payerBankBic")) {
        this.lblPayerBankBicValue.setValue(templateValue.get("payerBankBic"));
    }
    // Наименование
    if (templateValue.get("payerBankName")) {
        this.lblPayerBankNameValue.setValue(templateValue.get("payerBankName"));
    }
    // Кор счет
    if (templateValue.get("payerBankCorAcc")) {
        this.lblPayerBankCorAccountValue.setValue(AccountUtils.maskAccount(templateValue.get("payerBankCorAcc")));
    }

    // Получатель

    // ИНН
    if (templateValue.get("benefTin")) {
        this.edtRecipientTin.setValue(templateValue.get("benefTin"));
        this.cagentInnSearch.setValue(templateValue.get("benefTin"));
    }
    // КПП
    if (templateValue.get("benefKpp")) {
        this.edtRecipientKpp.setValue(templateValue.get("benefKpp"));
    }
    // Счет №
    if (templateValue.get("benefAccNumber")) {
        this.edtRecipientAccountNumber.setValue(templateValue.get("benefAccNumber"));
    }
    // Очередность
    if (templateValue.get("priority")) {
        this.cmbPriorityValue.selectByValue(templateValue.get("priority"));
    }
    // frmPaymentOrderEdit.pnlPaymentOrder.pnlRecipientInfo.cmbPriorityValue
    // Имя
    if (templateValue.get("benefName")) {
        this.memRecipientNameValue.setValue(templateValue.get("benefName"));
    }

    // Наименование
    if (templateValue.get("benifBankName")) {
        this.lblRecipientBankNameValue.setValue(templateValue.get("benifBankName"));
    }
    // Кор счет
    if (templateValue.get("benefBankCorAcc")) {
        this.lblRecipientBankCorAccountValue.setValue(templateValue.get("benefBankCorAcc"));
    }

    // Назначение платежа
    if (templateValue.get("paymentPurpose")) {
        this.memPaymentDetailsValue.setValue(templateValue.get("paymentPurpose"));
    }
    // Начисление НДС
    if (templateValue.get("chargeNdsId")) {
        this.cmbChargeNdsDisplayValue.selectByValue(templateValue.get("chargeNdsId"));
    }
    // Дополнительная информация
    if (templateValue.get("additionalInformation")) {
        this.memPaymentAdditionalInfo.setValue(templateValue.get("additionalInformation"));
    }

    // Бюджетный платеж

    // Статус плательщика 101
    if (templateValue.get("taxSt")) {
        this.edtBudgetStatusValue.setValue(templateValue.get("taxSt"));
    }

    // Основание платежа 106
    if (templateValue.get("taxReason")) {
        this.edtBudgetBase.setValue(templateValue.get("taxReason"));
    }
    // № Документа 108
    if (templateValue.get("taxDocNumber")) {
        this.edtBudgetDocNum.setValue(templateValue.get("taxDocNumber"));
    }
    // КБК 104
    if (templateValue.get("taxCbc")) {
        this.edtBudgetKbk.setValue(templateValue.get("taxCbc"));
        this.budgetKbkSearch.setValue(templateValue.get("taxCbc"));
    }
    // Налоговый период 107
    this.setTaxPeriodValue(templateValue.get("taxPeriod"));

    // Дата документа 109
    if (templateValue.get("taxDocDate")) {
        this.edtBudgetDocDate.setValue(templateValue.get("taxDocDate").format(DATE_FORMAT));
    }
    // ОКАТО 105
    if (templateValue.get("taxOkato")) {
        this.edtBudgetOkato.setValue(templateValue.get("taxOkato"));
        this.budgetOkatoSearch.setValue(templateValue.get("taxOkato"));
    }
    // Тип платежа 110
    if (templateValue.get("taxType")) {
        this.edtBudgetPaymentType.setValue(templateValue.get("taxType"));
    }

    if(this._isBudgetPayment()) {
        this.budgetDetailsExpander.expandPanel();
    }
    //</editor-fold>
    this.isOnChangeEnabled = true;
    var clientId = templateValue.get("clientId");
    this.setValidClientId(clientId);
    _getClientInfo(clientId, function (getClientInfoResponse) {
        this._disableOnChange(function(){
            var clientInfo = getClientInfoResponse.get("Result").get(0);
            if(isDebugMode) {
                console.log("Client info: ", clientInfo);
            }
            this.edtPayerSelectName.setValue(clientInfo.get('PIN_EQ'));
            _getNextPaymentNumber(clientInfo.id, function (getNextPaymentNumberResponse) {
                _disableOnChange(function(){
                    var nextPaymentNumber = getNextPaymentNumberResponse.get("Result");
                    if(isDebugMode) {
                        console.log("Next payment id: ", nextPaymentNumber);
                    }
                    _populatePaymentNumber(nextPaymentNumber);
                })
            });

            _getClientBaseInfo(clientInfo.get('PIN_EQ'), function (getClientBaseInfoResponse) {
                _disableOnChange(function(){
                    var clientBaseInfo = WParams.arrayToObject(getClientBaseInfoResponse);
                    if(isDebugMode) {
                        console.log("Client base info: ", clientBaseInfo);
                    }
                    _populatePayerInfo(clientBaseInfo);
                    if(templateValue.get("payerKpp")) {
                        this.cmbPayerKppValue.selectByValue(templateValue.get("payerKpp"));
                    }
                });
            });

            _getClientAccounts(clientInfo.get('PIN_EQ'), function (response) {
                this._disableOnChange(function(){
                    var clientAccountsList = response.get("Result");
                    if(isDebugMode) {
                        console.log("Client accounts: ", clientAccountsList.toString());
                    }
                    // Номер счета для загрузки
                    var accountToSelect = null;
                    _populatePayerAccounts(clientAccountsList);
                    for (var i = 0; i < clientAccountsList.size(); i++) {
                        if (clientAccountsList.get(i).get('accountNumber') == templateValue.get('payerAccNumber')) {
                            _selectPayerAccounts(templateValue.get('payerAccNumber'));
                            accountToSelect = clientAccountsList.get(i);
                            break;
                        }
                        accountToSelect = clientAccountsList.get(0);
                    }
                    if (accountToSelect) {
                        this.getPayerAccountBaseInfo(accountToSelect.get("accountNumber"), clientInfo.get('PIN_EQ'));
                        if(templateValue.get("amount")) {
                            this.edtPaymentAmountValue.setValue(templateValue.get("amount"));
                            this.buildSumInWords();
                        }
                        this.checkAccountToNonResAccGroup();
                    }
                });
            })
        });
    });
    // БИК
    if (templateValue.get("benefBankBic")) {
        this.cagentBicSearch.setValue(templateValue.get("benefBankBic"));
        this.edtRecipientBankBic.setValue(templateValue.get("benefBankBic"));
        this.getRecipientBankFields(templateValue.get("benefBankBic"));
    }
}

Client.Payment.PaymentOrderEdit.saveTemplate = function () {};

Client.Payment.PaymentOrderEdit.onTemplateSaved = function (inArr) {};

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Работа с контрагентами
 */
//var serviceInsertPayment = new DSCaller('[paymentws]', 'insertpayment', '???', false);
//var serviceInsertPayment = new DSCaller('[paymentws]', 'insertpayment', '???', false);


Client.Payment.PaymentOrderEdit.saveCagent = function () {};

Client.Payment.PaymentOrderEdit.onCagentSaved = function (inArr) {};

// Поиск шаблона
Client.Payment.PaymentOrderEdit.onTemplateSearch = function () {
    if (this.isOnChangeEnabled) {
        keyword = this.edtTemplateSelect.getText();
        var params = getNewMap();
        params.put('PAGE', 0);
        params.put('keyword', keyword);
        this.serviceSearchTemplates.call(params);
    }
}

Client.Payment.PaymentOrderEdit.checkTemplateCount = function (params) {
    var count = params.get("TOTALCOUNT");
    if (count == 1) {
        var templateName = params.get('Result').get(0).get('templateName');
        var templateId = params.get('Result').get(0).get('id');
        if (templateName) {
            this._disableOnChange(function() {
                this.edtTemplateSelect.setValue(templateName);
            });
            var params = getNewMap();            
            params.put('id', templateId + '');
            this.serviceGetPaymentTemplateByIdjs.call(params, function(response) {
                Client.Payment.PaymentOrderEdit.setFieldsFromTemplate(response);
            }, true);
        }
    } else {
        this.showCustomLookup(this.templateLookup);
    }
}

Client.Payment.PaymentOrderEdit.onContragentSearch = function (wrapper) {
    this.isSaveRecipient = true;
    if (this.isOnChangeEnabled) {
        keyword = wrapper.getValue();
        var params = getNewMap();
        params.put('keyword', keyword);
        this.serviceSearchContragent.call(params);
    }
}

Client.Payment.PaymentOrderEdit.contragentFound = function (params) {
    var count = params.get("TOTALCOUNT");
    if (count == 1) {
        this._disableOnChange(function() {
            var contragent = params.get('Result').get(0);
            this.cagentInnSearch.setValue(contragent.get('inn'));
            this.memRecipientNameValue.setValue(contragent.get('name'));
            this.edtRecipientAccountNumber.setValue(contragent.get('acc'));
            //checkAccountToNonResAccGroup();
            if (contragent.get('kpp')) {
                this.edtRecipientKpp.setValue(contragent.get('kpp'));
            }
            this.isSaveRecipient = false;
        })
    } else if (count > 1) {
        // showExtendedLookup(elkRecipientSelect.id, 650, 370, false, keyword);
        this.showCustomLookup(this.recipientLookup);
    }
}

//Текущий просматриваемый лукап для бюджетного платежа
var currentBudgetPaymentLookup;
//Текущий label для бюджетного платежа
var currentBudgetPaymentErrorLabel;
// Текущий edit для бюджетного платежа
var currentBudgetPaymentEdit;
/*
 Поиск данных для бюджетного платежа
 */
Client.Payment.PaymentOrderEdit.onBudgetPayValuesSearch = function (lookupElement, editElement, errorLabel, brief) {
    if (this.isOnChangeEnabled) {
        var keyword = editElement.getText();
        if (keyword.length > 0) {
            if (keyword != '0' && keyword != '00') {
                keyword = this.editElement.getValue();
                var me = this;
                var params = getNewMap();
                params.put('Brief', brief || 'taxStatus');
                params.put('codeShortValueFormat', '{0} - {1}');
                params.put('shortValueContinuationFormat', '{0}...');
                params.put('shortValueMaxLenght', '82');
                params.put('keyword', keyword);
                this.serviceSearchBudgetPayValues.call(params, function(response) {
                    if(isDebugMode){
                        console.log(response);
                    }
                    var length = response.get('Result').size();
                    errorLabel.hide();
                    if (length == 1) {
                        me._disableOnChange(function() {
                            editElement.setValue(response.get('Result').get(0).get('CODE'));
                        })
                    }  else if (length > 1) {
                        showExtendedLookup(lookupElement.id, 650, 370, false, keyword);
                    }  else {
                        errorLabel.show();
                    }
                });
            } else {
                errorLabel.hide();
            }
        } else {
            lookupElement.setLookupId("");
        }
    }
}

/*
 Функция обработчик проверки сущестования шаблона, надо заменить templateName
 */
Client.Payment.PaymentOrderEdit.checkTemplateExists = function (templateName, callback) {
    WHelper.mask();
    var inParams = getNewMap();
    inParams.put("fakeId", 454);
    inParams.put("templateName", templateName);
    inParams.put("clientId", this.edtPayerSelectId.getValue());
    dsCall2('[paymentws]', 'checktemplateexists', inParams, function (inArr) {
        WHelper.unmask();
        callback(inArr.get("conflictTemplateId"));
    });
}

Client.Payment.PaymentOrderEdit.onBudgetPayValueFound = function (params){
    var length = params.get('Result').size();
    this.currentBudgetPaymentErrorLabel.hide();
    if (length == 1) {
        _disableOnChange(function() {
            this.currentBudgetPaymentEdit.setValue(params.get('Result').get(0).get('CODE'));
        })
    }  else if (length > 1) {
        showExtendedLookup(currentBudgetPaymentLookup.id, 650, 370, false, keyword);
    }  else {
        this.currentBudgetPaymentErrorLabel.show();
    }
}

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Действия
 */

Client.Payment.PaymentOrderEdit.onCreateTemplateFlagChanged = function () {
    if (Client.Payment.PaymentOrderEdit.chbCreateTemplate.isChecked()) {
        Client.Payment.PaymentOrderEdit.chbSaveAsDraft.unCheck();
    }
}

Client.Payment.PaymentOrderEdit.onSaveAsDraftFlagChanged = function () {
    if (Client.Payment.PaymentOrderEdit.chbSaveAsDraft.isChecked()) {
        Client.Payment.PaymentOrderEdit.chbCreateTemplate.unCheck();
    }
}

Client.Payment.PaymentOrderEdit.onSaveAndCreateNewButtonClick = function () {
    this.removeStarsFromElements();
    this.setOutputParams("docMode", "create");
    this.isCreateOneMore = true;
    this.savePayment();
}

Client.Payment.PaymentOrderEdit.onMultiButtonClick = function () {
    var me = Client.Payment.PaymentOrderEdit;
    me.removeStarsFromElements();
    var id = getMultiButtonId('frmPaymentOrderEdit.pnlBottomButtons2.mlbMore');
    switch(id){
        case 'SEND_BANK': // Отправить в банк
            me.signPayment(true);
            break;
        case 'SAVE_AND_CLOSE': // Сохранить и закрыть
            me.isCreateOneMore = false;
            me.savePayment();
            break;
         case 'COPY':
            var settingValueStr = getInputParams("settingValueStr"); 
            var paymentCountInRegister = getInputParams("paymentCountInRegister"); 
            var payRegStatus = getInputParams("payRegStatus"); 
            var payRegisterID = getInputParams("payRegisterID"); 
            if ((settingValueStr != null) && (paymentCountInRegister != null) && (payRegisterID != null) && (payRegisterID != "")){
             if ((paymentCountInRegister*1 + 1) > settingValueStr*1){
              /*if (isVisible("frmPaymentOrderEdit.pnlFail") == false){
               showElement("frmPaymentOrderEdit.pnlFail");
               changeCoordY("frmPaymentOrderEdit.pnlTopMenu", 50);
               changeCoordY("frmPaymentOrderEdit.pnlPaymentOrder", 50);
               changeCoordY("frmPaymentOrderEdit.pnlSubscribers", 50);
               changeCoordY("frmPaymentOrderEdit.pnlBottomButtons2", 50); 
               }*/
               WMessageManager.showError({
                message:"В данный реестр невозможно скопировать платеж, в связи с превышением лимита на количество платежей в одном реестре."
               });   
             } else if  ((payRegStatus == "PartlySigned") || (payRegStatus == "ToBeSent")){
                if (isVisible("frmPaymentOrderEdit.pnlMove") == false){
                 showElement("frmPaymentOrderEdit.pnlMove");
                 changeCoordY("frmPaymentOrderEdit.pnlTopMenu", 50);
                 changeCoordY("frmPaymentOrderEdit.pnlPaymentOrder", 50);
                 changeCoordY("frmPaymentOrderEdit.pnlSubscribers", 50);
                 changeCoordY("frmPaymentOrderEdit.pnlBottomButtons2", 50); 
                 setValue("frmPaymentOrderEdit.pnlMove.lbMove1", "Вы действительно хотите копировать платеж в текущем реестре?");
                 setValue("frmPaymentOrderEdit.pnlMove.lbMove2", "В реестре будут отменены все, проставленные ранее, подписи.");
                 hideElement("frmPaymentOrderEdit.pnlMove.btnMove");
                 showElement("frmPaymentOrderEdit.pnlMove.btnHeadCopy");
                 disableElement("frmPaymentOrderEdit.pnlBottomButtons2.mlbMore"); 
                 }
                } else {
                   sendForm("COPY"); //Копировать
                   }
             } else {
                sendForm("COPY"); //Копировать
                }
            break;
        case 'DELETE':
            var payRegStatus = getInputParams("payRegStatus"); 
            if  ((payRegStatus == "PartlySigned") || (payRegStatus == "ToBeSent")){
             showElement("frmPaymentOrderEdit.pnlMove");
             changeCoordY("frmPaymentOrderEdit.pnlTopMenu", 50);
             changeCoordY("frmPaymentOrderEdit.pnlPaymentOrder", 50);
             changeCoordY("frmPaymentOrderEdit.pnlSubscribers", 50);
             changeCoordY("frmPaymentOrderEdit.pnlBottomButtons2", 50); 
             setValue("frmPaymentOrderEdit.pnlMove.lbMove1", "Вы действительно хотите удалить платеж в текущем реестре?");
             setValue("frmPaymentOrderEdit.pnlMove.lbMove2", "В реестре будут отменены все, проставленные ранее, подписи.");             
             hideElement("frmPaymentOrderEdit.pnlMove.btnMove");
             hideElement("frmPaymentOrderEdit.pnlMove.btnHeadCopy");
             showElement("frmPaymentOrderEdit.pnlMove.btnHeadDelete");
             disableElement("frmPaymentOrderEdit.pnlBottomButtons2.mlbMore"); 
             } else {
                sendForm("DELETE");  //Удалить
                }           
            break;
        case 'CREATE_TEMPLATE':
            sendForm(""); // Создать шаблон
            break;
    }
}

//<editor-fold desc="Подстановка значений бюджетного платежа">

/** Клик на ссылке Статус Плательщика (101) */
Client.Payment.PaymentOrderEdit.showBudgetStatusValueLookup = function () {
    // WHelper.mask();
    // showExtendedLookup(this.elkBudgetStatusValue.getLookupId(), 650, 370, false, '');

    Lookup.showLookup(this.elkBudgetStatusValue.id, 'client/payment/selectBudgetValue',
    'Выбор статуса плательщика', 650, 370, function(){
        Client.Payment.PaymentOrderEdit.budgetStatusValueSelected();
        Client.Payment.PaymentOrderEdit.onChangeForm(); 
    });
}
/** Выбрано значение в лукапе Статус Плательщика (101) */
Client.Payment.PaymentOrderEdit.budgetStatusValueSelected = function () {
    this._disableOnChange(function() {
        var state = getInputParam("LOOKUP_RESULT");
        if (state === "OK"){
            var id = getInputParam("KEY");
            this.edtBudgetStatusValue.setValue(id);
            this.lblBudgetStatusValueError.hide();
        }
    })
}
/** Изменено значение в поле Статус Плательщика (101) */
Client.Payment.PaymentOrderEdit.budgetStatusValueChanged = function () {
    this.onBudgetPayValuesSearch(this.elkBudgetStatusValue, this.edtBudgetStatusValue,
        this.lblBudgetStatusValueError, "taxStatus");
    this._isBudgetPayment();
}

/** Клик на ссылке Основание Платежа (106) */
Client.Payment.PaymentOrderEdit.showBudgetBaseValueLookup = function (){
    // WHelper.mask();
    showExtendedLookup(this.elkBudgetBaseValue.getLookupId(), 650, 370, false, '');
}
/** Выбрано значение в лукапе Основание Платежа (106) */
Client.Payment.PaymentOrderEdit.budgetBaseValueSelected = function () {
    this._disableOnChange(function() {
        var state = getInputParam("LOOKUP_RESULT");
        if (state === "OK"){
            var id = getInputParam("KEY");
            this.edtBudgetBase.setValue(id);
            this.lblBudgetBaseValueError.hide();
        }
    });
    this.checkBudgetPeriodFormat();
}
/** Изменено значение в поле Основание Платежа (106) */
Client.Payment.PaymentOrderEdit.budgetBaseValueChanged = function () {
    this.checkBudgetPeriodFormat();
    this.onBudgetPayValuesSearch(this.elkBudgetBaseValue, this.edtBudgetBase,
        this.lblBudgetBaseValueError, "taxReason");
    this._isBudgetPayment();
}

/** Клик на ссылке Основание Платежа (106) */
Client.Payment.PaymentOrderEdit.showBudgetPeriodPrefixLookup = function (){
    if (!this.checkCustoms(this.edtBudgetBase.getText())) {
        // WHelper.mask();
        // showExtendedLookup(this.elkBudgetPeriodPrefix.getLookupId(), 650, 370, false, '');
            Lookup.showLookup(this.elkBudgetPeriodPrefix.id, 'client/payment/selectBudgetPeriodPrefix', 
                'Выбор налогового периода', 650, 370, function(){
            Client.Payment.PaymentOrderEdit.budgetPeriodPrefixSelected();
            Client.Payment.PaymentOrderEdit.onChangeForm();
    });
    }
}
/** Выбрано значение в лукапе Префикс Налоговый период (107) */
Client.Payment.PaymentOrderEdit.budgetPeriodPrefixSelected = function (){
    this._disableOnChange(function() {
        var state = getInputParam("LOOKUP_RESULT");
        if (state === "OK"){
            this.edtBudgetPeriodPrefix.setValue(getInputParam("KEY"));
            this.lblBudgetPeriodPrefixError.hide();
        }
    })
}
/** Изменено значение в поле Префикс Налоговый период (107) */
Client.Payment.PaymentOrderEdit.budgetPeriodPrefixChanged = function (){
    this.onBudgetPayValuesSearch(this.elkBudgetPeriodPrefix, this.edtBudgetPeriodPrefix,
        this.lblBudgetPeriodPrefixError, "taxPeriod");
    this._isBudgetPayment();
}
/**
 * Проверяем является ли платеж бюджетным. Если да, то отмечаем платеж как бюджетный.
 *
 * @private
 */
Client.Payment.PaymentOrderEdit._isBudgetPayment = function () {
    var isBudget = false;

    isBudget = isBudget || (!!this.edtBudgetStatusValue.getValue());
    isBudget = isBudget || (!!this.edtBudgetBase.getValue());
    isBudget = isBudget || (!!this.edtBudgetDocNum.getValue());
    isBudget = isBudget || (!!this.edtBudgetKbk.getValue());
    isBudget = isBudget || (!!this.edtBudgetPeriodPrefix.getValue());
    isBudget = isBudget || (!!this.edtBudgetPeriod.getValue());
    isBudget = isBudget || (!!this.edtBudgetOkato.getValue());
    isBudget = isBudget || (!!this.edtBudgetPaymentType.getValue());

    if (isBudget) {
        if (!this.chbBudgetPaymentFlag.isChecked()) {
            this.chbBudgetPaymentFlag.check();
            this.onChangeBudgetPaymentFlag();
        }
    } else {
        if (this.chbBudgetPaymentFlag.isChecked()) {
            this.chbBudgetPaymentFlag.unCheck();
            this.onChangeBudgetPaymentFlag();
        }
    }
    return isBudget;
}
//</editor-fold>

Client.Payment.PaymentOrderEdit.onSignButtonClick = function () {
    Client.Payment.PaymentOrderEdit.removeStarsFromElements();
    Client.Payment.PaymentOrderEdit.signPayment(false);
}

Client.Payment.PaymentOrderEdit.onPrintClick = function () {
    this.isPrintForm = true;
    this.setPaymentOutputData();
    sendForm("PRINT", false);
}

Client.Payment.PaymentOrderEdit.onChangeDate = function () {
    if (this.chbSendToday.isChecked()) {
        this.clnProcessDateValue.setValue(this.clnPaymentDateValue.getValue());
    }
}

Client.Payment.PaymentOrderEdit.checkSignPermission = function (clientId) {
    if (getElementById("frmPaymentOrderEdit.pnlSubscribers.rpnlSign.btnSign") != null) {
        this.hideSignButton(hasSignPermission(this.userContext, clientId));
    }
}

Client.Payment.PaymentOrderEdit.hideSignButton = function (flag) {
    if (flag) {
        showElement("frmPaymentOrderEdit.pnlSubscribers.rpnlSign.btnSign");
    } else {
        hideElement("frmPaymentOrderEdit.pnlSubscribers.rpnlSign.btnSign");
    }
}

Client.Payment.PaymentOrderEdit.getMultiButtonOptions = function (payerId){
    var inParams = getNewMap();
    if (this.docMode == 'copy') {
        inParams.put("paymentMode", "create");
    } else {
        inParams.put("paymentMode", this.docMode);
    }
    inParams.put("paymentStatus", getInputParam("statusKey"));
    var paymentOrderId = getInputParam("paymentOrderId");
    if (paymentOrderId && paymentOrderId > 0) {
        inParams.put("paymentOrderId", getInputParam("paymentOrderId"));
    }
    if (payerId && payerId > 0) {
        inParams.put("payerId", payerId * 1);
    }
    this.serviceGetMultiButtonOptions.call(inParams, function(response){
        if (response.get('Status') == 'OK'){
           Client.Payment.PaymentOrderEdit.setMultiButtonOptions(response.get('Result'));
        }
        else
            console.log('Failed to retreive multibutton options');        
    });
}

/**
 * Заполняет значения для кнопки
 * @param {Array} items
 */
Client.Payment.PaymentOrderEdit.setMultiButtonOptions = function (items){
    this.mlbMore.removeAll();
    for(var i = 0; i < items.size(); i++){
        this.mlbMore.addItem(items.get(i).get('Id'), items.get(i).get('Name'));
    }
    var payRegisterID = getInputParams("payRegisterID");
    if ((payRegisterID != null) && (payRegisterID != "")){
        this.mlbMore.removeItem('SEND_BANK');
    }
}

Client.Payment.PaymentOrderEdit.validateBudgetPeriod = function (edtBudgetBaseVal, edtBudgetPeriodPrefixVal, 
    edtBudgetPeriodVal){
    var result = true;
    if((edtBudgetBaseVal!='ДЕ')&&(edtBudgetBaseVal!='ПО')&&(edtBudgetBaseVal!='КВ')&&(edtBudgetBaseVal!='КТ')&&
        (edtBudgetBaseVal!='ИД')&&(edtBudgetBaseVal!='ИП')&&(edtBudgetBaseVal!='ТУ')&&(edtBudgetBaseVal!='БД')&&
        (edtBudgetBaseVal!='ИН')&&(edtBudgetBaseVal!='КП')){

        result = false;

        edtBudgetPeriodVal = edtBudgetPeriodVal.split('.');

        var bb = edtBudgetPeriodVal[0];
        var cccc = edtBudgetPeriodVal[1];

        if (edtBudgetPeriodPrefixVal == "0") {
            result = true;
        } else if(edtBudgetPeriodPrefixVal == "ГД"){
            if ((bb == '00') && (cccc > 1000) && (cccc < 10000)){
                result = true;
            }
        } else if(edtBudgetPeriodPrefixVal == "ПЛ"){
            if(((bb == '01')||(bb == '02')) && (cccc > 1000) && (cccc < 10000)){
                result = true;
            }
        } else if(edtBudgetPeriodPrefixVal == "КВ"){
            if((bb > 0) && (bb <= 4) && (cccc > 1000) && (cccc < 10000)){
                result = true;
            }
        } else if(edtBudgetPeriodPrefixVal == "МС"){
            if((bb > 0) && (bb <= 12) && (cccc > 1000) && (cccc < 10000)){
                result = true;
            }
        }
    }
    return result;
}

/**
 * Отключаем обработку события onChange во время выполнения функции
 * @param callbackFunction
 * @private
 */
Client.Payment.PaymentOrderEdit._disableOnChange = function (callbackFunction) {
    var _isOnChangeEnabledValue = this.isOnChangeEnabled;
    this.isOnChangeEnabled = false;
    callbackFunction();
    this.isOnChangeEnabled = _isOnChangeEnabledValue;
}
//Получить адрес клиента
Client.Payment.PaymentOrderEdit.getClientAddress = function (pinEq) {

    if (pinEq) {
        var params = getNewMap();
        params.put('pinEq', pinEq);
        var me = this;
        this.serviceGetClientAdderss.call(params, function(inArr){
            var postIndex = inArr.get('postIndex');
            var country = inArr.get('regCountry');
            var city = inArr.get('regCity');
            var street = inArr.get('regStreet');
            var MAX_ADDR_LEN = 161;
            me.clearPayerAddress();
            //var tempAddres = lblPayerNameValue.getValue();

            var tempAddres = me.payerName;
            if ((tempAddres + ' //' + street + '//').length < MAX_ADDR_LEN) {
                me.payerAddress = ' //' + street;
                if ((tempAddres + ' ' + city + '//').length < MAX_ADDR_LEN) {
                    tempAddres = tempAddres + ' ' + city;
                    if ((tempAddres + ' ' + country + '//').length < MAX_ADDR_LEN) {
                        tempAddres = tempAddres + ' ' + country;
                        if ((tempAddres + ' ' + postIndex  + '//').length < MAX_ADDR_LEN) {
                            tempAddres = tempAddres + ' ' + postIndex;
                        }
                    }
                }
            } else {
                tempAddres = ' //' + street.substr(0, 15);
            }
            tempAddres += '//';
            me.payerAddress = tempAddres;
            me.populateClientAddress(payerAddress);
        }, true);
    }
}

//Записать адрес клиента в поле с именем
Client.Payment.PaymentOrderEdit.populateClientAddress = function (clientAddress){
    this.lblPayerNameValue.setValue(this.payerName + this.clientAddress);
    this.payerName = this.payerName + this.clientAddress;
}

//Проверка необходимости включения адреса в наименование платежа
Client.Payment.PaymentOrderEdit.checkAccountToNonResAccGroup = function () {
    var checkSum = this.edtPaymentAmountValue.getText();
    var payerAccount = AccountUtils.unmaskAccount(this.cmbPayerAccountNumber.getValue());
    var recipientAccount = AccountUtils.unmaskAccount(this.edtRecipientAccountNumber.getText());
    var pinEq = this.edtPayerSelectName.getValue();

    if (((checkSum * 1) > this.minSumRUR) && (payerAccount.length > 0) && (recipientAccount.length > 0) && (pinEq.length > 0)) {
        var params = getNewMap();
        params.put('recipientAccount', recipientAccount);
        params.put('payerAccount', payerAccount);
        params.put('pinEq', pinEq);
        this.serviceCheckAccountToNonResAccGroup.call(params, function (inArr) {
            if (inArr.get('Result') != null) {
                Client.Payment.PaymentOrderEdit.getClientAddress(pinEq); // TODO Вохможно адрес лежит в Result, стоит отказаться от getClientAddress
            } else {
                Client.Payment.PaymentOrderEdit.clearPayerAddress();
            }
        });
    } else {
        this.clearPayerAddress();
    }
}

//Очистка адреса плательщика
Client.Payment.PaymentOrderEdit.clearPayerAddress = function () {
    if (this.payerAddress.length > 0) {
        this.payerName = this.payerName.replace(this.payerAddress, '');
        this.lblPayerNameValue.setValue(this.payerName);  
        this.payerAddress = '';
    }
}

//Нахождение минимальной суммы  для включения адреса в наименование платежа
Client.Payment.PaymentOrderEdit.getMinSum = function () {
    var minSum = 0;
    var params = getNewMap();
    params.put('name', 'minSumRUR');
    this.serviceGetMinSumSettings.call(params, function (inArr){
        Client.Payment.PaymentOrderEdit.minSumRUR = inArr.get('Result').get('value') * 1;
    });
}

Client.Payment.PaymentOrderEdit.removeStarsFromElements = function () {
    this._disableOnChange(function() {
        var budgetPaymentFlag = this.chbBudgetPaymentFlag.getValue(); // Сохраняем значение флажка бюджетного платежа
        var chosenPriorityValue = this.cmbPriorityValue.getValue();
        this.removeStarsFromElement(this.edtBudgetOkato);
        this.removeStarsFromElement(this.edtBudgetPaymentType);
        this.removeStarsFromElement(this.edtBudgetDocDate);
        this.removeStarsFromElement(this.edtBudgetKbk);
        this.removeStarsFromElement(this.edtPaymentNumber);
        this.removeStarsFromElement(this.edtTemplateSelect);
        this.removeStarsFromElement(this.edtRecipientKpp);
        this.removeStarsFromElement(this.edtBudgetDocNum);
        this.removeStarsFromElement(this.edtBudgetStatusValue);
        this.removeStarsFromElement(this.edtBudgetBase);
        this.removeStarsFromElement(this.edtBudgetPeriodValue);
        this.removeStarsFromElement(this.edtBudgetPeriod);
        this.removeStarsFromElement(this.edtBudgetPeriodPrefix);
        this.removeStarsFromElement(this.memRecipientNameValue);
        this.removeStarsFromElement(this.memPaymentDetailsValue);
        this.removeStarsFromElement(this.memPaymentAdditionalInfo);
        this.budgetOkatoSearch.setValue(this.budgetOkatoSearch.getText().replace(/\*/g,' '));
        this.budgetKbkSearch.setValue(this.budgetKbkSearch.getText().replace(/\*/g,' '));
        this.chbBudgetPaymentFlag.setValue(this.budgetPaymentFlag);  // Восстанавливаем значение флажка бюджетного платежа
        this.cmbPriorityValue.selectByValue(chosenPriorityValue); // Восстанавливаем значение очередности платежа
    })
}

Client.Payment.PaymentOrderEdit.onClickViewPaymentReport = function () {
    sendForm('PAYMENT_REPORT_VIEW');
}

Client.Payment.PaymentOrderEdit.checkRegistryViewPermission = function (){
  var payRegisterID = getInputParams("payRegisterID");
  var payRegNumber = getInputParams("payRegNumber");

  if ((payRegisterID != null) && (payRegisterID != "")){
   var RegNumber = "Реестр № " + payRegNumber;
   setValue("frmPaymentOrderEdit.pnlTopMenu.lblRegistryLink", RegNumber);
   changeCoordX("frmPaymentOrderEdit.pnlTopMenu.lblPathSeparator2", 128);
   changeCoordX("frmPaymentOrderEdit.pnlTopMenu.lblFormName", 128);
   showElement("frmPaymentOrderEdit.pnlTopMenu.lblPathSeparatorReg");
   showElement("frmPaymentOrderEdit.pnlTopMenu.lblRegistryLink");
   showElement("frmPaymentOrderEdit.pnlTopMenu.lblPrintRegistryLink"); 
 
   hideElement("frmPaymentOrderEdit.pnlTopMenu.chbSendToday");
   hideElement("frmPaymentOrderEdit.pnlTopMenu.lblSendTodayWarning");
   hideElement("frmPaymentOrderEdit.pnlTopMenu.lblProcessDateTitle");
   hideElement("frmPaymentOrderEdit.pnlTopMenu.clnProcessDateValue"); 
   try {
    hideElement("frmPaymentOrderEdit.pnlSubscribers.rpnlSign");
   } catch(e) {}
   
   try {
    hideElement("frmPaymentOrderEdit.pnlSubscribers.rpnlSend");
   } catch(e) {}  
   
   var mlbMore = new TWMultiButtonWrapper('frmPaymentOrderEdit.pnlBottomButtons2.mlbMore');
   this.mlbMore.removeItem('SEND_BANK');
   
   var lblPayerSelect = new TWLabelWrapper("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.pnlPayerHeader.lblPayerSelect");
   applyMixin(EnableDisableLinkMixin, lblPayerSelect);
   this.lblPayerSelect.disable();
  
  var clientId = getInputParams("clientId");

  if (hasClientPermission(this.userContext, "PAYMENT_REGISTER_VIEW", clientId)){
    hideElement("frmPaymentOrderEdit.pnlTopMenu.lblRegistryLinkDis");
    showElement("frmPaymentOrderEdit.pnlTopMenu.lblRegistryLink");
    hideElement("frmPaymentOrderEdit.pnlTopMenu.lblPrintRegistryLinkDis");
    showElement("frmPaymentOrderEdit.pnlTopMenu.lblPrintRegistryLink");
    } else {
        showElement("frmPaymentOrderEdit.pnlTopMenu.lblRegistryLinkDis");
        hideElement("frmPaymentOrderEdit.pnlTopMenu.lblRegistryLink");
        showElement("frmPaymentOrderEdit.pnlTopMenu.lblPrintRegistryLinkDis");
        hideElement("frmPaymentOrderEdit.pnlTopMenu.lblPrintRegistryLink");
        }       
   }
}

Client.Payment.PaymentOrderEdit.ifInRegistry = function (){
 var payRegisterID = getInputParams("payRegisterID"); 
 if ((payRegisterID != null) && (payRegisterID != "")){
  var PayerKppValue = getComboOptions("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerKppValue");
  var PayerAccountNumber = getComboOptions("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerAccountNumber");
 
   if (PayerKppValue){
    if (PayerKppValue.size() == 2){
     setComboOptionByIndex("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerKppValue", 1);
     disableElement("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerKppValue");
     }
    } 
    
   if (PayerAccountNumber){
    if (PayerAccountNumber.size() == 1){
     setComboOptionByIndex("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerAccountNumber", 0);
     disableElement("frmPaymentOrderEdit.pnlPaymentOrder.pnlPayerInfo.cmbPayerAccountNumber");
     }
    } 
  } 
}

Client.Payment.PaymentOrderEdit.EnableDisableLinkMixin = function () {
    var oldEnableFunction = this.enable;
    var oldDisableFunction = this.disable;  
    
    this.enable = function() {
        oldEnableFunction();
        this.removeClass("disabled_link");
        this.addClass("normal_link");
    }
    
    this.disable = function() {
        oldDisableFunction();
        this.removeClass("normal_link");
        this.addClass("disabled_link");
    }
}

Client.Payment.PaymentOrderEdit.applyMixin = function (mixin) {
    for (var i = 1; i < arguments.length; i++) {
        mixin.call(arguments[i]);
    }
}


Client.Payment.PaymentOrderEdit.checkRecepientAccountMatchBIC = function () {
    if(Client.Payment.Common.isRasAccountValid(this.edtRecipientAccountNumber, this.edtRecipientBankBic, "", [])){
        this.edtRecipientAccountNumber.setError(false);
        this.wrnRecepientAccountNumber.hide();
    } else {
        this.wrnRecepientAccountNumber.show();
    }
}

Client.Payment.PaymentOrderEdit.setValidClientId = function (clientId) {
    var id = clientId == 0 ? "0" : clientId;
    this.edtPayerSelectId.setValue(id);
}

// для IE<9 изменение значения
Client.Payment.PaymentOrderEdit.cutElementLength = function (srcEl, len) {  
    thisVal = srcEl.value;    
    if (thisVal.length > len) {
        srcEl.value = thisVal.substring(0, len);
    }
}
