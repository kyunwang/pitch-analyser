function findFundamentalFrequency(buffer, sampleRate) {
  // We use Autocorrelation to find the fundamental frequency.

  // In order to correlate the signal with itself
  // (hence the name of the algorithm), we will check two points 'k' frames away.
  // The autocorrelation index will be the average of these products.
  // At the same time, we normalize the values.
  // Source: http://www.phy.mty.edu/~suits/autocorrelation.html
  // Assuming the sample rate is 48000Hz,
  // a 'k' equal to 1000 would correspond to a 48Hz signal (48000/1000 = 48),
  // while a 'k' equal to 8 would correspond to a 6000Hz one,
  // which is enough to cover most (if not all)
  // the notes we have in the notes.json file.
  const n = 1024;
  let bestK = -1;
  let bestR = 0;
  for (let k = 8; k <= 1000; k++) {
    let sum = 0;

    for (let i = 0; i < n; i++) {
      sum += ((buffer[i] - 128) / 128) * ((buffer[i + k] - 128) / 128);
    }

    const r = sum / (n + k);

    if (r > bestR) {
      bestR = r;
      bestK = k;
    }

    if (r > 0.9) {
      // Let's assume that this is good enough and stop right here
      break;
    }
  }

  if (bestR > 0.0025) {
    // The period (in frames) of the fundamental frequency is 'bestK'.
    // Getting the frequency from there is trivial.
    const fundamentalFreq = sampleRate / bestK;
    return fundamentalFreq;
  }
  // We haven't found a good correlation
  return -1;
}

function findClosestNote(freq, notes) {
  // Use binary search to find the closest note
  let low = -1;
  let high = notes.length;
  while (high - low > 1) {
    const pivot = Math.round((low + high) / 2);
    if (notes[pivot].frequency <= freq) {
      low = pivot;
    } else {
      high = pivot;
    }
  }

  if (Math.abs(notes[high].frequency - freq) <= Math.abs(notes[low].frequency - freq)) {
    // notes[high] is closer to the frequency we found
    return notes[high];
  }

  return notes[low];
}

function findCentsOffPitch(freq, refFreq) {
  // We need to find how far freq is from baseFreq in cents
  const log2 = 0.6931471805599453; // Math.log(2)
  const multiplicativeFactor = freq / refFreq;

  // We use Math.floor to get the integer part and ignore decimals
  const cents = Math.floor(1200 * (Math.log(multiplicativeFactor) / log2));
  return cents;
}

module.exports = { findFundamentalFrequency, findClosestNote, findCentsOffPitch };
