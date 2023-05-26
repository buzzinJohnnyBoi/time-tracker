import React, { Component } from 'react';
import timer from "./timer";
import time from "./time";

class ActivityTimer extends Component {
    state = { 
        timers: [
            {
                index: 0,
                name: "New timer",
                time: {
                    hour: 0,
                    minute: 0,
                    second: 0,
                },
                changingName: false,
                color: "red",
                recentTimes: [{
                    start: {
                        hour: 12,
                        minute: 27,
                        second: 31,
                    },
                }]
            },
        ],
        currentTimer: 0,
        scale: 10
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
        const largestTime = this.state.timers.reduce((maxTime, timer) => {
          const tt = time.conventionalToSeconds(timer.time); // Convert { hour, minute, second } to seconds
          return tt > maxTime ? tt : maxTime;
        }, 0);
        
        console.log(largestTime);
        
        this.setState({ scale: largestTime });
      }
      
    render_Timer(timer) {
        var name = (timer.changingName === false) ? <div className='name' onClick={() => this.changeTimerName(timer.index)}>{timer.name}</div> : (<div>
            <input type='text' placeholder={timer.name} ref={(input) => {this.newNameInput = input; if (input) {input.focus();}}}></input>
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
        console.log(heightVal / this.state.scale * 100)
        let totalTime = `${timer.time.hour}:${timer.time.minute}:${timer.time.second}`;
        return (
            <div className='timer' key={timer.index}>
                <div className="time" style={{ backgroundColor: timer.color, height: heightVal / this.state.scale * 100 + "px" }}></div>
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
                console.log(this.findTotalTime(newTimes))
                return { ...timer, time: this.findTotalTime(newTimes), recentTimes: newTimes };
              }
              else if (timer.index === index) {
                const newTimes = [...timer.recentTimes];
                newTimes.push({start: time});
                console.log(newTimes)
                return { ...timer, recentTimes: newTimes };
              }
              return timer;
            });
            return { timers };
        });
        this.setState({ currentTimer: index });
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