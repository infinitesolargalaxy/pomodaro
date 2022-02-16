import browser from "webextension-polyfill";

// interface CustomWindow extends Window {
//   Run: boolean;
// }

// declare let window: CustomWindow

(function() {
  // if (window.Run) {
  //   return
  // }
  // window.Run = true;

  console.log('here');

  browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === "pomodaroAlarm") {
          console.log('testing alarm detection');
          browser.notifications.create('test', {
              type: 'basic',
              iconUrl: '../assets/gallery.png',
              title: 'Test Message',
              message: 'You are awesome!',
              priority: 2
          });
      }
  });

  // browser.runtime.onMessage.addListener(({command}) => {
    
  //   let playSound: boolean | null;

  //   switch(command) {
  //     case 'times-up':
  //       playSound = true;
  //     break;

  //     default:
  //       playSound = false;
  //     return;
  //   }

  //   if (playSound) {
  //     // TODO
  //   }
  // });

})();