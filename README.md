# NoConsole

Simple js lib to watch/block/hide console usage, undetectable as posible

## Usage

```javascript
// import or add NoConsole.js

// Do nothing, for development
NoConsole('allow');

// Hide console output
NoConsole('hide');

// Wath console usage
NoConsole('watch', function handler(original, prop) {
    original.log('Tried to use console.' + prop + ' !');
    return () => {};
});

// Block console usage
NoConsole('block');


// Also function returns original console, so you can 
const _console = NoConsole('block');
_console.log('I work fine!');
```

## Options

```javascript
{String} mode - Work mode [
    'allow', // do nothing
    'watch', // return proxy, all calls to console will be handled by Handler function
    'hide',  // return proxy, all calls to console will return empty function/string/object/0
    'block'  // return undefind, like there is no console at all
]
{Function} handler(
    {Object} original, // Original console
    {String} prop      // Requested method name
) => {Function} - Handler function, should return method
```