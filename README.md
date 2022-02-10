# pomodaro
My own attempt at a Pomodaro web extension.

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
