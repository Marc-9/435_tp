import './App.css';
import React, { useState } from 'react';
import Header from './Components/Header';
import Body from './Components/Body';
import CountLength from './Components/CountLength';
import Plots from './Components/Plots';

function App() {

  // eslint-disable-next-line
  const[wordCount, setWordCount] = useState(0);
  // eslint-disable-next-line
  const[speechLength, setSpeechLength] = useState(0);

  return (
    <>
      <Header />
      <Body wordCount={wordCount} setWordCount={setWordCount}/>
      <CountLength wordCount={wordCount} speechLength={speechLength} />
      <Plots />
    </>
  );
}

export default App;
