// Student: Jevan Smith
// Assignment: Project1 (Mastermind)

import React, { Component } from 'react';
import './Mastermind.css';

const red = require('./images/redCircle.png');
const blue = require('./images/blueCircle.png');
const green = require('./images/greenCircle.png');
const purple = require('./images/purpleCircle.png');
const teal = require('./images/tealCircle.png');
const magenta = require('./images/magentaCircle.png');
const emptyCircle = require('./images/emptyCircle.png');
const NUM_ROWS = 10;

let uniqueSeed = 0;
function nextUniqueKey() {
    return uniqueSeed += 1;
}

class Cell extends React.Component {

    render() {
        return (
            <td key={nextUniqueKey()} onClick={() => this.props.handleClick(this.props.colIdx, this.props.rowIdx)} width="50px" height="50px">
                <img className="large_circle" src={this.props.cell['color']} alt={this.props.cell['colorName'] } />
            </td>
        )
    }
}

class Row extends Component {
    render() {
        if(this.props.current <= this.props.rowIdx) {
            return (
                <tr>{ this.props.row.map( (cell, idx) =>
                    <Cell key={nextUniqueKey()} cell={cell} colIdx={idx} feedback={this.props.feedback} rowIdx={this.props.rowIdx}
                    handleClick={this.props.handleClick} current={this.props.current}/>) } 
                <td><table><tbody>
                    <tr><td><img className="small_circle" src={this.props.feedback[this.props.rowIdx][0].color} alt={this.props.feedback[this.props.rowIdx][0].colorName} /></td>
                        <td><img className="small_circle" src={this.props.feedback[this.props.rowIdx][1].color} alt={this.props.feedback[this.props.rowIdx][1].colorName} /></td></tr>
                    <tr><td><img className="small_circle" src={this.props.feedback[this.props.rowIdx][2].color} alt={this.props.feedback[this.props.rowIdx][2].colorName} /></td>
                        <td><img className="small_circle" src={this.props.feedback[this.props.rowIdx][3].color} alt={this.props.feedback[this.props.rowIdx][3].colorName} /></td></tr>
                </tbody></table></td>
                </tr>
            )
        }
        else {
            return (
                <tr></tr>
            )
        }
    }
}

class Mastermind extends Component {

    paletteColors = [
        {color: green, colorName: 'Green'},
        {color: teal, colorName: 'Teal'},
        {color: magenta, colorName: 'Magenta'},
        {color: blue, colorName: 'Blue'},
        {color: red, colorName: 'Red'},
        {color: purple, colorName: 'Purple'}
    ];

    nonFilledCircle = {
        color: emptyCircle,
        colorName: 'Empty circle'
    };


    constructor(props) {
        super(props);

        let board = Array(NUM_ROWS).fill( [
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
        ]);
        
        let firstRowFeedback = Array(NUM_ROWS).fill( [
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
            this.nonFilledCircle,
        ]);

        let winningRow = this.selectWinningRow(this.paletteColors);
        console.log('%c Winning Row:', 'color: blue; font-weight: bold;', winningRow);

        this.state = {
            mastermindArray: board,
            feedbackArray: firstRowFeedback,
            statusCircle: {color: emptyCircle, colorName: 'Empty circle'},
            currentPosition: NUM_ROWS-1,
            winningRow,
            isWinner: false,
            isLoser: false
        }

        this.baseState = this.state // Retains base state values

        this.handleClick = this.handleClick.bind(this);
        this.checkIfRowIsFilled = this.checkIfRowIsFilled.bind(this);
        this.checkForAWinner = this.checkForAWinner.bind(this);
        this.checkForRedHints = this.checkForHints.bind(this);
        this.reset = this.reset.bind(this);
    }

    selectWinningRow(choices) {
        let array = [];
        for(let i = 0; i < 4; i++) {
          let randomIndex = this.getRandomIdx(0, choices.length-1) 
          var randomElement = choices[randomIndex]['colorName'];
          array.push(randomElement)
        }
        return array;
      }

    checkIfRowIsFilled(theRow) {
        for(let i = 0; i < 4; i++) {
            if(theRow[i]['colorName'] === "Empty circle") {
                return false;
            }
        }
        return true;
    }

    checkForAWinner(theRow) {
        let counter = 0;
        for(let i = 0; i < 4; i++) {
            if(theRow[i]['colorName'] === this.state.winningRow[i]) {
                counter++;
            }
        }
        if(counter === 4) {
            return true;
        }
        else {
            return false;
        }
    }

    checkForHints(theRow) {
        let array = [];
        let arraySkipValuei = [];
        let arraySkipValuej = [];
        
        // Check for Green Circles
        for(let i = 0; i < 4; i++) {
            if(theRow[i]['colorName'] === this.state.winningRow[i]) {
                array.push({
                    color: green,
                    colorName: "Green"
                });
                arraySkipValuei.push(i);
            }
        }
        
        // Check for Red Circles
        for(let i = 0; i < theRow.length; i++) { 
            if(arraySkipValuei.includes(i)) {
                continue;
            }
            for(let j = 0; j < theRow.length; j++) { 
                if(arraySkipValuei.includes(i)) {
                    break;
                }
                if(arraySkipValuei.includes(j)) {
                    continue;
                }
                if(arraySkipValuej.includes(j)) {
                    continue;
                }
                if(theRow[i]['colorName'] === this.state.winningRow[j]) {
                    arraySkipValuej.push(j)
                    array.push({
                        color: red,
                        colorName: "Red"
                    });
                    break;
                }
            }
        }
        return array;
    }

