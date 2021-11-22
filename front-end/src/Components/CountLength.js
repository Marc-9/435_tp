// eslint-disable-next-line
import React, { useState } from 'react'
import './CountLength.css'

function CountLength(props) {

    return (
        <div className="count-length">
            <div className="count-length-container">
                <div className="word-count">Word Count: {props.wordCount}</div>
                <div className="speech-length">Speech Time: {props.speechLength}</div>
            </div>
        </div>
    )
}

export default CountLength
