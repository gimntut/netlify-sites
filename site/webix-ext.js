webix.yamlUiPrepare = function yamlUiPrepare(rawUi, uiExt) {
    var ui = jsyaml.load(rawUi);
    this.uiPrepare(ui, uiExt);
    return ui;
}

webix.uiPrepare = function(ui, uiExt) {
    gettext = gettext || function() { return s; };
    for (var key in ui) {
        var item = ui[key];
        if (typeof(item) == "object") {
            this.uiPrepare(item, uiExt);
        } else if (typeof(item) == "string") {
            var parts = item.split(':> ');
            if (parts.length > 1 && parts[0] in uiExt) {
                if (parts[1] in uiExt[parts[0]]) {
                    ui[key] = uiExt[parts[0]][parts[1]];
                } else {
                    console.error(parts[0] + ' "' + parts[1] + '" not found')
                }
            }
        }
    }
    return ui;
}

webix.DataDriver.apiJson = webix.copy(webix.DataDriver.json);

webix.DataDriver.apiJson.getRecords = function(data) {
    if (data && data.results) {
        data = data.results;
    }
    if (data && !webix.isArray(data)) {
        return [data];
    }
    return data;
}

var _gt = gettext || function() { return s; };
_strings_for_pseudo_gettext = {}

function _gettext(s) {
    _strings_for_pseudo_gettext[s] = _gt(s);
}