# Pitch Analyser

A super simple package for reading audio input from a microphone. E.g. pitch frequency, music notes and the cents.

This package makes use of the `Web Audio API`

<p align="center">
	<img src="https://github.com/kyunwang/Repo-Images/blob/master/pitch-analyser/note-detector%20example.png" alt="Demo image" width="300" height="300"/>
</p>

Here is an example project called note detector using this package here. (**[Repo](https://github.com/kyunwang/note-detector)** / **[Demo](https://kyunwang.github.io/note-detector/)**)

**Note:** To chrome users/devs. From Chrome 66+ autoplay will work anymore. You will need to make use of the `resume()` method to start/resume the analyser. Check the _Methods_ section of the docs here.

# Table of Content

-  [Installing](#installing)
-  [Usage](#usage) - [Payload format](#payload-format)
-  [Options](#options)
-  [Methods](#methods)
-  [License](#license)

# Installing

Npm: `npm i pitch-analyser`

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

3. Stopping the analyser
   In case you want to stop the analyser. In `componentWillUnmount` in React for example.

```
componentWillUnmount() {
	analyser.close();
}
```

Thats all you need to do to get started. Check out this example project to see it in action. (**[Repo](https://github.com/kyunwang/note-detector)** / **[Demo](https://kyunwang.github.io/note-detector/)**)

## Payload format

The payload is an object and can look like this with default options.

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
-  decimals

### callback

| Type     | Default | isRequired |
| -------- | ------- | ---------- |
| function | null    | **true**   |

Through the `callback` you will receive the output and will need to handle what to do with it here.

```
new pitchAnalyser({
	callback: function(value) {
		// E.g. { frequency: 220, note: "A3" }
		console.log(value);
	}
});
```

### returnNote

| Type    | Default | isRequired |
| ------- | ------- | ---------- |
| boolean | true    | **false**  |

If this option is set to true, the frequency and note will be passed to the `callback` function.

```
new pitchAnalyser({
	returnNote: true,
	...other options...
});
```

### returnCents

**Requires `returnNote`**

| Type    | Default | isRequired |
| ------- | ------- | ---------- |
| boolean | false   | **false**  |

Will return the _cents_ if set to true. Requires `returnNote` to be true.

```
new pitchAnalyser({
	returnNote: true, // Is required
	returnCents: true,
	...other options...
});
```

# Methods

The methods available for use.
_You will need to have access to the initializes analyser_

-  resume
-  closeContext

### resume

An methods form the AudioContext. It is important to call this to start/resume the analyser, because on chrome it will not start automatically.

```
analyser.audioContext.resume();
```

### closeContext

When you want fully stop the analyser (will remove the instance);

| Arguments | Type     | Output                                                                        |
| --------- | -------- | ----------------------------------------------------------------------------- |
| callback  | function | If a callback is passed, it will be called when the `audioContext` has closed |

```
analyser.closeContext(callback);
```

# License

This repo is under the [MIT License](https://github.com/kyunwang/pitch-analyser/blob/master/LICENSE)
