import React from "react";
import ReactDOM from "react-dom";

let selectedDot = null;
let blueMove = true,
    isGameEnded = false;
let banner;

const board = new Array(11);

const figuresEnum = Object.freeze({
    "nothing": "",
    "dot":
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8"/>
        </svg>,
    "horizontal line":
        <svg viewBox="0 0 50 10" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="7" x2="50" y2="7"/>
        </svg>,
    "vertical line":
        <svg viewBox="0 0 10 50" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="0" x2="5" y2="50"/>
        </svg>
});

class BridgItCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            color: this.props.color,
            elementName: this.props.elementName
        };
        board[this.props.i][this.props.j] = this;
        this.connectDots = this.connectDots.bind(this);
    }

    connectDots() {
        let isAllowedMove = (blueMove && this.state.color === "blue") || (!blueMove && this.state.color === "red");
        if (!isGameEnded && this.state.elementName === "dot" && isAllowedMove) {
            if (selectedDot == null) {
                selectedDot = this;
                selectedDot.setState({id: "selected-dot"});
            } else {
                let isVertical = selectedDot.props.j === this.props.j && Math.abs(selectedDot.props.i - this.props.i) === 2,
                    isHorizontal = selectedDot.props.i === this.props.i && Math.abs(selectedDot.props.j - this.props.j) === 2;
                if (selectedDot !== this && (isVertical || isHorizontal)) {
                    let i = (selectedDot.props.i + this.props.i) / 2,
                        j = (selectedDot.props.j + this.props.j) / 2;
                    if (board[i][j].state.elementName === "nothing") {
                        let elementName = isHorizontal ? "horizontal line" : "vertical line";
                        board[i][j].setState({color: this.state.color, elementName: elementName});
                        blueMove = !blueMove;
                        banner.setState({blueMove: blueMove});
                    }
                }
                selectedDot.setState({id: ""});
                selectedDot = null;
            }
        }
    }

    render() {
        return React.createElement("div", {
                id: this.state.id,
                className: this.state.color + " " + this.state.elementName,
                onClick: this.connectDots
            },
            figuresEnum[this.state.elementName]);

    }
}

class BridgItTableRow extends React.Component {

    render() {
        let row = React.createElement("div", {className: "bridg-it-row"}, []);
        for (let j = 0; j < 11; j++) {
            let elementName, color = "";
            if ((this.props.i + j) % 2 !== 0) {
                color = this.props.i % 2 === 1 ? "red" : "blue";
                elementName = "dot";
            } else if ((j === 0 || j === 10) && this.props.i < 9 && this.props.i > 1) {
                color = "red"
                elementName = "vertical line"
            } else if ((this.props.i === 0 || this.props.i === 10) && j < 9 && j > 1) {
                color = "blue"
                elementName = "horizontal line"
            } else {
                elementName = "nothing"
            }
            row.props.children.push(
                React.createElement(BridgItCell, {
                    key: this.props.i + "" + j,
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
        let tableDiv = React.createElement("div", {className: "bridg-it-table"}, []);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(11);
            tableDiv.props.children.push(React.createElement(BridgItTableRow, {
                key: i,
                i: i,
            }));
        }
        return tableDiv;
    }
}

class Banner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isGameEnded: initData.gameEnded,
            blueMove: initData.blueMove
        };
        banner = this;
    }

    render() {
        return <h1>{(blueMove ? "Blue" : "Red") + (this.state.isGameEnded ? " have won!" : " move")}</h1>
    }
}

class App extends React.Component {

    render() {
        return [<Banner/>, <BridgItTable/>]
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
)
