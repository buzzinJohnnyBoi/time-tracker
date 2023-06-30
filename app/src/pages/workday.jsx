import React, { Component } from 'react';
import Axios from 'axios';
import ActivityTimer from '../components/timers/ActivityTimer';

class WorkDay extends Component {
    state = {
        validDay: null,
        dayId: null,
    }
    componentDidMount() {
        this.getData();
    }
    async getData() {
        console.log("yo")
        try {
          const currentPath = window.location.pathname;
          const path = currentPath.substring(1, currentPath.length);
          const response = await Axios.post('http://192.168.1.224:3003/get', { userId: 1, id: path });
          console.log(response.data);
          if(response.data !== null) {
            this.setState({ validDay: true, dayId: path });
            this.activityTimer.receiveData(response.data);
          }
          else {
            this.setState({ validDay: false });
          }
          const dayData = response.data;
          this.setState({ day: dayData });
        } catch (error) {
          console.error(error);
        }
    }
    sendData = (data) => {
        try {
            const response = Axios.post('http://192.168.1.224:3003/send', { ...data, id: this.state.dayId });
            console.log(response);
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
        const content = (this.state.validDay === null) ? <h1>Loading...</h1> : ((this.state.validDay === false) ? <h1>not a valid day</h1> : <h1>WorkDay</h1>);
        return (
            <div>
                {content}
                <ActivityTimer 
                    ref={(ref) => (this.activityTimer = ref)} 
                    sendData={this.sendData} 
                    validDay={this.state.validDay}
                />
            </div>
        );
    }
}

export default WorkDay;
