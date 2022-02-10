import * as React from 'react';
import browser from 'webextension-polyfill';

interface IProps {
}

interface IState {
  timeLeft: number;
  intervalId: any;
  displayTime: string;
}

class Popup extends React.Component<IProps, IState> {
  public state: IState = {
    timeLeft: 0,
    intervalId: null,
    displayTime: '',
  }

  constructor() {
    super();
    this.state = {
      timeLeft: 0,
      intervalId: null,
      displayTime: this.convertSecondsToDisplay(0),
    }
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
      if (this.state.timeLeft <= 0) {
        console.log("We are finished!");
        this.pauseTimer();
      }
    }, 1000); // Every second
    this.setState({
      intervalId: intervalHandle,
    });
  }

  private pauseTimer = () => {
    console.log('pausing timer');
    if (this.state.intervalId === null) {
      return;
    }
    window.clearInterval(this.state.intervalId);
    this.setState({
      intervalId: null,
    });
  }

  private resetTimer = () => {
    console.log('reseting timer');
    const seconds = 60*25;
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
    </div>
    )
  }
}

export default Popup;