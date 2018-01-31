import React, { Component } from 'react';

// Display the card for a single round
function RoundOutput(props) {
    return(
        <li style={{color:props.colour}}>
            Round {props.roundNum}: {props.card}
        </li>
    );
}

// Display the card for all rounds of a single player
class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,   
            outputs: [],    // Output in React Components
        };
    }
    
    componentWillReceiveProps(nextProps) {
        // Only update the output list when roundNum has changed
        if(this.props.roundNum !== nextProps.roundNum) {
            var outputs = this.state.outputs;
            var score = nextProps.score;
            var i = nextProps.roundNum;
            
            // Colour coding win/lose
            if(this.state.score !== nextProps.score) {
                outputs.push(<RoundOutput
                                key={nextProps.id * 100 + i}
                                roundNum={i}
                                card={nextProps.output[i - 1]}
                                colour={'Green'}        
                            />);
            }
            else {
                outputs.push(<RoundOutput
                                key={nextProps.id * 100 + i}
                                roundNum={i}
                                card={nextProps.output[i - 1]}
                                colour={'Red'}        
                            />);
            }
            this.setState({outputs: outputs});
            this.setState({score: score});
        }
    }
    
    render() {
        return(
            <td>
            <ul>
                <li>Player {this.props.id}</li>
                <li>Score {this.props.score}</li>
                <li><ul>{this.state.outputs}</ul></li>
            </ul>
            </td>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardLists: [],  // Cards each player has at hand
            scores: [],
            outputs: [],    // Output in int array 
            roundNum: 0,
            message: "",
        };
    }
    
    componentWillMount() {
        const numPlayers = this.props.numPlayers;
        var cardLists = new Array(numPlayers);
        var scores = new Array(numPlayers);
        var outputs = new Array(numPlayers);
        var cards = [];
        // Generate cards. Change j accordingly if more than one deck of cards are used
        for(var i = 1; i <= 13; i++ ) {
            for(var j = 0; j < 4; j++ ) {
                cards.push(i);
            }
        }
        
        // Randomly distribute cards to each player
        for(i = numPlayers - 1; i >= 0; i-- ) {
            cardLists[i] = new Array();
            scores[i] = 0;
            outputs[i] = new Array();
            for(j = Math.floor(52 / numPlayers); j > 0; j-- ) {
                var randIndex = Math.floor(Math.random()*(i * Math.floor(52 / numPlayers) + j - 1));
                cardLists[i].push(cards.splice(randIndex, 1)[0]);
            }
            cardLists[i].sort(function(a, b) {
                return a - b;
            });           
        }
        this.setState({cardLists: cardLists});
        this.setState({scores: scores});
        this.setState({outputs: outputs});   
        this.setState({roundNum: 0}); 
    }
    
    componentDidMount() {
        
        var remainingCards = 52;
        var interval = setInterval(function() { 
        const numPlayers = this.props.numPlayers;
        var cardLists = this.state.cardLists;
        var scores = this.state.scores;
        var outputs = this.state.outputs;
        var roundNum = this.state.roundNum;
        
        var winner = -1;
        var highest_value = 0;
        for(var i = 0; i < numPlayers; i++ ) {
            var card = cardLists[i].pop();
            if(card === null) {
                break;
            }
            // Check for winner
            if(card > highest_value) {
                highest_value = card;
                winner = i;
            } 
            // Check for draw
            else if (card === highest_value) {
                winner = -1;
            }
            outputs[i].push(card);
        }
        if(winner !== -1) {
            scores[winner] += 1;
        }
        roundNum += 1;        
        remainingCards -= numPlayers;
        
        // Check if all cards are drawn, if so, end game
        if(remainingCards < numPlayers) {
            clearInterval(interval);
            var max_score = -1;
            for(i = 0; i < numPlayers; i++ ) {
                if(scores[i] > max_score) {
                    max_score = scores[i];
                    winner = i + 1;
                }
                // Check for draw
                else if (scores[i] === max_score) {
                    winner = -1;
                }
            }
            if(winner === -1) {
                this.setState({message: 'Draw'});
            }
            else {
                this.setState({message: 'Winner is Player ' + (winner)});
            }
        }
        
        this.setState({cardLists: cardLists});
        this.setState({scores: scores});
        this.setState({outputs: outputs});    
        this.setState({roundNum: roundNum}); 
        
        }.bind(this), 1000);
    }
    
    render() {
        var output = [];
        for(var i = 0; i < this.props.numPlayers; i++ ) {
            output.push(<Player key={i + 1}
                                id={i + 1}
                                cardList={this.state.cardLists[i]}
                                score={this.state.scores[i]}
                                output={this.state.outputs[i]}
                                roundNum={this.state.roundNum}
                        />);
        }
        
        return(
            <div className="Table">
                <table>
                    <tbody><tr>{output}</tr></tbody>                    
                </table>
                <span>{this.state.message}</span>
            </div>
        );    
    }    
}

export default Game;