import React from "react";
import ReactDOM from "react-dom";
import {Banner, BridgItTable} from "./games/bridg-it"

class App extends React.Component {

    render() {
        return [React.createElement(Banner, {key: "banner1488"}),
            React.createElement(BridgItTable, {key: "table1488"})]
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);
