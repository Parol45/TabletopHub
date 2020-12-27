import React from 'react';
import ReactDOM from 'react-dom';

let selectedDot = null;
const DaysEnum = Object.freeze({"nothing":0, "redDot":1, "blueDot":2, "redLine":3, "blueLine":4})

function connectDots() {

}

class BridgItDot extends React.Component {
    render() {
        if ((this.props.color === 'blue' && this.props.i % 2 === 1) || (this.props.color === 'red' && this.props.i % 2 === 0)) {
            return React.createElement('div', {className: this.props.color + '-dot'},
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                    <circle cx='5' cy='5' r='5' fill={this.props.color}/>
                </svg>);
        } else {
            return React.createElement('div', {className: 'no-dot'},
                <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                    <circle cx='5' cy='5' r='5' fill='rgba(0, 0, 0, 0)'/>
                </svg>);
        }
    }
}

class BridgItTableRow extends React.Component {

    render() {
        let row = React.createElement('div', {className: 'bridg-it-row'}, []);
        for (let i = 0; i < 11; i++) {
            let dot = React.createElement(BridgItDot, {color: this.props.color, key: i, i: i});
            row.props.children.push(dot);
        }
        return row;
    }
}

class BridgItTable extends React.Component {
    constructor(props) {
        super(props);
        let board = new Array(11);
        for (let i = 0; i < board.length; i++) {

        }
        this.state = { board: board };
    }

    render() {
        let table = React.createElement('div', {className: 'bridg-it-table'}, []);
        for (let i = 0; i < 11; i++) {
            let line = React.createElement(BridgItTableRow, {color: i % 2 === 1 ? 'red' : 'blue', key: i});
            table.props.children.push(line);
        }
        return table;
    }
}

class App extends React.Component {

    render() {
        //const  myValues = axios.get("http://google.com/");
        return (<BridgItTable/>)
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)
