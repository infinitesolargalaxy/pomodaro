import * as React from 'react';
import browser from 'webextension-polyfill';
import { EncouragementGenerator } from "./EncouragementGenerator";

interface IProps {
}

interface IState {
  timeLeft: number;
  intervalId: any;
  displayTime: string;
  isPaused: boolean;
  alarmId: any;
}

// State:
// Not in progress, Started, Paused, In Break

class Popup extends React.Component<IProps, IState> {
  public state: IState = {
    timeLeft: 0,
    intervalId: null,
    displayTime: '',
    isPaused: true,
  }

  constructor() {
    super();

    this.state = {
      timeLeft: 0,
      intervalId: null,
      displayTime: this.convertSecondsToDisplay(0),
      isPaused: true,
    }
    this.restoreFromLocalStorage();
  }

  private startTimer = () => {
    console.log('starting timer');
    if (this.state.intervalId) {
      this.pauseTimer();
    }
    this.resetTimer();
    this.resumeTimer();
  }

  private resumeTimer = () => {
    console.log('resuming timer');
    if (this.state.intervalId) {
      return;
    }
    const intervalHandle = setInterval(() => {
      let seconds = this.state.timeLeft - 1;
      this.setState({
        timeLeft: seconds,
        displayTime: this.convertSecondsToDisplay(seconds),
      });
      console.log(this.state.timeLeft);
      // In case user toggles out of extension
      this.writeTimeLeftToLocalStorage(seconds);
      const vm = this;
      if (this.state.timeLeft <= 0) {
        console.log("We are finished!");
        vm.pauseTimer();

        const audio = new Audio('../assets/Alert.mp3');
        // audio.play();
      }
    }, 1000); // Every second
    browser.alarms.create('pomodaroAlarm', {
        delayInMinutes: (this.state.timeLeft / 60)
    });

    this.setState({
      intervalId: intervalHandle,
      isPaused: false,
    });
    
  }

  private pauseTimer = () => {
    console.log('pausing timer');
    if (this.state.intervalId === null) {
      return;
    }
    window.clearInterval(this.state.intervalId);
    browser.alarms.clear('pomodaroAlarm');
    this.setState({
      intervalId: null,
      isPaused: true,
    });
    this.writeTimeLeftToLocalStorage(this.state.timeLeft);
  }

  private resetTimer = () => {
    console.log('reseting timer');
    // const seconds = 60*25;
    const seconds = 5;
    this.setState({
      timeLeft: seconds,
      displayTime: this.convertSecondsToDisplay(seconds),
    });
  }

  private convertSecondsToDisplay = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    let displayString = '';
    if (minutes < 10) {
      displayString += '0';
    }
    displayString += minutes.toString();
    displayString += ':';
    if (seconds < 10) {
      displayString += '0';
    }
    displayString += seconds.toString();
    return displayString;
  }

  private writeTimeLeftToLocalStorage = (timeLeft) => {
    const timestamp = this.state.isPaused ? null : Date.now() + timeLeft * 1000;
    console.log('writing to local storage: ' + timestamp);
    browser.storage.local.set({
      pomodaro_end: timestamp,
      timeLeft: timeLeft, // Not a superbly accurate estimate since we don't know when user tabs out
      isPaused: this.state.isPaused,
    });
  }

  private restoreFromLocalStorage = () => {
    let time = 0;
    const results = browser.storage.local.get(['pomodaro_end', 'timeLeft', 'isPaused']);
    results.then((storage) => {
      console.log(storage);
      if (storage.pomodaro_end) {
        time = parseInt(storage.pomodaro_end, 10);
        // Determine remaining time
        time = time - Date.now(); // If negative, than timer had elapsed
        time = Math.floor(time / 1000); // Convert back into seconds
      } else if (storage.timeLeft) { // Time was paused
        time = parseInt(storage.timeLeft, 10);
      }
      let isPaused = true;
      if (storage.isPaused) {
        isPaused = storage.isPaused === 'true';
      }
      if (time > 0) {
        this.setState({
          timeLeft: time,
          displayTime: this.convertSecondsToDisplay(time < 0 ? 0 : time),
          isPaused: isPaused,
        });
        if (!isPaused) {
          this.resumeTimer();
        }
      } else {
        localStorage.clear();
      }
      return time;
    }, () => {
      console.log('error');
      return 0;
    });
  }

  public render() {
    return (
    <div className="main-popup">
      <main className='timer-display'>
        <p>{this.state.displayTime}</p>
      </main>
      <section className='buttons-panel'>
        <button onClick={this.startTimer} className="">
          start
        </button>
        <button onClick={this.resumeTimer} className="">
          resume
        </button>
        <button onClick={this.pauseTimer} className="">
          pause
        </button>
        <button onClick={this.resetTimer} className="">
          reset
        </button>
      </section>
      <EncouragementGenerator></EncouragementGenerator>
    </div>
    )
  }
}

export default Popup;