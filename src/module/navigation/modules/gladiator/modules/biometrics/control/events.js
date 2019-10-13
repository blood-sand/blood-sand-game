const self = this;
const biometrics = self.state.biometrics;
const eventLoop = self.share.eventLoop;
let cultureSettings;
$('#biometrics select').selectric();

eventLoop.after(() => (
        !cultureSettings &&
        (cultureSettings = self.share.cultureSettings)
    ), () => {
        cultureSettings.bindInput('name', 
            $('#biometrics [name=name]')
        );
        cultureSettings.bindInput({
            property: 'culture',
            element: $('#biometrics [name=culture]'),
            outHandler: (element, val) => 
                $(element).val(val).selectric()
        });
        cultureSettings.bindInput({
            property: 'sex',
            element: $('#biometrics [name=sex]'),
            outHandler: (element, val) => 
                $(element).val(val).selectric()
        });
});

$('#biometrics ul>li input').each(function () {
    biometrics.bindInput(this.name, this);
});

$('#biometrics').on(
    'click', 
    '.randomizeBiometrics', 
    self.state.requestBiometrics
);
