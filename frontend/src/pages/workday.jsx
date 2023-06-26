import React, { Component } from 'react';
import Axios from 'axios';
import ActivityTimer from '../components/timers/ActivityTimer';

class WorkDay extends Component {
    state = {
        day: null
    }
    componentDidMount() {
        this.getData();
    }
    async getData() {
        console.log("yo")
        try {
          const currentPath = window.location.pathname;
          const dayId = currentPath.substring(1, currentPath.length);
          const response = await Axios.post('http://192.168.1.224:3003/get', { userId: 1, date: dayId });
          this.activityTimer.receiveData(response.data);
          const dayData = response.data;
          this.setState({ day: dayData });
        } catch (error) {
          console.error(error);
        }
    }
    sendData(data) {
        try {
            const response = Axios.post('http://192.168.1.224:3003/send', { ...data });
        }
        catch(error) {
            console.error(error);
        }
        console.log(data)
    }
    handleClick = () => {
        this.activityTimer.receiveData("hello");
    }
    render() {
        return (
            <div>
                <h1>WorkDay</h1>
                <button onClick={this.handleClick}></button>
                <ActivityTimer 
                    ref={(ref) => (this.activityTimer = ref)}
                    sendData={this.sendData}
                />
            </div>
        );
    }
}

export default WorkDay;
