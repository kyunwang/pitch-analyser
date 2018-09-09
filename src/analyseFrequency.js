// Code by fritzvd (signaltohertz) - https://github.com/fritzvd/signaltohertz
// Changes: function name
function analyseFrequency(frequencies, options) {
  let rate = 22050 / 1024; // defaults in audioContext.

  if (options) {
    if (options.rate) {
      rate = options.rate;
    }
  }

  let maxI;
  let max = frequencies[0];

  for (let i = 0; frequencies.length > i; i++) {
    const oldmax = parseFloat(max);
    const newmax = Math.max(max, frequencies[i]);
    if (oldmax != newmax) {
      max = newmax;
      maxI = i;
    }
  }
  return maxI * rate;
}

module.exports = analyseFrequency;
