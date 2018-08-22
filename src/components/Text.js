import React, { Component } from 'react';
import Heading from './Heading';
import fireDB from '../fireDB';
import VotingList from './VotingList';
class Text extends Component {

    constructor(){
        super();
        this.state = {
            text: []
        };
        let iterator = 0;
    }

    componentDidMount() { 
        fireDB.database().ref('masterSheet/').on('value', snapshot => { 
            this.setState({text : snapshot.val()});
        }); 
        } 


    render() {
        const oldLength = filteredList.length;
        const filteredList = Object.values(this.state.text).filter(elem => {
            return elem[3].length === 0;
        });
        console.log(filteredList[1]);
        return filteredList.length > 0 ?
            (<div>
            <Heading heading = {Object.values(filteredList[1])[1]}/>
            <VotingList text = { Object.values(filteredList[1])[2] }/>
            </div>) 
        :
        <div></div>;
    }
}

export default Text;