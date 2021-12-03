import React, { useState } from 'react'
// eslint-disable-next-line
import { Badge, Card, Button, InputGroup, FormControl } from 'react-bootstrap';
// eslint-disable-next-line
import Chart from 'chart.js/auto';
// eslint-disable-next-line
import { Line, Bar, Scatter, Doughnut } from 'react-chartjs-2'
// eslint-disable-next-line
import faker from 'faker';


const DELIMITERS = /\W+/;
const SPEECH_TIME_URL = "http://localhost:3030/speech_time";
const WORD_ID_URL = "http://localhost:3030/get_id";
// eslint-disable-next-line
const ID_INFO_URL = "http://localhost:3030/word_info";

function Home(props) {

    // eslint-disable-next-line
    const[currentText, setCurrentText] = useState("");
    const[searchText, setSearchText] = useState("");
    const[searchTextLength, setSearchTextLength] = useState(0);
    // const[wordId, setWordId] = useState(0);
    const[totalOccurrences, setTotalOccurrences] = useState(0);
    const[occurrencesOverTime, setOccurrencesOverTime] = useState([]);
    const[occurrencesByPercentage, setOccurrencesByPercentage] = useState([]);
    const[variance, setVariance] = useState(0);
    const[histData, setHistData] = useState({});

    let darkMode = {
        color: '#fff', 
        fontSize: '40px', 
        fontWeight: '400',
    }

    let barPlaceholderData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
            label: "Scatter Dataset",
            data: [10, 13, 5, 7, 14, 25],
            fill: true,
            backgroundColor: "DarkOliveGreen",},{
            label: "Second dataset",
            data: [33, 25, 35, 51, 54, 76],
            fill: false,
            backgroundColor: "GoldenRod",                                    }
        ]
    }

    let scatterPlaceholderData = {
        datasets: [{
            label: "Scatter Dataset",
            data: [
                {x: 2, y: 10}, {x: 3, y: 15},{x: 5, y: 13},{x: 13, y: 25},{x: 10, y: 22},
                {x: 7, y: 18},{x: 9, y: 19},{x: 10, y: 16},{x: 11, y: 21},{x: 16, y: 26},
                {x: 14, y: 16},{x: 7, y: 20},{x: 13, y: 24},{x: 17, y: 27},{x: 15, y: 31},
            ],
            backgroundColor: "LightCoral",
            borderColor: "IndianRed",
            },
        ]
    }

    function handleOnChange(e){
        var event = e.target.value;
        setCurrentText(event);
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
    function sec2time(timeInSeconds) {
        var pad = function(num, size) { return ('000' + num).slice(size * -1); },
        time = parseFloat(timeInSeconds).toFixed(3),
        hours = Math.floor(time / 60 / 60),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);
    
        return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
    }
    async function textareaAPI(){

        let data = {
            "speech": currentText
        };

        fetch(SPEECH_TIME_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            let time = sec2time(data.timeInSeconds)
            props.setSpeechLength(time);
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });;
    }

    async function oneWordAPI(){

        let wordId = 0;

        let data = {
            "word": searchText
        };

        await fetch(WORD_ID_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            console.log(data.id);
            wordId = data.id;
            // console.log(wordId);
            console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });;

        fetch(ID_INFO_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
             },
            body: JSON.stringify({"id": wordId})
        }).then(response => response.json())
        .then(data => {
            setSearchTextLength(data.avg_time);
            setTotalOccurrences(data.total_occurences);
            setVariance(data.variance);
            setOccurrencesOverTime(data.occurences_over_time);
            setOccurrencesByPercentage(data.occurences_by_percentage);
            console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });;
    }

    return (
        <div className="main" id="main">
            <br/>
            <div className="container my-5">
                <h1 className="text-center" style={darkMode}>Speech Timer - word counter and speech time calculator</h1>
                <br/>
                <hr/>
                <textarea
                    className="form-control"
                    id="text"
                    rows="10"
                    style={{backgroundColor: '#ede8e8'}}
                    placeholder="Paste text block or begin typing to begin calculations..."
                    onChange={(e) => handleOnChange(e)}
                ></textarea>
                <br/>
                <h1 className="text-center" style={darkMode}>Summary of the Text</h1>
                <br/>
                <div className="d-flex justify-content-md-around justify-content-around">
                    {/* <Badge bg="dark">Word Count: {props.wordCount}</Badge> */}
                    <Button variant="dark" onClick={textareaAPI}>
                        Calculate Speech Time
                    </Button>
                </div>
                <br/>
                <div className="d-flex justify-content-md-around justify-content-around">
                    <Card>
                        <Card.Header as="h5">Speech Statistics</Card.Header>
                        <Card.Body>
                            Word Count: {props.wordCount}<br/>
                            Speech Time: {props.speechLength}
                        </Card.Body>
                    </Card>
                </div>
                <br/>
                <div className="d-flex justify-content-md-around justify-content-around">
                    <Card>
                        <Card.Header as="h5">Find statistics for one word</Card.Header>
                        <Card.Body>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="type/paste word..."
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <Button variant="dark" id="button-addon2" onClick={(e) => oneWordAPI(searchText)}>
                                Search
                            </Button>
                        </InputGroup>
                        Average speaking time: {searchTextLength} <br/>
                        Total Occurrences: {totalOccurrences}<br/>
                        Variance: {variance}
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <div className="d-flex justify-content-md-around justify-content-around">
                <Card>
                    <Card.Header as="h5">Occurrences Over Time</Card.Header>
                    <Card.Body>
                        <Bar
                            data={barPlaceholderData}
                            options={{
                                responsive: true
                            }}
                        />
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header as="h5">Occurrences By Percentage</Card.Header>
                    <Card.Body>
                        <Scatter
                            data={scatterPlaceholderData}
                            options={{
                                responsive: true
                            }}
                        />
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default Home

// const run2 = () => {
//     if(document.activeElement?.id === 'text'){
//     console.log(document.activeElement.value.slice(document.activeElement.selectionStart, document.activeElement.selectionEnd))
//     }
//     }
