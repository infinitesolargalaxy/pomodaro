import browser from "webextension-polyfill";
import { POMODARO_ALARM_ID } from "../popup/Popup";

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
          browser.notifications.create(POMODARO_ALARM_ID, {
              type: 'basic',
              iconUrl: '../assets/gallery.png',
              title: 'Times up!',
              message: "It's time to take a break!",
              priority: 2
          });
      }
  });

//   browser.notifications.onClosed.addListener((notification) => {
//     console.log(notification);
//     if (notification.name === 'POMODARO_ALARM_ID') {
//         browser.notifications.clear('POMODARO_ALARM_ID');
//     }
//   });

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