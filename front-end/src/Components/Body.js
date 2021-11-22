import React from 'react';
import './Body.css';

const DELIMITERS = /\W+/;

function Body(props) {

    function handleOnChange(e){
        var event = e.target.value;
        event = event.trim();
        var text = event.split(DELIMITERS);
        var validWords = 0;
        for(let i of text){
            if(i !== ""){
                validWords += 1;
            }
        }
        props.setWordCount(validWords);
    }

    return (
        <div className="body">
            <div className="body-container">
                <textarea 
                    className="textarea-container" 
                    rows="20" 
                    cols="90" 
                    placeholder="Begin typing or paste text..."
                    onChange={(e) => handleOnChange(e) }></textarea>
            </div>
        </div>
    )
}

export default Body
