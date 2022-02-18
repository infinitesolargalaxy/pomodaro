# pomodaro
My own attempt at a Pomodaro web extension.

## Disclaimer
Pomodoro® and The Pomodoro Technique® are trademarks of Francesco Cirillo. Marinara is not affiliated or associated with or endorsed by Pomodoro®, The Pomodoro Technique® or Francesco Cirillo.

## Attribution
Alert.mp3: Public Domain from https://soundbible.com/1264-Sunday-Church-Ambiance.html

## Installation

```
yarn
```

## Cleaning

```
yarn clean:dist
```

This will delete the `dist` folder.


## Development mode

```
yarn start
```

This mode will work in both Chrome and Firefox. 

BUT, once you start using `browser` you won't be able to develop in localhost. It will error out. 

Note: it seems like you can make changes, but you'll have to disregard "🚨 Connection to the HMR server was lost" errors in Chrome. Parcel will handle the "reloading" for you.

## Build mode

```
yarn build
```

Warning: This builds into `dist/webext-prod`!

## DevPackages:
postcss: Automates CSS stuff
Autoprefixer: Automate vendor prefixes for Cross Browser support: https://github.com/postcss/autoprefixer 

## Packages:
webextension-polyfill: Polyfill for most Chromium browsers


## Docs

### Notifications API
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications

### Alarms API
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms