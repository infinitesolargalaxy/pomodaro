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
  currentState: any;
}

const breakTime = 5 * 60;
// const focusTime = 25 * 60;
const focusTime = 5;

// State:
// Not in progress, Started, Paused, In Break
const STATE_NOT_STARTED = 'not_started';
const STATE_IN_PROGRESS = 'in_progress';
const STATE_PAUSED = 'paused';
const STATE_FINISHED = 'finished';
// const STATE_IN_BREAK = 'in_break';

export const POMODARO_ALARM_ID = 'POMODARO_ALARM_ID';

class Popup extends React.Component<IProps, IState> {
  public state: IState = {
    timeLeft: 0,
    intervalId: null,
    displayTime: '',
    isPaused: true,
    currentState: STATE_NOT_STARTED,
  }

  constructor() {
    super();

    this.state = {
      timeLeft: 0,
      intervalId: null,
      displayTime: this.convertSecondsToDisplay(0),
      isPaused: true,
      currentState: STATE_NOT_STARTED,
    }

    // TODO: Buggy as hell.
    // this.restoreFromLocalStorage();
  }

  private startTimer = () => {
    console.log('starting timer');
    if (this.state.intervalId) {
      this.pauseTimer();
    }
    this.resetTimer();
    this.resumeTimer();
    browser.notifications.clear(POMODARO_ALARM_ID);
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

        vm.setState({
          currentState: STATE_FINISHED,
        });
        // audio.play();

        browser.notifications.create(POMODARO_ALARM_ID, {
            type: 'basic',
            iconUrl: '../assets/gallery.png',
            title: 'Times up!',
            message: "It's time to take a break!",
            priority: 2
        });
      }
    }, 1000); // Every second

    this.setState({
      intervalId: intervalHandle,
      isPaused: false,
      currentState: STATE_IN_PROGRESS,
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
      currentState: STATE_PAUSED,
    });
    this.writeTimeLeftToLocalStorage(this.state.timeLeft);
  }

  private resetTimer = () => {
    if (this.state.intervalId) {
      this.pauseTimer();
    }
    console.log('reseting timer');
    let seconds = focusTime;
    if (this.state.currentState === STATE_FINISHED) {
      seconds = breakTime;
    }

    this.setState({
      timeLeft: seconds,
      displayTime: this.convertSecondsToDisplay(seconds),
    });
  }

  private buttonClick = () => {
    if (this.state.currentState === STATE_IN_PROGRESS) {
      this.pauseTimer();
    } else if (this.state.currentState === STATE_PAUSED) {
      this.resumeTimer();
    } else {
      this.startTimer();
    }
  }

  private getButtonName = () => {
    if (this.state.currentState === STATE_IN_PROGRESS) {
      return 'Pause';
    } else if (this.state.currentState === STATE_PAUSED) {
      return 'Resume';
    } else {
      return 'Start';
    }
  }

  private getButtonIconSrc = () => {
    if (this.state.currentState === STATE_IN_PROGRESS) {
      return '../assets/pause-solid.svg';
    } else if (this.state.currentState === STATE_PAUSED) {
      return '../assets/play-solid.svg';
    } else {
      return '../assets/play-solid.svg';
    }
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
        <button onClick={this.buttonClick} className="cta-button" title={this.getButtonName()}>
          <img src={this.getButtonIconSrc()} alt={this.getButtonName()}></img>
        </button>

        { this.state.currentState == STATE_IN_PROGRESS ? 
          <button onClick={this.resetTimer} className="cta-button" title="Reset">
            <img src="../assets/arrows-rotate-solid.svg" alt="Reset"></img>
          </button>
          : null
        }
      </section>
      { this.state.currentState == STATE_FINISHED ? <EncouragementGenerator></EncouragementGenerator> : null }
    </div>
    )
  }
}

export default Popup;