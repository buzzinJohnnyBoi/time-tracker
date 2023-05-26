import React, { Component } from 'react';
import timer from "./timer";
import time from "./time";
import { ColorPicker } from "./colorPicker";
import {clamp} from "./utils";

class ActivityTimer extends Component {
  state = { 
    timers: [],
    currentTimer: 0,
    scale: 10,
    startTime: {
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
      second: new Date().getSeconds(),
    }
  } 
    // componentDidMount() {
    //     this.interval = setInterval(() => {
    //         this.setState((prevState) => {
    //             const timers = prevState.timers.map((timer) => {
    //               if (timer.index === this.state.currentTimer) {
    //                 return { ...timer, time: this.findTotalTime(timer.recentTimes)};
    //               }
    //               return timer;
    //             });
    //             return { timers };
    //         });
    //         this.findScale();
    //     }, 1000 * 10);
    // }
    // componentWillUnmount() {
    //     clearInterval(this.interval);
    // }
    findTotalTime(recentTimes) {
        let totalTime = 0;
        for (let i = 0; i < recentTimes.length; i++) {
            const period = recentTimes[i];
            totalTime += time.subtract(period.end, period.start);
        }
        return time.secondsToConventional(totalTime);
    }
    findScale = () => {
      // let smallestTime = Infinity;
      // for (let i = 0; i < this.state.timers.length; i++) {
      //   for (let j = 0; j < this.state.timers[i].recentTimes.length; j++) {
      //     const timer
      //     if(time.conventionalToSeconds(time.state.timers[i].recentTimes[j]) < smallestTime) {
      //       smallestTime = 
      //     }
      //   }
      //   const timer = this.state.timers[i];
      //   const { hour, minute, second } = timer.time;
      //   totalTime += time.conventionalToSeconds(hour, minute, second);
      // }
      const currentTime = new Date();
      const curtime = {
          hour: currentTime.getHours(),
          minute: currentTime.getMinutes(),
          second: currentTime.getSeconds(),
      }
      const totalTime = time.subtract(curtime, this.state.startTime);
      console.log(totalTime)
        // console.log(largestTime)
        
        this.setState({ scale: totalTime });
    }
      

    render_Timer(timer) {
        var name = (timer.changingName === false) ? <div className='name' onClick={() => this.changeTimerName(timer.index)}>{timer.name}</div> : (<div>
            <input type='text' onKeyDown={this.handleKeyPress}  placeholder={timer.name} ref={(input) => {this.newNameInput = input; if (input) {input.focus();}}}></input>
            <button onClick={() => this.changeName(timer.index, this.newNameInput.value)}>Set</button>
        </div>);
        let j = 0;
        const recentTimes = timer.recentTimes.map((i) => {
          j++;
          const time = !(i.hasOwnProperty('end')) ? <h6>{i.start.hour}:{i.start.minute}:{i.start.second}</h6> : (<React.Fragment> <h6>{i.start.hour}:{i.start.minute}:{i.start.second}</h6> - <h6>{i.end.hour}:{i.end.minute}:{i.end.second}</h6></React.Fragment>)
          return (
            <div key={j} className='recentTime'>
              {time}
            </div>
          );
        });
        const heightVal = time.conventionalToSeconds(timer.time.hour, timer.time.minute, timer.time.second);
        let totalTime = `${timer.time.hour}:${timer.time.minute}:${timer.time.second}`;
        const timerColorHeight = clamp(0.1, 3, heightVal / this.state.scale) * 1000 + "px";
        return (
            <div className='timer' key={timer.index}>
                {/* <div className="time" style={{ backgroundColor: timer.color, height: clamp(1, 3, heightVal / this.state.scale) * 100 + "px" }}></div> */}
                <ColorPicker 
                  color={timer.color}
                  timer={timer}
                  changeColor={this.changeColor}
                  height={timerColorHeight}
                />
                {name}
                <div>{totalTime}</div>
                <button onClick={() => this.handleRemoveTimer(timer.index)}>Remove Timer</button><br></br>
                <button onClick={() => this.changeCurrentTimer(timer.index)}>Set As Current timer</button>
                {recentTimes}
            </div>
        );
    }
    changeCurrentTimer = (index) => {

        const currentTime = new Date();
        const time = {
            hour: currentTime.getHours(),
            minute: currentTime.getMinutes(),
            second: currentTime.getSeconds(),
        }
        this.setState((prevState) => {
            const timers = prevState.timers.map((timer, i) => {
              if (timer.index === this.state.currentTimer) {
                const newTimes = timer.recentTimes;
                newTimes[timer.recentTimes.length - 1] = {start: newTimes[timer.recentTimes.length - 1].start, end: time}
                return { ...timer, time: this.findTotalTime(newTimes), recentTimes: newTimes };
              }
              else if (timer.index === index) {
                const newTimes = [...timer.recentTimes];
                newTimes.push({start: time});
                return { ...timer, recentTimes: newTimes };
              }
              return timer;
            });
            return { timers };
        });
        this.setState({ currentTimer: index });
        this.findScale();
    };
    handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        for (let i = 0; i < this.state.timers.length; i++) {
          const timer = this.state.timers[i];
          if(timer.changingName) {
            this.changeName(timer.index, event.target.value);
          }          
        }
      }
    };
    changeTimerName = (index) => {
        this.setState((prevState) => {
            const timers = prevState.timers.map((timer, i) => {
              if (timer.index === index) {
                return { ...timer, changingName: true };
              }
              return timer;
            });
            return { timers };
        });
    }
    changeName = (index, newName) => {
        if(newName.trim() !== '') {
            this.setState((prevState) => {
              const timers = prevState.timers.map((timer, i) => {
                if (timer.index === index) {
                  return { ...timer, name: newName, changingName: false };
                }
                return timer;
              });
              return { timers };
            });
        }
    };
    changeColor = (timer, color) => {
      this.setState((prevState) => {
        const timers = prevState.timers.map((i) => {
          if (i.index === timer.index) {
            return { ...i, color: color};
          }
          return i;
        });
        return { timers };
      });
    }
    handleAddTimer = () => {
        if(this.state.timers.length > 0) {
            const newTimer = new timer(this.state.timers[this.state.timers.length - 1].index + 1);
            this.setState((prevState) => ({
              timers: [...prevState.timers, newTimer]
            }));
        }
        else {
            const newTimer = new timer(1);
            this.setState((prevState) => ({
                timers: [newTimer]
            }));
        }
    };
    handleRemoveTimer = (timerId) => {
        this.setState((prevState) => ({
          timers: prevState.timers.filter((timer) => timer.index !== timerId)
        }));
    };
    render() { 
        const timers = this.state.timers.map((timers) => 
            this.render_Timer(timers)
        );
        return (
        <div>
            {timers}
            <button onClick={this.handleAddTimer}>Add Timer</button>
        </div>
        );
    }
}
 
export default ActivityTimer;