/* https://github.com/s-p-n/Waject */
window.waject = function(o, Preset, Got) {
    "use strict";
    o = Object.create(o || null);
    var item, Main = {}, $ = function (property, value) {
        Object.defineProperty(Main, property, {value: value, enumerable: false});
    };
    $('mk', function (props, val, preset, got) {
        var nil = function () {}, prop = (
            props.property || props
        );
        Object.defineProperty(Main, prop, {
            get: function () {
                if ((props.got
                 || got
                 || Got
                 || nil
                )(o, prop) !== false) {
                    return o[prop];
                }
            },
            set: function (value) {
                if((props.preset
                 || preset
                 || Preset
                 || nil
                )(o, prop, value) !== false) {
                    return o[prop] = value;
                }
            },
            configurable: true,
            enumerable: true
        });
        if (props.value === undefined) {
            if (val !== undefined) {
                o[prop] = val;
            } else {
                o[prop] = undefined;
            }
        } else {
            o[prop] = props.value;
        }
    });
    $('toString', function () {
        return JSON.stringify(o, null, '\t');
    });
    for (item in o) {
        if (typeof o[item] === "object") {
            Main.mk(item, waject(o[item], Preset, Got));
        } else {
            Main.mk(item, o[item]);
        }
    }
    o.toString = Main.toString;
    return Main;
};