import React, { Component } from 'react';
import timer from "./timer";
import time from "./time";
import VeiwTimer from "./veiwTimer";
import TimeLine from './timeline';
import { ColorPicker } from "./colorPicker";
import {clamp} from "./utils";

class ActivityTimer extends Component {
  state = { 
    timers: [],
    currentTimer: null,
    veiwAdvancedTimer: null,
    scale: 10,
    startTime: {
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
      second: new Date().getSeconds(),
    }
  } 
    componentDidMount() {
        this.interval = setInterval(() => {
          if(this.state.timers.length > 0 && this.state.currentTimer != null) {
            this.setState((prevState) => {
                const timers = prevState.timers.map((timer) => {
                  if (timer.index === this.state.currentTimer) {
                    return { ...timer, time: this.findTotalTime(timer.recentTimes)};
                  }
                  return timer;
                });
                return { timers };
            });
            this.findScale();
          }
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    findTotalTime(recentTimes) {
        let totalTime = 0;
        for (let i = 0; i < recentTimes.length - 1; i++) {
            const period = recentTimes[i];
            totalTime += time.subtract(period.end, period.start);
        }
        const currentTime = new Date();
        const curtime = {
            hour: currentTime.getHours(),
            minute: currentTime.getMinutes(),
            second: currentTime.getSeconds(),
        }
        totalTime += time.subtract(curtime, recentTimes[recentTimes.length - 1].start);
        return time.secondsToConventional(totalTime);
    }
    findScale = () => {
      let totalTime = 0;
      for (let i = 0; i < this.state.timers.length; i++) {
        const timer = this.state.timers[i];
        const { hour, minute, second } = timer.time;
        totalTime += time.conventionalToSeconds(hour, minute, second);
      }
      console.log(totalTime)
        // console.log(largestTime)
        
        this.setState({ scale: totalTime + 1 });
    }
      

    render_Timer(timer) {
        var name = (timer.changingName === false) ? <div className='name' onClick={() => this.changeTimerName(timer.index)}>{timer.name}</div> : (<div>
            <input type='text' onKeyDown={this.handleKeyPress}  placeholder={timer.name} ref={(input) => {this.newNameInput = input; if (input) {input.focus();}}}></input>
            <button onClick={() => this.changeName(timer.index, this.newNameInput.value)}>Set</button>
            <button onClick={() => this.cancelChangeName(timer.index)}>Cancel</button>
        </div>);
        const heightVal = time.conventionalToSeconds(timer.time.hour, timer.time.minute, timer.time.second);
        let totalTime = `${timer.time.hour}:${timer.time.minute}:${timer.time.second}`;
        const timerColorHeight = clamp(0.2, 3, heightVal / this.state.scale) * 100 + "px";
        const className = (timer.index === this.state.currentTimer) ? 'curTimer' : 'timer'; 
        console.log(heightVal / this.state.scale)
        return (
            <div className={className} key={timer.index} onClick={(event) => this.changeCurrentTimer(event, timer.index)}>
                {/* <div className="time" style={{ backgroundColor: timer.color, height: clamp(1, 3, heightVal / this.state.scale) * 100 + "px" }}></div> */}
                <div className='totalTime'></div>
                <ColorPicker 
                  color={timer.color}
                  timer={timer}
                  changeColor={this.changeColor}
                  height={timerColorHeight}
                />
                <div className='stats'>
                  {name}
                  <div>{totalTime}</div>
                  <button onClick={() => this.veiwAdvancedTimer(timer.index)}>Advanced</button>
                  {/* {recentTimes} */}
                </div>
            </div>
        );
    }
    handleCloseScreen = () => {
      this.setState({ veiwAdvancedTimer: null });
    }
    veiwAdvancedTimer = (index) => {
      const veiwTimer = this.state.timers.find(timer => timer.index === index);
      this.setState({ veiwAdvancedTimer: veiwTimer });
    }
    changeCurrentTimer = (event, index) => {
      console.log(event)
      if (event.target === event.currentTarget) {
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
      }
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
    cancelChangeName = (index) => {
      this.setState((prevState) => {
        const timers = prevState.timers.map((timer, i) => {
          if (timer.index === index) {
            return { ...timer, changingName: false };
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
    getSendData = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // January is 0, so we add 1
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      const startTime = `${this.state.startTime.hour}:${this.state.startTime.minute}:${this.state.startTime.second}`;
      const endTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
      console.log(formattedDate);
      console.log(startTime);
      console.log(endTime);
    }
    render() { 
        const timers = this.state.timers.map((timers) => 
            this.render_Timer(timers)
        );
        return (
        <div>
            {timers}
            <button onClick={this.handleAddTimer} className='addBtn'>
            +        
            </button>
            <VeiwTimer
              timer={this.state.veiwAdvancedTimer}
              handleCloseScreen={this.handleCloseScreen}
              handleRemoveTimer={this.handleRemoveTimer}
            />
            <button onClick={this.getSendData}>Save Workday</button>
        </div>
        );
    }
}
 
export default ActivityTimer;