if (typeof window !== "undefined") {
    window.waject = waject;
} else if (typeof module !== "undefined") {
    module.exports = waject;
}

function waject (o = {}) {
    if (!(this instanceof waject)) {
        return new waject(...arguments);
    }
    this.target = o;
    let listeners = this.listeners = {
        getters: {
            "*": []
        },
        setters: {
            "*": []
        }
    };
    let extensions = {};

    for (let name in this.constructor.extensions) {
        extensions[name] = this.constructor.extensions[name].bind(this);
    }

    function createResult (target, key, value, receiver) {
        let result = {value};
        Object.defineProperty(result, 'key', {
            value: key,
            configurable: false,
            writable: false,
            enumerable: true
        });
        Object.defineProperty(result, 'target', {
            value: target,
            configurable: false,
            writable: false,
            enumerable: true
        });
        Object.defineProperty(result, 'receiver', {
            value: receiver,
            configurable: false,
            writable: false,
            enumerable: true
        });
        return result;
    }

    this.proxy = new Proxy(o, {
        has (target, key) {
            return (
                target.hasOwnProperty(key) && 
                target.propertyIsEnumerable(key)
            );
        },
        get (target, key, receiver) {
            if (key in extensions) {
                return extensions[key];
            }
            
            if (key === "*") {
                let copy = {};
                for (let prop in target) {
                    if (target.hasOwnProperty(prop)) {
                        copy[prop] = receiver[prop];
                    }
                }
                return copy;
            }

            let result = createResult(target, key, target[key], receiver);
            if (key in listeners.getters) {
                listeners.getters[key].forEach(fn => fn(result));
            }
            listeners.getters['*'].forEach(fn => fn(result));
            return result.value;
        },
        set (target, key, value, receiver) {
            if (key in extensions) {
                console.warn(`Waject: Ignoring set to '${key}' property, because it's an extension.`);
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

            let result = createResult(...arguments);
            result.cycle = true;

            if (key in listeners.setters) {
                listeners.setters[key].
                    forEach(fn => {
                        if (!result.cycle) {
                            return;
                        }
                        fn(result);
                    });
            }

            listeners.setters["*"].
                forEach(fn => {
                    if (!result.cycle) {
                        return;
                    }
                    fn(result);
                });
            target[key] = result.value;
            return target[key];
        }
    });
    return this.proxy;
}

waject.extensions = {};

waject.extend = function (interceptProp, handler) {
    this.extensions[interceptProp] = handler;
};

waject.extend('on', function (e, prop, fn) {
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

    if (!(prop in this.listeners[group])) {
        this.listeners[group][prop] = [];
    }
    this.listeners[group][prop].push(fn);
});
