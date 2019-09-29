const self = this;

const catcher = function (o, prop, val) {
    console.log(prop, "changed from", o[prop], "to", val);
    if (val !== o[prop]) {
        o[prop] = val;
    }
    self.share[prop] = o[prop];
    $(`[name="${prop}"]`).val(o[prop]);
    return false;
}

self.state.mk({
    property: 'culture',
    value: self.share.culture,
    preset: catcher
});

self.state.mk({
    property: 'sex',
    value: self.share.sex,
    preset: catcher
});

self.state.mk({
    property: 'requestBiometrics',
    value: false,
    preset: (o, prop, val) => {
        if (val) {
            console.log("requesting biometrics..");
            socket.emit("gladiator-biometrics-generate");
            return false;
        }
    }
})

let biometricLabels = [
    "rank",
    "age",
    "weight",
    "height",
    "bmi",
    "reach"
];

self.state.biometrics = {
    rank: 0,
    age: 0,
    weight: 0,
    height: 0,
    bmi: 0,
    reach: 0
};

socket.on("gladiator-biometrics", data => {
    biometricLabels.forEach(name => {
        if (name in data) {
            let val = data[name];
            console.log(name, val)
            if (/\./.test("" + val)) {
                val = val.toFixed(2);
            }
            self.state.biometrics[name] = val;
            $(`[name="${name}"]`).val(val);
        }
    });
});

socket.emit("gladiator-biometrics-ready");
