import notes from './notes.json';
import { detectAudioContext, detectGetUserMedia } from './detector';
import { findFundamentalFrequency, findClosestNote, findCentsOffPitch } from './autoCorrelation';

// Feature detect and pass AudioContext to audioCtx
const audioCtx = detectAudioContext();
const getUserMedia = detectGetUserMedia();

const frequencyTable = notes;
const baseFrequency = 440; // A default frequency ot start with
const currentNoteIndex = 57; // 57 is the A4 in the notes array
const notesArray = frequencyTable[baseFrequency]; // Select a frequency table based on the frequency

// Predefine variables
let audioSource;
let audioAnalyser;
let microphoneStream;

// Default of options
let options = {
  microphone: true,
  audioFile: false,
  callback: null,
};

// Handle error
function handleError(err) {
  throw new Error(`Oops something went wrong: ${err}`);
}

function detectNote() {
  const buffer = new Uint8Array(audioAnalyser.fftSize); //
  audioAnalyser.getByteTimeDomainData(buffer);

  const fundamentalFrequency = findFundamentalFrequency(buffer, audioCtx.sampleRate);

  if (fundamentalFrequency !== -1) {
    const note = findClosestNote(fundamentalFrequency, notesArray);
    const cents = findCentsOffPitch(fundamentalFrequency, note.frequency);

    //  console.log(note.note, note.frequency, cents);
    //  return note;
    options.callback(note);
  }

  window.requestAnimationFrame(detectNote); // Tells the browser we wish to perform a animation. Call callback before repaint
  //   console.log('Options', options);
}

// Call when the stream has connected
function streamReceived(stream) {
  microphoneStream = stream; // Set the stream to microphoneStream

  // Initialize and assign a audio analyser
  audioAnalyser = audioCtx.createAnalyser();
  audioAnalyser.fftSize = 2048;

  audioSource = audioCtx.createMediaStreamSource(microphoneStream); // Assign a stream source as main source
  audioSource.connect(audioAnalyser); // Connect the analyser to our audio stream

  // Start note detection
  detectNote();
}

/* eslint-disable func-names */
const PitchAnalyser = function (args) {
  if (!(this instanceof PitchAnalyser)) {
    handleError("constructor needs to be called with the 'new' keyword");
  }

  if (args) {
    options = { ...options, ...args };
  }

  if (!args.callback) {
    throw new Error('A callback needs to be passed');
  }

  // connect to audio context
  // Check whether the browser does support the feature. audioCtx = false or window.AudioContext
  if (audioCtx) {
    console.log('Your browser supports Audio Context');

    // getUserMedia = window.getUserMedia(went through feature detects) or false
    if (getUserMedia) {
      console.log('Your brower supports getUserMedia');
      getUserMedia({ audio: true })
        .then(streamReceived)
        .catch(handleError);
    } else {
      throw new Error('Your brower does not support getUserMedia');
    }
  } else {
    throw new Error('Your browser does not support Audio Context');
  }
};
/* eslint-enable func-names */

// expose / export package initializer
module.exports = PitchAnalyser;
