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









var example = waject();
var stats = {};
example.on('get', result => {
    let prop = result.key;
    if (prop in stats) {
        stats[prop] += 1;
    } else {
        stats[prop] = 1;
    }
});

example.on('get', 'favorite', result => {
    if ('favorite' in stats) {
        delete stats.favorite;
    }
});

example.on('get', 'favorite', result => {
    let s = Object.keys(stats);
    console.log(s);
    if (s.length === 0) {
        result.value = undefined;
        return;
    }
    result.value = Object.keys(stats).reduce((biggest, current) => {
        console.log(biggest, stats[biggest]);
        console.log(current, stats[current]);
        return stats[biggest] > stats[current] ? biggest : current;
    });
});

example.on('get', 'favorite', result => {
    console.log("Asking for favorite..", result);
});

example.fruit;
example.fruit;
example.sport;
example.favorite;
example.sport;
example.favorite;
example.sport;
example.favorite;