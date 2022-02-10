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
})();