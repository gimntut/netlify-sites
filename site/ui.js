(function() {
    var uiExt = {
        func: {
            products: function(){
                webix.alert('Ok');
            }
        }
    };

    function init() {
        var uiAsText = webix.html.getValue('ui');
        var uiObj = jsyaml.load(uiAsText);
        var ui = webix.uiPrepare(uiObj, uiExt);
        webix.ui(ui);
    }
    webix.ready(init);
})()