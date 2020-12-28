import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

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

let selectedDot = null;
let banner;

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

    postMoveToServer(color, i1, j1, i2, j2) {
        axios.post("/api/bridg-it/move", null, {params: {color, i1, j1, i2, j2}})
            .then(res => {
                let i = (selectedDot.props.i + this.props.i) / 2,
                    j = (selectedDot.props.j + this.props.j) / 2;
                board[i][j].setState({
                    color: res.data.color,
                    elementName: res.data.elementName
                });
                if (res.status === 202) {
                    banner.setState({isGameEnded: true});
                } else {
                    banner.setState({blueMove: !banner.state.blueMove});
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .then(() => {
                selectedDot.setState({id: ""});
                selectedDot = null;
            });
        //todo: ждать чужого хода
    }

    connectDots() {
        let isRightTurn = (banner.state.blueMove && this.state.color === "blue") ||
                          (!banner.state.blueMove && this.state.color === "red");
        if (!banner.state.isGameEnded && this.state.elementName === "dot" && selectedDot !== this && isRightTurn) {
            if (selectedDot == null) {
                selectedDot = this;
                selectedDot.setState({id: "selected-dot"});
            } else {
                let color = this.state.color,
                    i1 = selectedDot.props.i, j1 = selectedDot.props.j,
                    i2 = this.props.i, j2 = this.props.j;
                this.postMoveToServer(color, i1, j1, i2, j2);
            }
        } else {
            if (selectedDot != null) {
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
        let rowCells = new Array(11);
        for (let j = 0; j < initData.board[this.props.i].length; j++) {
            let color = initData.board[this.props.i][j].color,
                elementName = initData.board[this.props.i][j].elementName;
            let cell = React.createElement(BridgItCell, {
                key: this.props.i + "" + j,
                color: color,
                elementName: elementName,
                i: this.props.i,
                j: j
            });
            rowCells.push(cell);
        }
        return React.createElement("div", {className: "bridg-it-row"}, rowCells);
    }
}

class BridgItTable extends React.Component {

    render() {
        let rows = Array(11);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(11);
            rows.push(React.createElement(BridgItTableRow, {
                key: i,
                i: i,
            }));
        }
        return React.createElement("div", {className: "bridg-it-table"}, rows);
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
        return <h1>{(this.state.blueMove ? "Blue" : "Red") + (this.state.isGameEnded ? " have won!" : " move")}</h1>
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
);
