import browser from 'webextension-polyfill';

// let currentTab: any;

// browser.tabs.query({active: true, currentWindow: true}).then(tabs => currentTab = tabs[0])

export const Popup = () => {

  let timeLeft = 0;
  let intervalId = null;

  const startTimer = () => {
    if (intervalId) {
      pauseTimer();
    }
    resetTimer();
    resumeTimer();
  }

  const resumeTimer = () => {
    if (intervalId) {
      return;
    }
    intervalId = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        console.log("We are finished!");
      }
    }, 1000); // Every second
  }

  const pauseTimer = () => {
    if (intervalId === null) {
      return;
    }
    window.clearInterval(intervalId);
    intervalId = null;
  }

  const resetTimer = () => {
    timeLeft = 60*25;
  }

  const convertSecondsToDisplay = () => {
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

  return (
    <div className="main-popup">
      <main className='timer-display'>
        <p>{convertSecondsToDisplay()}</p>
      </main>
      <section className='buttons-panel'>
        <button onClick={startTimer} className="">
          {/* <img src="../assets/cat_512.png" alt="cat icon" className="w-8 h-8 mr-3" /> */}
          start
        </button>
        <button onClick={resumeTimer} className="">
          resume
        </button>
        <button onClick={pauseTimer} className="">
          pause
        </button>
        <button onClick={resetTimer} className="">
          reset
        </button>
      </section>
    </div>
    )
}