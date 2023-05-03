const synth = window.speechSynthesis;
const voiceSelect = document.querySelector('#lang');
const pitchInput = document.querySelector('#pitch');
const rateInput = document.querySelector('#rate');
const volumeInput = document.querySelector('#volume');
const textArea = document.querySelector('#text');

setTimeout(() => {
    const selectChild = synth.getVoices().reduce((res, ite) => {
        return res += `<option value="${ite.lang}" data-name="${ite.name}">${ite.lang} - ${ite.name}</option>`
    }, '');
    voiceSelect.innerHTML = selectChild;
}, 50);

function limitVal({ ele, min, max }) {
    if (ele.value > max) {
        ele.value = max;
    } else if (ele.value < min) {
        ele.value = min;
    }
}

pitchInput.onblur = () => {
    limitVal({ ele: pitchInput, min: 0, max: 2 });
};

rateInput.onblur = () => {
    limitVal({ ele: rateInput, min: 0, max: 10 });
};

volumeInput.onblur = () => {
    limitVal({ ele: volumeInput, min: 0, max: 1 });
};

function startRead() {
    const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    const voices = synth.getVoices();
    for(let i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
            const utterThis = new window.SpeechSynthesisUtterance(textArea.value);
            utterThis.voice = voices[i];
            utterThis.pitch = pitchInput.value;
            utterThis.rate = rateInput.value;
            utterThis.volume = volumeInput.value;
            synth.speak(utterThis);
            break;
        }
    }
}

function pause() {
    synth.pause();
}

function continueSpeak() {
    synth.resume();
}