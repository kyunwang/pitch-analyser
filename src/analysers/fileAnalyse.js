// OfflineAudiocontext thanks to: https://stackoverflow.com/questions/46621954/offlineaudiocontext-and-fft-in-safari

import { detectAudioContext } from '../detector';
import {
	calculateFrequency,
	calculateNote,
	calculateCents,
	toDecimals,
	throwError,
	logError,
} from '../helpers';

function fileAnalyse(audioFile) {
	let frequencies;
	console.log(0, audioFile);

	if (!audioFile) return new Error('No audiofile provided');


	console.log(1);
	const audio = new Audio(audioFile);


	const context = detectAudioContext();

	// const analyser = context.createAnalyser();

	// const source = context.createMediaElementSource(audio);

	// source.connect(analyser);
	// analyser.connect(context.destination);

	// const frequencyData = new Uint8Array(analyser.frequencyBinCount);


	const reader1 = new FileReader();
	reader1.onload = function (ev) {
		// Decode audio
		context.decodeAudioData(ev.target.result).then((buffer) => {
			const offlineCtx = new OfflineAudioContext(2, buffer.length, 44100);
			const source = offlineCtx.createBufferSource();

			let samplesCount = 0;
			const audioDataArray = [];
			// source.buffer = buffer;
			// source.connect(offlineCtx.destination);
			// source.start();

			const analyser = offlineCtx.createAnalyser();
			analyser.fftSize = 2048;
			analyser.smoothingTimeConstant = 0.25;


			const processor = offlineCtx.createScriptProcessor(2048, 1, 1);


			source.buffer = buffer;

			source.connect(analyser);
			analyser.connect(processor);
			processor.connect(offlineCtx.destination);
			// const sondSource = context.createBufferSource();

			const frequencyData = new Float32Array(analyser.frequencyBinCount);
			// const frequencyData = new Uint8Array(analyser.frequencyBinCount);


			processor.onaudioprocess = (e) => {
				// console.log('processing', e, e.playbackTime);
				const t = e.playbackTime;


				// analyser.getByteFrequencyData(frequencyData);
				// analyser.getByteFrequencyData(frequencyData);
				analyser.getFloatFrequencyData(frequencyData);

				// analyser.getFloatFrequencyData(frequencies);

				const frequency = calculateFrequency(frequencyData);
				const note = calculateNote(frequency);

				if (Math.abs((t - Math.round(t))) < 0.05) {
					// console.table(Math.round(e.playbackTime), frequency, note);

				}

				const sec = 0.1; // one entry per second - .5 is half a second
				const totalStamps = audioDataArray.length;
				const timestamp = (Math.round(t / sec) * sec).toFixed(1);
				// const timestamp = (Math.round(t / sec) * sec).toFixed(1);

				// const timestamp = Math.round((t.toFixed(1) / sec) * 10) / 10;
				console.log(timestamp / sec, totalStamps);


				// console.log(timestamp, timestamp % sec === 0, (timestamp % sec).toFixed(1), totalStamps);


				if ((timestamp / sec) > totalStamps) {
					const data = {
						timestamp,
						frequency,
						note,
					};
					audioDataArray.push(data);
				}


				samplesCount++;
			};

			// Start the process
			source.start(0);

			// Start the render
			offlineCtx.startRendering().then((renderedBuffer) => {
				console.log('Rendering completed successfully', audioDataArray);
				// const song = context.createBufferSource();
				// song.buffer = renderedBuffer;
				// song.connect(context.destination);
				// song.start();


				// const frequencyBins = new Uint8Array(analyser.frequencyBinCount);

				// console.log(11, frequencyBins, frequencyData);
			 }).catch((err) => {
				  console.log(`Rendering failed: ${err}`);
				  // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
			 });

			// Create Compressor Node
		}, false);
	};
	reader1.readAsArrayBuffer(audioFile);


	// const fft = new FFT(2048, 44100);
	// console.log(fft);

	// fft.forward(audio);
	// const spectrum = fft.spectrum;


	function renderFrame() {
		// requestAnimationFrame(renderFrame);

		// analyser.getByteFrequencyData(frequencyData);
		// analyser.getFloatFrequencyData(frequencyData);

		// console.log(frequencyData);


		// return frequencyData;
	}
	return renderFrame();
}

// var audio = new Audio();
// audio.src = 'testAudio.mp3';
// audio.controls = true;
// audio.autoplay = true;
// document.body.appendChild(audio);

// var context = new AudioContext();
// var analyser = context.createAnalyser();

//  var source = context.createMediaElementSource(audio);
// source.connect(analyser);
// analyser.connect(context.destination);
// var frequencyData = new Uint8Array(analyser.frequencyBinCount);
// function renderFrame() {
//    requestAnimationFrame(renderFrame);

//    analyser.getByteFrequencyData(frequencyData);
// }
// renderFrame();

export { fileAnalyse };
