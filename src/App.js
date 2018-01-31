import React, { Component } from 'react';
import Game from './players';

class App extends React.Component {  
    constructor(props) {
        super(props);
        this.state = {
            numPlayers: 2,  // Number of players, minimum number is 2
            started: false, 
        };
        this.numChange = this.numChange.bind(this);
        this.numSubmit = this.numSubmit.bind(this);
    };
    
    numChange(event) {
        this.setState({numPlayers: event.target.value});
    }
    
    numSubmit(event) {
        this.setState({started: true});
        event.preventDefault();
    }
    
    render() {
        // First let user input the number of players
        if(!this.state.started) {
            return (
                <div className="App">
                    <form onSubmit={this.numSubmit}>
                        <label>
                            Number of Players:
                            <input type="number" 
                                   name="players" 
                                   value={this.state.numPlayers} 
                                   onChange={this.numChange} 
                            />
                        </label>
                        <input type="submit" value="Submit and Start" />
                    </form>
                </div>
            );
        }
        // Then display the table
        else if(this.state.started) {
            return(
                <Game numPlayers={this.state.numPlayers}/>
            );
        }
        return null;
    }
}

export default App;
