const self = this;

let path = window.location.pathname;
let hash = window.location.hash;
let search = window.location.search;

let eventLoop = self.share.eventLoop;

self.share.query = new Proxy(
    parseQueryString(search), 
    {
        get (o, name) {
            if (name === "string") {
                return packQuery(o);
            }
            return o[name];
        },
        set (o, name, val) {
            if (name === "string") {
                let q = parseQueryString(val);
                for (let name in o) {
                    delete o[name];
                }
                for (let name in q) {
                    o[name] = q[name];
                }
            } else if (o[name] === val) {
                return val;
            } else {
                o[name] = val;
            }
            let search = packQuery(o);
            window.history.pushState(null, "", path + search + hash);
            console.log('query change:', search);
            return true;
        },
        deleteProperty (o, name) {
            delete o[name];
            let search = packQuery(o);
            window.history.pushState(null, "", path + search + hash);
            console.log('query change:', search);
            return true;
        }
    }
);

function encode (str) {
    return encodeURIComponent(("" + str).replace(/\s/g, '+'));
}

function decode (str) {
    return decodeURIComponent(("" + str).replace(/\+/g, ' '));
}

function parseQueryString (query) {
    let result = {}
    if (query) {
        if (/^[?#]/.test(query)) {
            query = query.substr(1);
        }
        result = query.split('&').
                reduce((result, param) => {
                    let [key, value] = param.split('=');
                    if (value !== undefined) {
                        result[key] = decode(value);
                    } else {
                        result[key] = '';
                    }
                    if (result[key] === "true") {
                        result[key] = true;
                    }
                    if (result[key] === "false") {
                        result[key] = false;
                    }
                    return result;
                }, result);
    }
    return result;
};

function packQuery () {
    let result = "?";
    for (let name in self.share.query) {
        if (name === "toString") {
            continue;
        }
        let value = self.share.query[name];
        result += `${encode(name)}=${encode(value)}&`;
    }
    return result.substr(0, result.length - 1);
}

function handleNavigation () {
    path = window.location.pathname;
    hash = window.location.hash;
    search = window.location.search;
    let query = self.share.query;

    console.log(path, query, hash);
    $('#navigation li').removeClass('selected');

    if (path.substring(1,10) === "gladiator") {
        $('#navigation li.gladiator').addClass('selected');
    }
    if (query.settings) {
        $('#navigation li.settings').addClass('selected');
    }

    if (hash === "") {
        window.history.replaceState(null, "", path + search);
    }
}

eventLoop.when(
    () => (
        window.location.pathname !== path ||
        window.location.hash !== hash ||
        window.location.search !== search
    ), 
    handleNavigation
);

self.share.eventLoop.on('master-sound', masterSound => {
    if (masterSound) {
        $('#navigation i.fa-volume-mute').
            removeClass('fa-volume-mute').
            addClass('fa-volume-up');
    } else {
        $('#navigation i.fa-volume-up').
            removeClass('fa-volume-up').
            addClass('fa-volume-mute');
    }
});

handleNavigation();

$(document).on('click', ':not(a,link)[href]', function (e) {
    let p = path;
    let s = self.share.query.string;
    let h = hash;

    let href = $(this).attr('href');

    e.preventDefault();
    if (href[0] === "#") {
        h = href;
    } else if (href[0] === "?") {
        self.share.query.string = href;
        return;
    }  else if (href[0] === "&") {
        if (self.share.query.string.length === 0) {
            href = href.replace('&', '?');
        }
        self.share.query.string += href;
        return;
    } else {
        p = href;
    }
    let target = p + s + h;
    window.history.pushState(null, "", target);
});
