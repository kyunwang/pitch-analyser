import notes from './notes.json';
import { detectAudioContext, detectGetUserMedia } from './detector';
import { findFundamentalFrequency, findClosestNote, findCentsOffPitch } from './autoCorrelation';

import analyseFrequency from './analyseFrequency';

let audioCtx;
let getUserMedia;

const frequencyTable = notes;
// A default frequency ot start with
const baseFrequency = 440;
// Select a frequency table based on the frequency
const notesArray = frequencyTable[baseFrequency];

// Predefine variables
let audioSource;
let audioAnalyser;
let microphoneStream;

let frequencies;
let frequency;
let amplitude;
let volume;

// Default of options
let options = {
  microphone: true,
  audioFile: false,
  callback: null,
  returnNote: true,
  returnCents: false,
  afterCloseCallback() {},
};

// Handle error
function throwError(err) {
  throw new Error(`Something went wrong: ${err}`);
}

function logError(err) {
  console.error(err);
}

function detectNote() {
//   const buffer = new Uint8Array(audioAnalyser.fftSize);
  //   audioAnalyser.getByteTimeDomainData(buffer);
  audioAnalyser.getFloatFrequencyData(frequencies);
  audioAnalyser.getByteTimeDomainData(amplitude);

  frequency = analyseFrequency(frequencies);

  if (frequency) {
	  const {
		  returnCents,
		  callback,
	  } = options;

    const returnValue = {
      frequency,
    };

    if (returnCents) {}

    callback(returnValue);
  }

  //   const fundamentalFrequency = findFundamentalFrequency(buffer, audioCtx.sampleRate);

  //   if (fundamentalFrequency !== -1) {
  //     const returnValue = {};

  //     if (options.returnNote) {
  //       const { note, frequency } = findClosestNote(fundamentalFrequency, notesArray);
  //       returnValue.note = note;
  //       returnValue.frequency = frequency;

  //       // Requires the note to find the cents
  //       if (options.returnCents) {
  //         const cents = findCentsOffPitch(fundamentalFrequency, frequency);
  //         returnValue.cents = cents;
  //       }
  // 	 }

  //     // Execute the callback. (Intended for returning the output)
  //     options.callback(returnValue);
  //   }

  // Tells the browser we wish to perform a animation. Call callback before repaint
  window.requestAnimationFrame(detectNote);
}

// Call when the stream has connected
function streamReceived(stream) {
  // Set the stream to microphoneStream
  microphoneStream = stream;

  // Initialize and assign a audio analyser
  audioAnalyser = audioCtx.createAnalyser();
  //   audioAnalyser.fftSize = 2048;

  // Create frequencies arrayholder
  frequencies = new Float32Array(audioAnalyser.frequencyBinCount);


  amplitude = new Uint8Array(audioAnalyser.frequencyBinCount);

  // Create amplifier
  volume = audioCtx.createGain();

  // Assign a stream source as main source
  audioSource = audioCtx.createMediaStreamSource(microphoneStream);

  // Connect the audio to the amplifier
  audioSource.connect(volume);
  // Connect the audio to our analyser
  audioSource.connect(audioAnalyser);

  // Start note detection
  detectNote();
}

/* eslint-disable-next-line */
const PitchAnalyser = function(args) {
  // Feature detect and pass AudioContext to audioCtx
  audioCtx = detectAudioContext();
  getUserMedia = detectGetUserMedia();

  if (!(this instanceof PitchAnalyser)) throwError("constructor needs to be called with the 'new' keyword");

  // Check whether the browser does support the feature. audioCtx = false or window.AudioContext
  if (!audioCtx) logError('Your browser does not support Audio Context');

  // getUserMedia = window.getUserMedia(went through feature detects) or false
  if (!getUserMedia) logError('Your brower does not support getUserMedia');

  if (!args.callback) throwError('A callback needs to be passed');

  // Pass user given arguments to the options
  options = { ...options, ...args };

  if (options.returnCents && options.returnNote === false) throwError("'returnNote' should be 'true' to get access to the 'cents");

  // Start media stream
  getUserMedia({ audio: true })
    .then(streamReceived)
    .catch(throwError);


  /*= =========================
  ===Class methods
  =========================== */
  // Set the close function
  this.close = function () {
    audioCtx.close().then(() => {
      options.afterCloseCallback();
    });
  };
};

module.exports = PitchAnalyser;