    handleClick(colIdx, rowIdx) {

        if (rowIdx !== this.state.currentPosition || 
            this.state.isWinner === true || this.state.isLoser === true)
            return;

        let theRow = this.state.mastermindArray[rowIdx].slice();
        let theFeedbackRow = this.state.feedbackArray[rowIdx].slice();

        theRow[colIdx] = {
            color: this.state.statusCircle['color'],
            colorName: this.state.statusCircle['colorName']
        }

        let newBoard = this.state.mastermindArray.slice();
        newBoard[rowIdx] = theRow;

        const isRowFilled = this.checkIfRowIsFilled(theRow);
        const isRowAWinner = this.checkForAWinner(theRow);

        if(isRowFilled === true && isRowAWinner === false) {
            const whatAreTheHints = this.checkForHints(theRow);
            if(whatAreTheHints.length >= 1) {
                    for(let i = 0; i < whatAreTheHints.length; i++) {
                    theFeedbackRow[i] = {
                        color: whatAreTheHints[i]['color'],
                        colorName: whatAreTheHints[i]['colorName']
                    }
                }
                let newFeedbackRow = this.state.feedbackArray.slice();
                newFeedbackRow[rowIdx] = theFeedbackRow;
                this.setState({feedbackArray: newFeedbackRow});
            }
            this.setState({currentPosition: this.state.currentPosition-1})
        }

        this.setState({mastermindArray: newBoard});

        if(isRowAWinner === true) {
            this.setState({isWinner: true})
            return;
        }

        if( this.state.currentPosition === 0 && isRowFilled === true &&
            this.state.isWinner === false) {
            this.setState({isLoser: true})
        }
    }

    componentDidMount() {

    }

    selectedPaletteCircle(circle) {
        let value = circle.colorName.toString();
        console.log('selected a palette color: ', '\n')
        console.log(`%c${circle.colorName}`, `color: ${value}; font-weight: bold;`);
        this.setState({statusCircle: circle});
    }

    getRandomIdx(low, high) {
            return Math.floor(Math.random() * (high - low + 1) + low);
    }

    paletteCircles() {
        return <table className="palette_circles"><tbody><tr>
            {
                this.paletteColors.map((paletteElement, idx) =>
                    <td key={idx} onClick={() => this.selectedPaletteCircle(paletteElement)}>
                        <img className="large_circle" src={paletteElement.color} alt={paletteElement.colorName} /></td>)
            }
          </tr></tbody></table>;

    }

    statusRow() {

        let {
            color,
            colorName
        } = this.state.statusCircle;

        return <table className="status_circles"><tbody>
                    <tr>
                    <td><img className="large_circle" src={color} alt={colorName} /></td></tr>
               </tbody></table>
    }
    
    winningMessage() {
        if(! this.state.isWinner) {
            return;
        }
        return (
            <div>
            <h2><font color="purple">YOU WIN!!!</font></h2>
            <b>Winning Colors: <font color={this.state.winningRow[0]}>{this.state.winningRow[0]}</font>/  
                <font color={this.state.winningRow[1]}>{this.state.winningRow[1]}</font>/ 
                <font color={this.state.winningRow[2]}>{this.state.winningRow[2]}</font>/  
                <font color={this.state.winningRow[3]}>{this.state.winningRow[3]}</font></b>
                <br></br>
                <br></br>
            <button onClick={this.reset}>Restart</button>
            </div>
        )
    };

    lossMessage() {
        if(! this.state.isLoser ) {
            return;
        }
        return (
            <div>
            <h2>YOU LOST!!!</h2>
            <b>Winning Colors: <font color={this.state.winningRow[0]}>{this.state.winningRow[0]}</font>/  
                <font color={this.state.winningRow[1]}>{this.state.winningRow[1]}</font>/ 
                <font color={this.state.winningRow[2]}>{this.state.winningRow[2]}</font>/  
                <font color={this.state.winningRow[3]}>{this.state.winningRow[3]}</font></b>
                <br></br>
                <br></br>
            <button onClick={this.reset}>Restart</button>
            </div>
        )
    };

    reset = () => {
        let winningRow = this.selectWinningRow(this.paletteColors);
        console.log('%c Winning Row:', 'color: blue; font-weight: bold;', winningRow);
        this.baseState['winningRow'] = winningRow
        this.setState(this.baseState)
    }

    render() {

        let temp = (this.state.currentPosition * 55).toString()+"px"

        return (
            
            <div className="Mastermind" align="center">
                <h1>MASTERMIND</h1>
                <h3>Created By: Jevan Smith</h3>
                <u><b>Info:</b></u> <b><font color="red">red</font></b> hint circles mean you have a correct color but not in the correct position.
                <br></br><b><font color="green">green</font></b> hint circles mean you have a correct color in the correct position.
                <br></br>For more game information click <a href="https://en.wikipedia.org/wiki/Mastermind_(board_game)" rel="noopener noreferrer" target="_blank">here</a> to go to wikipedia.
                <div style={{height: temp}}>&nbsp;</div>
                <br></br>
                <table border="0" align="center">
                <tbody>
                {
                    this.state.mastermindArray.map((row, idx) =>
                            <Row key={nextUniqueKey()} row={row} rowIdx={idx} 
                            feedback={this.state.feedbackArray}
                            handleClick={this.handleClick}
                            current={this.state.currentPosition} />)
                }
                </tbody>
                </table>
                {this.paletteCircles()}
                {this.statusRow()}
                {this.winningMessage()}
                {this.lossMessage()}

            </div>
        )

    }
}

export default Mastermind;
