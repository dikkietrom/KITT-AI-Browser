const meters = []
document.addEventListener('DOMContentLoaded', ()=>{
    if(systemPreferences && systemPreferences.askForMediaAccess){
        systemPreferences.askForMediaAccess("microphone")
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 4096
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const amountCols = 3
    const amountRows = 48
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream=>{
        const source = audioContext.createMediaStreamSource(stream);
        log(source)
        source.connect(analyser);
        animate();
    }
    ).catch(error=>err(error));

    for (let i = 0; i < 3; i++) {
        let meter = document.createElement('div');

        //meter.style.display = 'inline-block';
        //meter.style.position = 'relative';
        //meter.style.top = '-150px';
        //meter.style.width = '33%';
        meter.style.height = '100%';
        document.getElementById('web-gl').appendChild(meter);
        //meter.style.marginLeft = '150px';
        //meter.style.marginTop = '150px';
        meters.push(meter);

    }
    meters[0].style.marginLeft = '.5em';
    meters[2].style.marginRight = '.5em';

    for (let i = 0; i < amountRows; i++) {
        for (let j = 0; j < 3; j++) {
            let led = document.createElement('div');
            meters[j].appendChild(led);
            //  led.style.position = 'relative';
            //   led.style.top = '25px';
            //   led.style.width = '100%';
            led.style.height = (100 / amountRows) + 'px';
            led.style.backgroundColor = 'red';
            led.style.margin = (100 / amountRows) + 'px';
        }

    }

    function animate() {
        requestAnimationFrame(animate);
        analyser.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((acc,val)=>acc + val, 0);
        let tresh = 3

        let rms = Math.sqrt(sum / analyser.frequencyBinCount);
        //rms = sum/50
        let db = 20 * Math.log10(rms);
        rms /= .3
        let val = rms / 30
        let rgb = gradientToHex(val) + ( rms > tresh ? '33' : '00')
        meters[0].parentElement.style.backgroundColor = rgb
        for (let i = 0; i < amountRows / 2; i++) {
            for (let ii = 0; ii < 3; ii++) {
                let led = meters[ii].children[amountRows / 2 - 1 - i]
                // log(gradientToHex(0))

                led.style.opacity = 0
                if (rms > tresh && ii == 1 && i < rms) {
                    led.style.opacity = 1.0 - i / 40
                } else if (rms > tresh && i < rms / 2) {
                    led.style.opacity = 1.0 - i / 20
                }

            }
        }

        for (let i = amountRows / 2; i < amountRows; i++) {
            for (let ii = 0; ii < 3; ii++) {
                let led = meters[ii].children[i]
                led.style.opacity = 0
                if (rms > tresh && ii == 1 && i - amountRows / 2 < rms) {
                    led.style.opacity = 1.0 - (i - amountRows / 2) / 40
                } else if (rms > tresh && i - amountRows / 2 < rms / 2) {
                    led.style.opacity = 1.0 - (i - amountRows / 2) / 20
                }

            }
        }
    }
}
);
function toHex(c) {
    return ((c | (1 << 8)).toString(16).slice(1));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function gradientToHex(t) {
    let r, g, b;

    if (t < 0.5) {
        r = Math.round(lerp(255, 0, t * 2));
        g = Math.round(lerp(0, 255, t * 2));
        b = 0;
    } else {
        r = 0;
        g = Math.round(lerp(255, 0, (t - 0.5) * 2));
        b = Math.round(lerp(0, 255, (t - 0.5) * 2));
    }

    return "#" + toHex(r) + toHex(g) + toHex(b);
}
