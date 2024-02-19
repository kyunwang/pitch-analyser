# Pitch Analyser
A super simple package for reading audio input from a microphone. E.g. pitch frequency, music notes and the cents.

This package makes use of the `Web Audio API`

Here is an example project called note detector using this package here. (**[Repo](https://github.com/kyunwang/note-detector)** / **[Demo](https://kyunwang.github.io/note-detector/)**)

**CURRENT ISSUE:** Known issue - Chrome does not `resume` the analyser after pausing.

**WARNING:** Breaking changes possible - This will be done as MINOR updates.

Not in active development, but at times I can make a breaking change to optimise usage. So keep that in mind, if you are one of the lovely people trying this package out.

Will remove the warning if this will not be the case anymore. Or help me out with this I guess? 🤷🏻‍♂️

<p align="center">
	<img src="https://raw.githubusercontent.com/kyunwang/Repo-Images/master/pitch-analyser/note-detector%20example.png" alt="Demo image" width="200" height="340"/>
</p>

# Table of Content

-  [Installing](#installing)
-  [Usage](#usage) - [Payload format](#payload-format)
-  [Options](#options)
-  [Methods/Properties](#methods/properties)
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
	analyser.stopAnalyser();
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

# Methods/Properties

The methods and properties available for use.
_You will need to have access to the initializes analyser_

**Methods**

-  resume
-  closeContext

**Properties**

-  audioContext

## Methods

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

## Properties

### audioContext

The native audioContext can be accessed here for if you are ambitious and need customization.
_Check the MDN docs or somewhere else for all the information about the usage of AudioContext_

```
analyser.audioContext
```

# License

This repo is under the [MIT License](https://github.com/kyunwang/pitch-analyser/blob/master/LICENSE)
