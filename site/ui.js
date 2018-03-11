(function() {
    var uiExt = {
        func: {
            step1: function() {
                $$('pages').setValue('step1');
            },
            step2: function() {
                var original = $$('original').getValue();
                $$('textForTranslate').setValues({
                    original: original
                });
                $$('pages').setValue('step2');
            },
            step3: function() {
                var html = webix.html.getValue('text-for-translate');
                $$('result').setValue(html);
                $$('pages').setValue('step3');
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