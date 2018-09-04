# Pitch Analyser

A super simple package for reading audio input from a microphone. E.g. pitch frequency, music notes and the cents.

This package makes use of the `Web Audio API`

![Demo image](https://github.com/kyunwang/Repo-Images/blob/master/pitch-analyser/note-detector%20example.png)

Here is an example project called note detector using this package here. (**[Repo](https://github.com/kyunwang/note-detector)** / **[Demo](https://kyunwang.github.io/note-detector/)**)

# Table of Content

-  [Installing](#installing)
-  [Usage](#usage) - [Payload format](#payload-format)
-  [Options](#options)
-  [License](#license)

# Installing

Npm: `npm install --save pitch-analyser`

Yarn: `yarn add pitch-analyser`

<!-- Download: link full | min ? (would it work?) -->

# Usage

This package returns the frequency, music note and cents from audio input and nothing more.

1. Import the package

```
import pitchAnalyser from 'pitch-analyser';
```

2. Initialize the analyser
   In the callback we can do whatever we want with the payload

```
const analyser = new pitchAnalyser({
	callback: function(payload) {
		console.log(payload); // E.g. { frequency: 220, note: "A3" }
	}
});
```

Thats all you need to do to get started. Check out this example project to see it in action. (**[Repo](https://github.com/kyunwang/note-detector)** / **[Demo](https://kyunwang.github.io/note-detector/)**)

## Payload format

The payload is an object and can look like this

```
{
	note: "D7",
	frequency: 2349.32,
	cents: -21 // if returnCents is set to true
}
```

# Options

These are the few options available.

-  callback
-  returnNote
-  returnCents

### callback - Required

A function is required as it is the entrypoint of the analyser output.

```
new pitchAnalyser({
	callback: function(value) {
		console.log(value); // E.g. { frequency: 220, note: "A3" }
	}
});
```

### returnNote

**Default: true**

If this option is set to true, the frequency and note will be passed to the callback function.

```
new pitchAnalyser({
	returnNote: true,
	...other options...
});
```

### returnCents

**Default: false**

**Requires `returnNote`**

Will return the _cents_ if set to true. Requires `returnNote` to be true.

```
new pitchAnalyser({
	returnNote: true, // Is required
	returnCents: true,
	...other options...
});
```

# To do

Things to be done or wanting to be done. Has no priority.

-  [ ] Add audio files as input besides microphone
-  [ ] Research alternative to the notes.json
-  [ ] Allow change in baseFrequency through options (needs notes.json for this)

# License

This repo is under the [MIT License](https://github.com/kyunwang/pitch-analyser/blob/master/LICENSE)
