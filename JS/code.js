// for cross browser
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

// load some sound
const audioElement = document.querySelector('audio');
let track;

let dataArray;
let analyser
var bufferLength;

const playButton = document.querySelector('.tape-controls-play');

// play pause audio
playButton.addEventListener('click', function() {
  if (!audioCtx) {
    init();
  }

  // check if context is in suspended state (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (this.dataset.playing === 'false') {
    audioElement.play();
    this.dataset.playing = 'true';
    // if track is playing pause it
  } else if (this.dataset.playing === 'true') {
    audioElement.pause();
    this.dataset.playing = 'false';
  }

  let state = this.getAttribute('aria-checked') === "true" ? true : false;
  this.setAttribute('aria-checked', state ? "false" : "true");

}, false);

// if track ends
audioElement.addEventListener('ended', () => {
  playButton.dataset.playing = 'false';
  playButton.setAttribute("aria-checked", "false");
}, false);



function init() {
  audioCtx = new AudioContext();
  track = audioCtx.createMediaElementSource(audioElement);

  //analysis
  analyser = audioCtx.createAnalyser();

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // volume
  const gainNode = audioCtx.createGain();

  const volumeControl = document.querySelector('[data-action="volume"]');
  volumeControl.addEventListener('input', function() {
    gainNode.gain.value = this.value;
  }, false);

  // panning
  const pannerOptions = {
    pan: 0
  };
  const panner = new StereoPannerNode(audioCtx, pannerOptions);

  const pannerControl = document.querySelector('[data-action="panner"]');
  pannerControl.addEventListener('input', function() {
    panner.pan.value = this.value;
  }, false);

  track.connect(gainNode).connect(panner).connect(analyser).connect(audioCtx.destination);

  frequencyType();

  // amplitudeType();
}

function setAmplitudeMode(){
  cancelAnimationFrame(drawVisual);

  amplitudeType();
}
function setFrequencyMode(){
  cancelAnimationFrame(drawVisual);

  frequencyType();
}


function amplitudeType() {
  analyser.fftSize = 128;

  var lastelm = 0;
  var bufferLength = 128; //how many blocks is devided the Visualizer

  var dataArray = new Uint8Array(bufferLength);
  var   el = document.getElementById('elm' + lastelm);


  var draw = function() {
    drawVisual = requestAnimationFrame(draw);

    var all_elm = true;
    if (lastelm >= bufferLength) {
      lastelm = 0;
    } else {
      lastelm += 1;
    }
    el = document.getElementById('elm' + lastelm);

    analyser.getByteTimeDomainData(dataArray);

    for (var i = 0; i <= bufferLength; i++) {
      if (all_elm) {
        el = document.getElementById('elm' + i);
      }
      var v = dataArray[i] / 128.0;
      if (el){
        el.style.transform = 'rotate(' + el.getAttribute("rotate") + 'deg) translateY(' + el.getAttribute("translateY") + '%) scale(' + v + ') ';
      }
    }
  };

  draw();
}

function frequencyType() {
  analyser.fftSize = 256;

  var bufferLengthAlt = analyser.frequencyBinCount;
  var dataArrayAlt = new Uint8Array(bufferLengthAlt);

  var drawAlt = function() {
    drawVisual = requestAnimationFrame(drawAlt);
    analyser.getByteFrequencyData(dataArrayAlt);

    // var barWidth = (600 / bufferLengthAlt) * 2.5;
    var barHeight;

    for (var i = 0; i < bufferLengthAlt; i++) {
      barHeight = dataArrayAlt[i];

      var el = document.getElementById('elm' + i);

      if (el){
        el.style.transform = 'rotate(' + el.getAttribute("rotate") + 'deg) translateY(' + el.getAttribute("translateY") + '%) scale(' + (barHeight/100) + ') ';
      }
    }
  };
  drawAlt();
}
