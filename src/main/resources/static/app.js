import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {


    render() {
        const  myValues = axios.get("http://google.com/");
        return (<h1>Hello</h1>)
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)