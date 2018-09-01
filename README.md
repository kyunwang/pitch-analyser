# A simple pitch analyser
A super simple package for reading audio input from a microphone. E.g. pitch frequency, music notes and the cents.


*The readme is still in draft mode thus incomplete*

# Table of Content
- [Installing](#installing)
- [Simple example](#simple-example)
- [Usage](#usage)
- [License](#license)

# Installing
Npm: `npm install --save pitch-analyser`

Yarn: `yarn add pitch-analyser`

Download: link full | min ? (would it work?)

# Usage

This package returns the frequency, music note and cents from audio input and nothing more.

about options, return values, support?, no need to 

```
import pitchAnalyser from 'pitch-analyser';
```

// Initialize the analyser
```
const analyser = new pitchAnalyser({
	callback: function(value) {
		console.log(value); // E.g. { frequency: 220, note: "A3" }
	}
});
```

# Options
These are the few options available.

### callback - Required
A function should be passed which receives the analyser output.

```
new pitchAnalyser({
	callback: function(value) {
		console.log(value); // E.g. { frequency: 220, note: "A3" }
	}
});
```

### returnNote
**Default: true**

If this option is set to true, the freuency and note will be passed to the callback function.

```
new pitchAnalyser({
	returnNote: true,
	...other options...
});
```

### returnCents
**Defautl: false**

**Requires `returnNote`**

Will return the *cents* if set to true. Required `returnNote` to be true.

```
new pitchAnalyser({
	returnNote: true, // Is required
	returnCents: true,
	...other options...
});
```

# To do
Things to be done or wanting to be done. Has no priority.

- [ ] Add audio files as input besides microphone
- [ ] Research alternative to the notes.json
- [ ] Allow change in baseFrequency through options (needs notes.json for this)

# License
