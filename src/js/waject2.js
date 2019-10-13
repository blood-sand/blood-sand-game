if (typeof window !== "undefined") {
    window.waject = waject;
} else if (typeof module !== "undefined") {
    module.exports = waject;
}

function waject (o = {}) {
    let listeners = {
        getters: {
            "*": []
        },
        setters: {
            "*": []
        }
    };
    function handleOn(e, prop, fn) {
        let group;
        if (e === "get") {
            group = "getters";
        } else if (e === "set") {
            group = "setters";
        }

        if (typeof prop === "function") {
            fn = prop;
            prop = "*";
        }

        if (!(prop in listeners[group])) {
            listeners[group][prop] = [];
        }
        listeners[group][prop].push(fn);
    }

    function handleBindInput(
            prop, 
            element, 
            event='change',
            inHandler=(element, p, prop) => {
                p[prop] = $(element).val();
            },
            outHandler=(element, val) => {
                $(element).val(val);
            }) {
        if (typeof prop === "object") {
            element = prop.element;
            event = prop.event || event;
            inHandler = prop.inHandler || inHandler;
            outHandler = prop.outHandler || outHandler;
            prop = prop.property;
        }
        $(element).on(event, () => 
            inHandler(element, p, prop));
        p.on('set', prop, (target, prop, val) => 
            outHandler(element, val));
        outHandler(element, o[prop]);
    }

    let p = new Proxy(o, {
        has (target, key) {
            return (
                target.hasOwnProperty(key) && 
                target.propertyIsEnumerable(key)
            );
        },
        get (target, key, receiver) {
            if (key === "on") {
                return handleOn;
            }
            if (key === "bindInput") {
                return handleBindInput;
            }
            if (key === "*") {
                for (let prop in target) {
                    if (target.hasOwnProperty(prop)) {
                        // force getter:
                        receiver[prop];
                    }
                }
                return target;
            }
            if (key in listeners.getters) {
                for (let i = 0; i < listeners.getters[key].length; i += 1) {
                    let alternate = listeners.getters[key][i](...arguments);
                    if (alternate !== target[key]) {
                        return alternate;
                    }
                }
            }
            for (let i = 0; i < listeners.getters["*"].length; i += 1) {
                let alternate = listeners.getters["*"][i](...arguments);
                if (alternate !== target["*"]) {
                    return alternate;
                }
            }
            return Reflect.get(...arguments);
        },
        set (target, key, value, receiver) {
            let oldVal = target[key];
            let ignoreDefault = false;
            let cycle = true;

            if (key === "on") {
                console.log("Cannot set 'on' property of Waject.");
                return false;
            }
            if (key === "*") {
                if (typeof value === "object") {
                    let isCompatible = true;
                    for (let prop in value) {
                        if (!target.hasOwnProperty(prop)) {
                            isCompatible = false;
                            break;
                        }
                    }
                    
                    if (isCompatible) {
                        for (let prop in value) {
                            receiver[prop] = value[prop];
                        }
                        return target;
                    }
                }
                for (let prop in target) {
                    if (target.hasOwnProperty(prop)) {
                        receiver[prop] = value;
                    }
                }
                return target;
            }

            if (key in listeners.setters) {
                listeners.setters[key].
                    forEach(fn => {
                        if (!cycle) {
                            return;
                        }
                        let result = fn(target, key, value);

                        if (result === true) {
                            ignoreDefault = true;
                        }

                        if (result === false) {
                            cycle = false;
                        }

                        if (oldVal !== target[key]) {
                            value = target[key];
                        }
                    });
            }

            listeners.setters["*"].
                forEach(fn => {
                    if (!cycle) {
                        return;
                    }
                    let result = fn(target, key, value);

                    if (result === true) {
                        ignoreDefault = true;
                    }
                    
                    if (oldVal !== target[key]) {
                        value = target[key];
                    }
                });

            if (!ignoreDefault && oldVal === target[key]) {
                target[key] = value;
            }

            return target[key];
        }
    });
    return p;
}