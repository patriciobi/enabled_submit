(function(global) {
  var server = "https://app.beetrack.cl/";
  //var server = "http://localhost:3000/";
  //var server = "https://staging.beetrack.com/";

  var widgetId = "widget-";
  var widgetParentId = 'beetrack_widget';

  function load(){
    if(!global.BeetrackWidgetData) {
      global.BeetrackWidgetData = {};
    }
    else {
      return;
    }
    var BeetrackWidgetData = global.BeetrackWidgetData;
    if(!BeetrackWidgetData.styleTags) { BeetrackWidgetData.styleTags = []; }

    create_style_tag(BeetrackWidgetData.styleTags);

    create_recaptcha_head();

    if (!get_params_data())
      return;

    create_translations();

    fill_widget_div();

    document.getElementById('submit').disabled = true;

    set_window_event();

  }

  function create_recaptcha_head () {
    var captcha =  document.createElement('script');
    captcha.src = 'https://www.google.com/recaptcha/api.js'
  
    document.getElementsByTagName('head')[0].appendChild(captcha);
  }

  function create_style_tag (styleTags) {
    //Add style tag for widget
    if(styleTags.length === 0) {
      //Add a style tag to the head
      var styleTag = document.createElement("link");
      styleTag.rel = "stylesheet";
      styleTag.type = "text/css";
      styleTag.href =  server + "javascript_widget/beetrack_widget.css";
      styleTag.media = "all";

      var styleFont = document.createElement("link");
      styleFont.rel = "stylesheet";
      styleFont.type = "text/css";
      styleFont.href =  'https://fonts.googleapis.com/css?family=Open+Sans';

      document.getElementsByTagName('head')[0].appendChild(styleFont);
      document.getElementsByTagName('head')[0].appendChild(styleTag);
      styleTags.push(styleTag);
    }
  }

  function get_params_data () {
    var BeetrackWidgetData = global.BeetrackWidgetData;
    BeetrackWidgetData.lang = document.getElementById(widgetParentId).getAttribute("lang");
    BeetrackWidgetData.apikey = document.getElementById(widgetParentId).getAttribute("api-key");
    if(!BeetrackWidgetData.lang || !BeetrackWidgetData.apikey)
      return false;
    return true;
  }

  function create_translations () {
    var BeetrackWidgetData = global.BeetrackWidgetData;
    if(!BeetrackWidgetData.translations) { BeetrackWidgetData.translations = {}; }
    var Translations = BeetrackWidgetData.translations;
    switch(BeetrackWidgetData.lang) {
      case "es":
        Translations.title = "Seguimiento de Despachos";
        Translations.dispatch_tracking_verify = "Buscar";
        break;
      default:
        //English default
        Translations.title = "Order Tracking";
        Translations.dispatch_tracking_verify = "Search";
        break;
    }
  }

  function fill_widget_div () {
    var BeetrackWidgetData = global.BeetrackWidgetData;
    widgetId += BeetrackWidgetData.apikey;
    //Create widget div
    var div_options = [['id', widgetId],['class', 'widget cleanslate']];
    if (!!BeetrackData.theme && !!BeetrackData.theme.background) {
      div_options.push(['style', 'background-color: ' + BeetrackData.theme.background + ' !important']);
    }
    var div = set_node(null, 'div', div_options);
    //Create form
    var form = set_node(div, 'form', [['id', "form_" + widgetId],
      ['accept-charset', 'utf-8'],
      ['target', 'guide_form_window'],
      ['method', 'POST'],
      ['action', server + 'widget/' + BeetrackWidgetData.apikey]]);

    var captcha = set_node(form, 'div', [['class','g-recaptcha'],['data-sitekey','6Ldq1rIUAAAAAOJr8wXcD_ZbAslwIOMhfhAq3dGJ'],['data-callback','enabled_submit']]);

    var fieldset = set_node(form, 'fieldset', null);
    //Logo
    var divLogo = set_node(fieldset, 'div', [['class', 'logo']]);
    var h = set_node(divLogo, 'h1');

    var title = BeetrackWidgetData.translations.title;
    if (!!BeetrackData.title) {
      title = BeetrackData.title[BeetrackWidgetData.lang];
    }

    var t = document.createTextNode( title );
    h.appendChild(t);

    //Inputs
    var divInput = set_node(fieldset, 'div', [['class','form-input']]);

    var ident = set_node(divInput, 'input', [['type','text'],
      ['id', 'beetrack_widget_input'],
      ['name', 'search'],
      ['class', 'text_input'],
      ['placeholder', BeetrackData.placeholder[BeetrackWidgetData.lang]]]);

    var btn_options = [['type', 'submit'],['id','submit'],['class', 'submit'],['value', BeetrackWidgetData.translations.dispatch_tracking_verify]];
    if (!!BeetrackData.theme && !!BeetrackData.theme.button) {
      btn_options.push(['style', 'background-color: ' + BeetrackData.theme.button + ' !important; border: 1px solid ' + BeetrackData.theme.button + ' !important; border-left: none !important;']);
    }
    var submit = set_node(divInput, 'input', btn_options);

    //Bottom
    var divBottom = set_node(fieldset, 'div', [['class', 'form-footer']]);
    var textSpan = set_node(divBottom, 'span', [['class', 'text-footer']]);
    var imgSpan = set_node(divBottom, 'span', [['class', 'img-footer']]);
    var imgLink = set_node(imgSpan, 'a', [['href', 'https://www.beetrack.com'], ['target', '_blank']]);
    var imgLogo = set_node(imgLink, 'img', [['src', 'https://s3.amazonaws.com/beetrack/static/beetrack_logo_widget.png']]);

    var t2 = document.createTextNode("\u00A9 Powered by ");
    textSpan.appendChild(t2);

    // definir

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://somedomain.com/somescript";

    document.getElementsByTagName('head')[0].appendChild();

    document.getElementById(widgetParentId).appendChild(div);
  }

  function set_node (parent, node_type, attributes) {
    var node = document.createElement(node_type);
    if(!!attributes){
      for (var i = 0; i < attributes.length; i++) {
        node.setAttribute(attributes[i][0], attributes[i][1]);
      }
    }
    if(!!parent){
      parent.appendChild(node);
    }
    return node;
  }

  function set_window_event () {
    document.getElementById("form_" + widgetId).addEventListener("submit", function(e) {
        widgetWindow = window.open("","guide_form_window","scrollbars=1,titlebar=0,location=0,status=0,resizable=1,width=650,height=700,menubar=0,left=" + parseInt((screen.availWidth/2) - (618/2)) + ",top=" + parseInt((screen.availHeight/2) - (530/2)));
        widgetWindow.focus();
        widgetWindow.onbeforeunload = function(){
          document.getElementById("beetrack_widget_input").value = "";
        };
    });
  }

  if (window.attachEvent)
    window.attachEvent('onload', load);
  else
    window.addEventListener('load', load, false);
})(this);
