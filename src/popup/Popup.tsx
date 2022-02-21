import * as React from 'react';
import browser from 'webextension-polyfill';
import { EncouragementGenerator } from "./EncouragementGenerator";

import { debounce } from "ts-debounce";

const debounceOptions = {
  isImmediate: true,
};
const debounceWait = 50;

interface IProps {
}

interface IState {
  timeLeft: number;
  intervalId: any;
  displayTime: string;
  currentState: any;
  isBreak: boolean;
}

const breakTime = 5 * 60;
const focusTime = 25 * 60;
// const breakTime = 10;
// const focusTime = 5;

const DEBUG = true;

// State:
// Not in progress, Started, Paused, In Break
const STATE_NOT_STARTED = 'not_started';
const STATE_IN_PROGRESS = 'in_progress';
const STATE_PAUSED = 'paused';
const STATE_FINISHED = 'finished';

export const POMODARO_ALARM_ID = 'POMODARO_ALARM_ID';

class Popup extends React.Component<IProps, IState> {
  public state: IState = {
    timeLeft: 0,
    intervalId: null,
    displayTime: '',
    currentState: STATE_NOT_STARTED,
    isBreak: false,
  }

  constructor() {
    super();

    this.state = {
      timeLeft: 0,
      intervalId: null,
      displayTime: this.convertSecondsToDisplay(0),
      currentState: STATE_NOT_STARTED,
    }

    console.log('constructor')

    // TODO: Buggy as hell.
    this.restoreFromLocalStorage();
  }

  private startTimer = () => {
    if (DEBUG) {
      console.log('starting timer');
    }
    if (this.state.intervalId) {
      this.pauseTimer();
    }
    this.resetTimer();
    this.debouncedResumeTimer();
    browser.notifications.clear(POMODARO_ALARM_ID);
  }

  private resumeTimer = () => {
    if (DEBUG) {
      console.log('resuming timer');
    }
    if (this.state.intervalId) {
      return;
    }
    const intervalHandle = setInterval(() => {
      let seconds = this.state.timeLeft - 1;
      this.setState({
        timeLeft: seconds,
        displayTime: this.convertSecondsToDisplay(seconds),
      });

      if (DEBUG) {
        console.log(this.state.timeLeft);
      }
      const vm = this;
      if (this.state.timeLeft <= 0) {
        if (DEBUG) {
          console.log("We are finished!");
        }
        vm.pauseTimer();
        // const audio = new Audio('../assets/Alert.mp3');
        // audio.play();

        browser.notifications.create(POMODARO_ALARM_ID, {
            type: 'basic',
            iconUrl: '../assets/gallery.png',
            title: 'Times up!',
            message: "It's time to take a break!",
            priority: 2
        });

        window.clearInterval(this.state.intervalId);

        vm.setState({
          intervalId: null,
          currentState: STATE_FINISHED,
        });
      } else {
        // In case user toggles out of extension
        this.writeTimeLeftToLocalStorage(seconds);
      }
    }, 1000); // Every second

    this.setState({
      intervalId: intervalHandle,
      currentState: STATE_IN_PROGRESS,
    });
    
  }

  private pauseTimer = () => {
    if (DEBUG) {
      console.log('pausing timer');
    }
    if (this.state.intervalId === null) {
      return;
    }
    window.clearInterval(this.state.intervalId);
    // browser.alarms.clear('pomodaroAlarm');
    this.setState({
      intervalId: null,
      currentState: STATE_PAUSED,
    });
    this.writeTimeLeftToLocalStorage(this.state.timeLeft);
  }

  private resetTimer = () => {
    if (this.state.intervalId) {
      this.pauseTimer();
    }
    if (DEBUG) {
      console.log('reseting timer');
    }
    let seconds = focusTime;
    let { currentState, isBreak } = this.state;
    if (currentState === STATE_FINISHED) {
      isBreak = !isBreak;
      if (isBreak) {
        seconds = breakTime;
      }
    } else {
      isBreak = false;
    }

    this.setState({
      timeLeft: seconds,
      displayTime: this.convertSecondsToDisplay(seconds),
      isBreak: isBreak,
      currentState: STATE_NOT_STARTED,
    });

    this.writeTimeLeftToLocalStorage(seconds);
  }

  private buttonClick = () => {
    if (this.state.currentState === STATE_IN_PROGRESS) {
      this.pauseTimer();
    } else if (this.state.currentState === STATE_PAUSED) {
      this.debouncedResumeTimer();
    } else {
      this.startTimer();
    }
  }

  private debouncedResumeTimer = async () => {
    const debouncedFunction = debounce(this.resumeTimer, debounceWait, debounceOptions);
    await debouncedFunction();
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
    const timestamp = this.state.currentState === STATE_PAUSED ? null : Date.now() + timeLeft * 1000;
    const localData = {
      pomodaro_end: timestamp,
      timeLeft: timeLeft, // Not a superbly accurate estimate since we don't know when user tabs out
      currentState: this.state.currentState,
    };
    if (DEBUG) {
      console.log('writing to local storage: ' + JSON.stringify(localData));
      console.log('human readable date ' + new Date(timestamp));
    }
    browser.storage.local.set(localData);
  }

  private restoreFromLocalStorage = async () => {
    console.log('oncee? twice?')
    let time = 0;
    const storage = await browser.storage.local.get(['pomodaro_end', 'timeLeft', 'currentState']);

    let runOnce = false;
    console.log(storage);
    if (runOnce) {
      return;
    }
    runOnce = true;
    if (DEBUG) {
      console.log(JSON.stringify(storage));
    }
    if (storage.pomodaro_end) {
      time = parseInt(storage.pomodaro_end, 10);
      // Determine remaining time
      time = time - Date.now(); // If negative, than timer had elapsed
      time = Math.floor(time / 1000); // Convert back into seconds
    } else if (storage.timeLeft) { // Time was paused
      time = parseInt(storage.timeLeft, 10);
    }
    let currentState = STATE_NOT_STARTED;
    if (storage.currentState) {
      currentState = storage.currentState;
    }
    if (time > 0) {
      this.setState({
        timeLeft: time,
        displayTime: this.convertSecondsToDisplay(time < 0 ? 0 : time),
        currentState: currentState,
      });
      if (currentState === STATE_IN_PROGRESS) {
        this.debouncedResumeTimer();
      }
    } else {
      localStorage.clear();
    }
    return time;
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