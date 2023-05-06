class NatDev extends Plugin {
    constructor(arg) {
        super(arg);
        this.async = true;
        this.streamer = true;
    }

    config() {
        return {
            name: 'NatDev',
            id: 'nd',
            description: 'NatDev',
            role: 'worker',
            active: true,
            url: 'https://nat.dev',
        };
    }
    onInitMenu(json) {
        span(json.menu).innerHTML = 'models : '
        this.fabSelect = select(json.menu)
        this.modelSelect = select(json.menu)

    }
    exec(message) {


        
    }
    onFetchRequest(data) {
    console.log(data.referrer)
        if (!this.menuInit && data.url == 'https://nat.dev/api/all_models' && data.eventType == 'onSendHeaders') {
            let models = getModels(data)
            let json = getModelsByFab(models)
            for (let p in json) {
                option(this.fabSelect).innerHTML = p
            }
            this.menuInit = true
            let that = this
            
            this.fabSelect.onchange = function fabSelect(e) {
                that.modelSelect.innerHTML=''
                let models = json[that.fabSelect.value]
                for (let p in models) {
                    let model = models[p]
                    if (model.name) {
                        option(that.modelSelect).innerHTML = model.name
                    }
                }

            }
            this.fabSelect.value = 'openai'
            this.fabSelect.onchange()
            this.modelSelect.value = 'gpt-4'

        }

    }
    onFetchResponse(data) {// if(data.url == 'https://nat.dev/api/all_models')
    // console.log('onFetchResponse:',data);
    }
}
ipcRenderer.on('doInPreload-nat-dev', (event,json)=>{
    console.log('doInPreload-nat-dev', json)
}
)

function getModels(json) {
    return ipcRenderer.sendSync('nat-dev-models', json)
}

function getModelsByFab(jsonString) {
    try {
        const jsonObject = JSON.parse(jsonString);
        const modelsByFab = {};

        for (const key in jsonObject) {
            const [fab,model] = key.split(':');
            const modelValue = jsonObject[key];

            if (modelsByFab.hasOwnProperty(fab)) {
                modelsByFab[fab].push(modelValue);
            } else {
                modelsByFab[fab] = [modelValue];
            }
        }

        return modelsByFab;
    } catch (error) {
        console.error('Error parsing JSON string:', error);
        return {};
    }
}

Plugin.nd = new NatDev();
