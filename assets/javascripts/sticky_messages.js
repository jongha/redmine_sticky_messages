var StickyMessagesCookie = {
    __set: function(key, values) {
        "use strict";

        var val = "", i;
        if(values instanceof Array) {
            for(i in values) {
                if(values.hasOwnProperty(i)) {
                    if(val !== "") { val += "|"; }
                    val += encodeURIComponent(values[i]);
                }
            }
        }else {
            val = values;
        }

        var expire = new Date();
        expire.setDate(expire.getDate() + 1); // for 1 day.
        document.cookie = (key + '=' + val + "; path=/");
    },
    _empty: function() {
        "use strict";
        var cookies = document.cookie.split(";");
        var i;
        for (i=0; i<cookies.length; i++) {
            var c = cookies[i];
            var pos = c.indexOf("=");
            var name = pos > -1 ? c.substr(0, pos) : c;

            document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    },
    _set: function(key, value) {
        "use strict";

        this.__set(key, value);
    },
    _get: function(key) {
        "use strict";

        key = key + "=";
        var c = document.cookie;
        var start = c.indexOf(key);
        var val = "";

        if(start !== -1) {
            start += key.length;
            var end = c.indexOf(";", start);
            if(end === -1) { end = c.length; }

            val = c.substring(start, end);
        }
        return decodeURIComponent(val);
    },
    _dispatcher: function(options) {
        "use strict";

        return this["_" + options.type](options.key, options.data);
    }
};


$(document).ready(function() {
    $.noty.defaults = {
        layout: 'bottomRight',
        theme: 'defaultTheme',
        type: 'warning',
        text: '',
        dismissQueue: false, // If you want to use queue feature set this true
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 200 // opening & closing animation speed
        },
        timeout: true, // delay for closing event. Set false for sticky notifications
        force: false, // adds notification to the beginning of queue when set to true
        modal: false,
        maxVisible: 5, // you can set max visible notification for dismissQueue true option,
        killer: false, // for close all notifications before show
        closeWith: ['click'], // ['click', 'button', 'hover']
        callback: {
            onShow: function() {},
            afterShow: function() {},
            onClose: function() {},
            afterClose: function() {}
        },
        buttons: [
            {
                addClass: 'btn btn-danger', text: $("#_sticky_messages-ok").text(), onClick: function($noty) {
                    StickyMessagesCookie._dispatcher({ type: "set", key: "_sticky_messages-off", data: "1" });
                    $noty.close();
                }
            }
        ]
    };
    
    if($('._sticky_messages').length > 0 && StickyMessagesCookie._dispatcher({ type: "get", key: "_sticky_messages-off" }) !== "1") {
        noty({ text: $($('._sticky_messages')[0]).clone().show()[0].outerHTML });
    };
});