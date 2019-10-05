const self = this;

const catcher = function (o, prop, val) {
    if (val !== o[prop]) {
        o[prop] = val;
        socket.emit(`gladiator-${prop}`, val);
    }
    self.share[prop] = o[prop];
    $(`[name="${prop}"]`).val(o[prop]);
    if ($(`[name="${prop}"]`).is('select')) {
        $(`[name="${prop}"]`).selectric();
    }
    return false;
}

self.state.mk({
    property: 'culture', 
    value: $('[name="culture"]').val().toLowerCase(),
    preset: catcher
});

self.state.mk({
    property: 'sex', 
    value: $('[name="sex"]').val().toLowerCase(),
    preset: catcher
});

self.state.mk({
    property: 'name', 
    value: $('[name="name"]').val().toLowerCase(),
    preset: catcher
});

self.share.culture = self.state.culture;
self.share.sex = self.state.sex;
self.share.name = self.state.name;

socket.emit("gladiator-culture-ready");
socket.on("gladiator-names", d => {
    self.state.names = d;
});
socket.on("gladiator-name", d => {
    self.state.name = d;
});
socket.on("gladiator-sex", d => {
    self.state.sex = d;
});
socket.on("gladiator-culture", d => {
    self.state.culture = d;
});
socket.on("gladiator-culture-info", d => {
    self.state.cultureInfo = d;
});

