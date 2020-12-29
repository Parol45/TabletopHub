import axios from "axios";
import React from "react";

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

let banner;
let elemBoard = new Array(11);
let selectedDot = null;
let moveStream;

function subscribeToMoveStream() {
    if (moveStream) {
        moveStream.close();
    }
    moveStream = new EventSource("/api/bridg-it/subscribe");
    moveStream.onmessage = (e) => {
        let deserData = JSON.parse(e.data);
        elemBoard[deserData.i][deserData.j].setState({
            color: deserData.cell.color,
            elementName: deserData.cell.elementName
        });
        if (deserData.winning) {
            banner.setState({isGameEnded: true});
            moveStream.close();
        } else {
            banner.setState({blueMove: !banner.state.blueMove});
        }
    }
    moveStream.onerror = e => {
        console.log(e);
        moveStream.close();
    }
}

function postMoveToServer(color, i1, j1, i2, j2) {
    axios.post("/api/bridg-it/move", null, {params: {color, i1, j1, i2, j2}})
        .catch((error) => console.log(error))
        .then(() => {
            selectedDot.setState({id: ""});
            selectedDot = null;
        });
}

function reloadGame() {
    axios.get("/api/bridg-it/restart")
        .then(res => {
            banner.setState({
                isGameEnded: res.data.gameEnded,
                blueMove: res.data.blueMove
            });
            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < 11; j++) {
                    elemBoard[i][j].setState({
                        color: res.data.board[i][j].color,
                        elementName: res.data.board[i][j].elementName
                    });
                }
            }
            subscribeToMoveStream();
        })
        .catch(e => console.log(e))
}

class BridgItCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            color: this.props.color,
            elementName: this.props.elementName
        };
        elemBoard[this.props.i][this.props.j] = this;
        this.connectDots = this.connectDots.bind(this);
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
                postMoveToServer(color, i1, j1, i2, j2);
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
        for (let j = 0; j < 11; j++) {
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
        for (let i = 0; i < 11; i++) {
            elemBoard[i] = new Array(11);
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
        subscribeToMoveStream();
    }

    render() {
        return <div>
            <h1 key="header">
                <span key="red-span" style={{color: "red"}} className={!this.state.blueMove ? "" : "hidden"}>Red</span>
                <span key="blue-span" style={{color: "blue"}} className={this.state.blueMove ? "" : "hidden"}>Blue</span>
                {(this.state.isGameEnded ? " have won!" : " move")}
            </h1>
            <button key="reload-button" className={this.state.isGameEnded ? "" : "hidden"} onClick={reloadGame}>New game</button>
        </div>
    }
}

export {Banner, BridgItTable};
