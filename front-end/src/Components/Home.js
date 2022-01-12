import React, { useState } from 'react'
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2'
import { darkMode, barPlaceholderData } from '../Constants/Constants';


const DELIMITERS = /\W+/;
const SPEECH_TIME_URL = "http://localhost/api/speech_time";
const WORD_ID_URL = "http://localhost/api/get_id";
const ID_INFO_URL = "http://localhost/api/word_info";

function Home(props) {

    const[currentText, setCurrentText] = useState("");
    const[searchText, setSearchText] = useState("");
    const[searchTextLength, setSearchTextLength] = useState(0);
    const[totalOccurrences, setTotalOccurrences] = useState(0);
    const[variance, setVariance] = useState(0);
    const[ootData, setootData] = useState(barPlaceholderData);
    const[obpData, setobpData] = useState(barPlaceholderData);
    const[varTime, setVarTime] = useState(0);


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
    function mapPerOverTime(occurrencesByPercentage){
        let obpMap = [];

        for(const element of occurrencesByPercentage){
            let percentage = element.percent;
            let occ = element.num_of_occurences;

            obpMap.push([Number(percentage), occ]);
        }

        let obpLabels = [];
        let obpData = [];
        obpMap = obpMap.sort((a,b)=> a[0]-b[0]);
        for(const element of obpMap){
            obpLabels.push(element[0]);
            obpData.push(element[1]);
        }

        setobpData({
            labels: obpLabels,
            datasets: [{
                label: "Num Occurences",
                data: obpData,
                fill: true,
                backgroundColor: "DarkOliveGreen",
            }],
        })
    }

    function mapOccOverTime(occurrencesOverTime){
        let ootMap = new Map();

        for(const element of occurrencesOverTime){
            let strDate = element.date;
            let occ = element.num_of_occurences;
            const dt = new Date(strDate);
            if(ootMap.has(dt.getFullYear())){
                let tmp = ootMap.get(dt.getFullYear());
                tmp += occ;
                ootMap.set(dt.getFullYear(), tmp);
            }
            else{
                ootMap.set(dt.getFullYear(), occ);
            }
        }
        let ootLabels = [];
        let ootData = [];
        ootMap = new Map([...ootMap.entries()].sort());
        for(const element of ootMap){
            ootLabels.push(element[0]);
            ootData.push(element[1]);
        }
        setootData({
            labels: ootLabels,
            datasets: [{
                label: "Num Occurences",
                data: ootData,
                fill: true,
                backgroundColor: "DarkOliveGreen",}
            ]
        })

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
            let varTime = sec2time(data.varianceInSeconds);
            setVarTime(varTime);
            props.setSpeechLength(time);
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
            wordId = data.id;
        })
        .catch((error) => {
          console.error('Error:', error);
        });;

        await fetch(ID_INFO_URL, {
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
            mapOccOverTime(data.occurences_over_time);
            mapPerOverTime(data.occurences_by_percentage);
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
                            Speech Time: {props.speechLength} ± {varTime}<br/>
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
                            data={ootData}
                            options={{
                                responsive: true
                            }}
                        />
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header as="h5">Occurrences By Percentage</Card.Header>
                    <Card.Body>
                        <Bar
                            data={obpData}
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
