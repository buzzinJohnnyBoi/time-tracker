import React, { Component } from 'react';
import Axios from 'axios';

class TestComp extends Component {
    sendTestData1() {
        console.log("yo");
        Axios.post('http://192.168.1.224:3003/create', {text: "you bro"});
    }
    render() { 
        return (<button onClick={this.sendTestData1}>Send Data test</button>);
    }
}
 
export default TestComp;