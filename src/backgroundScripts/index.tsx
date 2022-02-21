import browser from "webextension-polyfill";
import { POMODARO_ALARM_ID } from "../popup/Popup";

$(document).ready(function(){
  alert("working");
});

// browser.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === "pomodaroAlarm") {
//       console.log('testing alarm detection');
//       browser.notifications.create(POMODARO_ALARM_ID, {
//           type: 'basic',
//           iconUrl: '../assets/gallery.png',
//           title: 'Times up!',
//           message: "It's time to take a break!",
//           priority: 2
//       });
//   }
// });