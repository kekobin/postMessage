(function (global, factory) {
    if ( typeof define === 'function' && define.amd) {
        define(['jquery'], factory)
    } else {
        global.simpleMessenger = factory(jQuery)
    }
}(this, function($){

    var events = {}

    if ('postMessage' in window){
        if ('addEventListener' in document) {
            window.addEventListener('message', function(msg){
                if ( /huya\.com$/.test(msg.origin) ) {
                    messageCallback.call(this, msg.data)
                }
            }, false)
        } else if ('attachEvent' in document) {
            window.attachEvent('onmessage', function(msg){
                if ( /huya\.com$/.test(msg.origin) ) {
                    messageCallback.call(this, msg.data)
                }
            })
        }
    } else {
        // 兼容IE 6/7
        var _onmessage = window.navigator['onmessage']

        window.navigator['onmessage'] = function () {
            messageCallback.call(this, arguments)
            typeof _onmessage === 'function' && _onmessage.call(this, arguments)
        }
    }

    function messageCallback (data) {
        if (typeof data === 'string') {
            try {
                data = $.parseJSON(data)
            } catch (e) {}
        }

        if ( !$.isPlainObject(data) ) {
            try { console.log('\'data\' must be a json!') } catch (e) {}
            return
        }

        var callbacks = events[data.code];
        callbacks && callbacks.fire(data.data);
    }

    return {
        on: function(code, callback) {
            if (!events[code]) {
                events[code] = $.Callbacks()
            }

            events[code].add(callback)
        }
    }
}));