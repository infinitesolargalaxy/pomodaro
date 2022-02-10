import browser from "webextension-polyfill";

interface CustomWindow extends Window {
  Run: boolean;
}

declare let window: CustomWindow

(function() {
  if (window.Run) {
    return
  }
  window.Run = true;

  browser.runtime.onMessage.addListener(({command}) => {
    
    let playSound: boolean | null;

    switch(command) {
      case 'times-up':
        playSound = true;
      break;

      default:
        playSound = false;
      return;
    }

    if (playSound) {
      // TODO
    }
  });

})();