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