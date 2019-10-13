let waject = require('./waject2');

let state = waject();

state.on('set', (target, prop, val) => {
    console.log("set", prop, "to", val);
    return val;
});

state.on('get', (target, prop) => {
    console.log("get", prop, "which is", target[prop]);
    return target[prop];
});

state.foo = "bar";
state.bar = "baz";
state.baz = "qux";

console.log(state["*"]);

state["*"] = 10;
console.log(state["*"]);


state.on('set', "food", (target, prop, val) => {
    if (typeof val !== "number") {
        console.log("food must be set to a number, but got:", typeof val, val);
        if (prop in target) {
            console.log("Setting food to", target[prop]);
            return target[prop];
        } else {
            console.log("Setting food to 0");
            return target[prop] = 0;
        }
    }
    return val;
});

state.food = "none";

console.log(state.food);

state['*'] = {
    foo: 1,
    bar: 2,
    baz: 3
};

console.log(state['*'])