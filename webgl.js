const meters = []
document.addEventListener('DOMContentLoaded', ()=>{

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const amountCols = 3
    const amountRows = 256
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream=>{
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        animate();
    }
    ).catch(error=>console.error(error));

    for (let i = 0; i < 3; i++) {
        let meter = document.createElement('div');
        //meter.style.margin = '0 auto';
        meter.style.display = 'inline-block';
        meter.style.position = 'relative';
        meter.style.top = '-150px';
        meter.style.width = '33%';
        meter.style.height = '170px';
        document.getElementById('web-gl').appendChild(meter);
        //meter.style.marginLeft = '150px';
        //meter.style.marginTop = '150px';
        meters.push(meter);

    }

    for (let i = 0; i < amountRows; i++) {
        for (let j = 0; j < 3; j++) {
            let led = document.createElement('div');
            meters[j].appendChild(led);
           // led.style.position = 'relative';
           // led.style.top = '25px';
            led.style.width = '100%';
            led.style.height = '1px';
            led.style.backgroundColor = 'red';
            led.style.margin = '1px';
        }

    }

    function animate() {
        requestAnimationFrame(animate);
        analyser.getByteFrequencyData(dataArray);
        let sum = dataArray.reduce((acc,val)=>acc + val, 0);

        let rms = Math.sqrt(sum / analyser.frequencyBinCount);
        rms = sum / 40

        for (let i = 0; i < amountRows / 2; i++) {
            for (let ii = 0; ii < 3; ii++) {
                let led = meters[ii].children[amountRows / 2 - 1 - i]
                led.style.opacity = 0
                if (rms>5&&ii == 1 && i < rms) {
                    led.style.opacity = 1.0 - i / 75
                } else if (rms>5&&i < rms / 1.2) {
                    led.style.opacity = 1.0 - i / 40
                }

            }
        }

        for (let i = amountRows / 2; i < amountRows; i++) {
            for (let ii = 0; ii < 3; ii++) {
                let led = meters[ii].children[i]
                led.style.opacity = 0
                if (rms>5 && ii == 1 && i - amountRows / 2 < rms) {
                    led.style.opacity = 1.0 - (i - amountRows / 2) / 75
                } else if (rms>5 && i - amountRows / 2 < rms / 1.2) {
                    led.style.opacity = 1.0 - (i - amountRows / 2) / 40
                }

            }
        }
    }
}
);
