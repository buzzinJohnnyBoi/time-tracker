import React, { Component } from 'react';
import Axios from 'axios';

class DashBoard extends Component {
    state = {  } 
    async createNew() {
        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // January is 0, so we add 1
            const day = currentDate.getDate();
            const formattedDate = `${year}-${month}-${day}`;
            const response = await Axios.post('http://192.168.1.224:3003/create', { date: formattedDate, userId: 1, });
            console.log(response);
        }
        catch(error) {
            console.error(error);
        }
    }
    render() { 
        return (<div>
            <h1>Dashboard</h1>
            <button onClick={this.createNew}>John</button>
        </div>);
    }
}
 
export default DashBoard;