(function() {
    var url = '';
    var token = '';
    var ui_obj = null;
    var ajax = null;

    function getResults(data) {
        return data.json().results;
    }

    function getData(data) {
        return data.json();
    }

    var uiExt = {
        func: {
            products: function() {
                $$('products').load(
                    function() {
                        return ajax.get(url + '/api/products/partner/main/').then(getResults);
                    });
                $$('tariffs').clearAll();
            },
            visitor: function() {
                // inputNumber.show();
            },
            start: function() {
                $$('pages').setValue('start');
                setToken($$('token').getValue(token));
                webix.storage.local.put('token', token);
            },
            afterLoad: function() {
                $$('pages').setValue('productsPage');
            },
            changePage: function(prevID, nextID) {
                $$(nextID).resize();
            },
            selectProduct: function(selection, preserve) {
                var tariffs = this.getItem(selection.id).tariffs;
                var t = $$('tariffs');
                t.clearAll();
                t.parse(tariffs);
            },
            settings: function() {
                $$('pages').setValue('settings');
            },
            home: function() {
                $$('pages').setValue('start');
            },
            clickAddToBasket: function(event, cell) {
                var tariff = this.getItem(cell.row);
                $$('basket').load(function() {
                    return ajax.post(url + '/api/basket/add-product/', {
                        url: tariff.url,
                        quantity: 1
                    }).then(getData);
                });
                $$('pages').setValue('basket');
            },
            clickProductInfo: function() {},
            clickCheckout: function() {
                var basket = this.getValues();
                $$('order').load(function() {
                    return ajax.post(url + '/api/checkout/', {
                        basket: basket.url,
                    }).then(getData);
                });
                $$('pages').setValue('checkoutPage');
            },
            payment: function(view, ev) {
                var order = $$('order').getValues();
                var card = this.getValues();
                card.expiry_year = '20' + card.expiry_year
                var data = {
                    "total": order.total_incl_tax,
                    "payment_method": "yakassa",
                    "payment_details": {
                        "save_payment_method": true,
                        "payment_method_data": {
                            "type": "bank_card",
                            "card": card
                        }
                    }
                }
                webix.ajax().headers({
                    "Authorization": 'Token ' + token,
                }).post(url + order.payment_url, data, function() {
                    $$('links').setValues({ url: url });
                    $$('pages').setValue('links');
                });
                $$('pages').setValue('loading');
            },
            changeUrl: function(newv, oldv) {
                url = newv.replace(/\/$/, '');
                webix.storage.local.put('url', url);
                $$('tokenAdmin').setValues({ url: url });
            }
        }
    };

    function setToken(newToken) {
        token = newToken;
        ajax = webix.ajax().headers({
            "Authorization": 'Token ' + token,
            "Content-type": "application/json"
        });
    }

    function init() {
        url = webix.storage.local.get('url');
        setToken(webix.storage.local.get('token'));
        var uiAsText = webix.html.getValue('ui');
        var uiObj = jsyaml.load(uiAsText);
        var ui = webix.uiPrepare(uiObj, uiExt);
        ui_obj = webix.ui(ui);
        webix.history.track("pages");
        if (token) {
            $$('pages').setValue('start');
        } else {
            $$('pages').setValue('settings');
        }
        $$('url').setValue(url);
        $$('token').setValue(token);
        window.onresize = function() {
            ui_obj.resize();
        };
    }
    webix.ready(init);
})()