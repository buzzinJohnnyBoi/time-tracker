import React, { Component } from 'react';


class VeiwTimer extends Component {
    render() { 
        const timer = this.props.timer;
        if(timer != null) {
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
            let totalTime = `${timer.time.hour}:${timer.time.minute}:${timer.time.second}`;
            return (
                <React.Fragment>
                    <div className='cancelScreen' onClick={() => this.props.handleCloseScreen()}></div>
                    <div className='advancedStats'>
                        <button onClick={() => {this.props.handleCloseScreen(); this.props.handleRemoveTimer(timer.index);}}>Remove Timer</button><br></br>
                        {timer.name}
                        <div>{totalTime}</div>
                        <div>time periods:</div>
                        {recentTimes}  

                    </div>
                </React.Fragment>
            );
        }        
    }
}
 
export default VeiwTimer;