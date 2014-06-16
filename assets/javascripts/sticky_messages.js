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
        document.cookie = (key + '=' + val + "; path=/; expires=" + expire.toGMTString());
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
        dismissQueue: true, // If you want to use queue feature set this true
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 500 // opening & closing animation speed
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
        buttons: false
    };

    if($('._sticky_messages').length > 0) {

        var cookieKey = "_sticky_messages-dismiss";
        var i = 0;
        var len = $("._sticky_messages").length;
        var active = 0;


        var dismissButtonClick = function($noty) {
            var flag = StickyMessagesCookie._dispatcher({ type: "get", key: cookieKey });
            var nflag = parseInt($noty.options._flag);

            if(flag !== "") {
                nflag |= parseInt(flag);
            }

            StickyMessagesCookie._dispatcher({ type: "set", key: cookieKey, data: nflag });
            $noty.close();
        };

        var resetDismiss = function() {
            if(active === 0) {
                var obj = $(".sticky_message-area-reset");

                obj.show()
                    .find("button")
                    .unbind("click")
                    .bind("click", function() {
                        StickyMessagesCookie._dispatcher({ type: "set", key: cookieKey, data: 0 });

                        obj.hide();

                        showMessage(0);
                    }
                );
            }
        };

        var showMessage = function(i) {
            if(i === 0) { active = 0; }

            if(i < len) {
                var obj = $($("._sticky_messages")[i]);
                var _flag = obj.data("flag");
                var _list = [];

                var flag = StickyMessagesCookie._dispatcher({ type: "get", key: cookieKey });
                var nflag = !!!flag || flag === "" ? 0 : parseInt(flag);

                if((nflag & _flag) !== _flag) {
                    noty({
                        text: obj.clone().show()[0].outerHTML,
                        type: "warning",
                        _flag: _flag,
                        dismissQueue: i < (len - 1),
                        buttons: [
                            {
                                addClass: 'btn btn-danger',
                                text: $("#_sticky_messages-dismiss").text(),
                                onClick: dismissButtonClick
                            }
                        ],
                        callback: {
                            afterShow: function() {
                                setTimeout(function() { showMessage(++i); }, 1000);
                            },
                            afterClose: function() {
                                --active;

                                resetDismiss();
                            }
                        }
                        });

                    ++active;
                }else {
                    showMessage(++i);
                }
            }
        };

        showMessage(i);

        resetDismiss();
    };
});