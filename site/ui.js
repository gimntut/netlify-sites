(function() {
    var url = '';
    var token = '';
    var ui_obj = null;
    var billing_ajax = null;
    var paraClient = null;

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
                        return billing_ajax.get(url + '/api/products/partner/main/').then(getResults);
                    });
                $$('tariffs').clearAll();
            },
            visitor: function() {
                // inputNumber.show();
            },
            start: function() {
                $$('pages').setValue('start');
                var ParaClient = require('para-client-js');
                paraClient = new ParaClient('app:gimntut', '2vw6IlOqja9oKOAwbPGwCgzXQgVK9bh0sPwhx3XIe5fY1CL3gM9pXQ==');
                paraClient.read()
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
                    return billing_ajax.post(url + '/api/basket/add-product/', {
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
                    return billing_ajax.post(url + '/api/checkout/', {
                        basket: basket.url,
                    }).then(getData);
                });
                $$('pages').setValue('checkoutPage');
            },
            payment: function(view, ev) {
                var order = $$('order').getValues();
                var card = $$('card').getValues();
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
                };
                webix.ajax().headers({
                    "Authorization": 'Token ' + token,
                }).post(url + order.payment_url, data, function() {
                    $$('links').setValues({ url: url });
                    $$('pages').setValue('links');
                });
                $$('pages').setValue('loading');
            },
            changeInput: function(newv, oldv) {
                var name = this.config.id;
                webix.storage.local.put(name, newv);
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
        billing_ajax = webix.ajax().headers({
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