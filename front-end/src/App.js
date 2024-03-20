import './App.css';
import React, { useState } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
// import CountLength from './Components/CountLength';
// import Plots from './Components/Plots';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line

function App() {

  // eslint-disable-next-line
  const[wordCount, setWordCount] = useState(0);
  // eslint-disable-next-line
  const[speechLength, setSpeechLength] = useState(0);

  return (
    <>
      <Header
        title="Test Test"
        about="About Us"
      />
      <Home
        wordCount={wordCount}
        setWordCount={setWordCount}
        speechLength={speechLength}
        setSpeechLength={setSpeechLength}
      />
      <Footer />
    </>
  );
}

export default App;
