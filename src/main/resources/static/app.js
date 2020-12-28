import React from 'react';
import ReactDOM from 'react-dom';

console.clear();

var selectedDot = null;
var board = new Array(11);

const figuresEnum = Object.freeze({
    'nothing': "",
    'dot':
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx='8' cy='8' r='8' />
        </svg>,
    'horizontal line':
        <svg viewBox="0 0 50 10" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="7" x2="50" y2="7" />
        </svg>,
    'vertical line':
        <svg viewBox="0 0 10 50" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="0" x2="5" y2="50" />
        </svg>
});

class BridgItCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.color,
            elementName: this.props.elementName
        }
        board[this.props.i][this.props.j] = this;
        this.connectDots = this.connectDots.bind(this);
    }

    connectDots() {
        board[1][1].setState({color: 'blue',elementName: 'vertical line'});
        board[2][2].setState({color: 'red' ,elementName: 'vertical line'});
        board[0][2].setState({color: 'blue',elementName: 'horizontal line'});
        board[1][3].setState({color: 'red' ,elementName: 'horizontal line'});
        if (selectedDot == null) {
            selectedDot = this;
        } else if (selectedDot !== this) {
            console.log(selectedDot.props.i + " " + selectedDot.props.j);
            console.log(this.props.i + " " + this.props.j);
            this.setState({elementName: 'nothing'});
            selectedDot = null;
        }
    }

    render() {
        return React.createElement('div', {
                className: this.state.color + ' ' + this.state.elementName,
                onClick: this.connectDots
            },
            figuresEnum[this.state.elementName]);

    }
}

class BridgItTableRow extends React.Component {

    render() {
        let row = React.createElement('div', {className: 'bridg-it-row'}, []);
        for (let j = 0; j < 11; j++) {
            let elementName, color = '';
            if ((this.props.i + j) % 2 !== 0) {
                color = this.props.i % 2 === 1 ? 'red' : 'blue';
                elementName = 'dot';
            } else {
                elementName = 'nothing'
            }
            row.props.children.push(
                React.createElement(BridgItCell, {
                    key: this.props.i + '' + j,
                    color: color,
                    elementName: elementName,
                    i: this.props.i,
                    j: j
                }));
        }
        return row;
    }
}

class BridgItTable extends React.Component {

    render() {
        let table = React.createElement('div', {className: 'bridg-it-table'}, []);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(11);
            table.props.children.push(React.createElement(BridgItTableRow, {
                key: i,
                i: i,
            }));
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
