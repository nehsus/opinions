import React, { Suspense, Loading, useState, useEffect } from 'react';
import './App.css';
import AutoCompleteUniversity from './AutoCompleteUniversity'
import AutoCompleteProfessor from './AutoCompleteProfessor'
import ChartUniversity from './ChartUniversity'

import Chart from './Chart';
/**
 * Entrypoint: functional react app
 * @returns App
 */
export default function App() {

  const [s1, sets1] = useState(true);
  const [s2, sets2] = useState(false);
  const [s3, sets3] = useState(false);
  const [s4, sets4] = useState(false);
  const [inp1, setinp1] = useState("")
  const [s1data, sets1data] = useState([]);
  const [s2data, sets2data] = useState([]);
  const [s3data, sets3data] = useState([]);
  const [c1, setc1] = useState();
  const [c2, setc2] = useState();
  const [c3, setc3] = useState();
  const [c4, setc4] = useState();
  const [chart, setchart] = useState([])
  

  console.log("getting data..")

  const fetchProfessors = async (p) => {
    const response = await fetch('/api/get/professors/' + p.uid);
    const newData = await response.json();
    sets1(!s1);
    sets2data(newData.data);
    sets2(!s2);
  };

  const fetchScores = async (pid) => {
    const response = await fetch('api/get/scores/' + pid);
    const newData = await response.json();
    setc1(newData.data.rmp);
    setc2(newData.data.rnn);
    setc3(newData.data.vader);
    setc3(newData.data.bert);

    console.log("score is :"+newData.data.vader)
    const data = [
      {id: 2, score: newData.data.rmp},
      {id: 3, score: newData.data.rnn},
      {id: 4, score: newData.data.vader},
      {id: 5, score: newData.data.bert}
    ]
    setchart(data)
  };

  const fetchComments = async (pid) => {
    const response = await fetch('/api/get/comments/' + pid);
    const newData = await response.json();
    sets2(!s2);
    sets4(!s4);
    sets3data(newData.data);
    sets3(!s3);
  };

  useEffect(() => {
    const fetchData = async (pid) => {
      const response = await fetch('/api/get/universities/all');
      const newData = await response.json();
      sets1data(newData.data);
    };

    fetchData();
  }, []);

  const hideComponent = (name, item) => {
    console.log("Getting professor from uni: "+item)
    switch (name) {
      case "s1":
        setinp1(item);
        fetchProfessors(item);
        break;
      case "s2":        
        fetchScores(item.pid);
        fetchComments(item.pid);
        break;
      default:
        break;
    };
  };

    return (
      <div className="App">
        <header className="App-header">
        
        <div className="main-area">
          <Suspense fallback={<Loading />}>
            <div className={s1 ? "component-area" : "component-area"}>
              {s1 && <div>
              <h1>Search a University</h1>
              <AutoCompleteUniversity suggestion={s1data} onClicked={(name, item) => hideComponent(name, item)}/>
              </div>}
              
              {/* {s2&& <div className="left">
                <h2>{inp1.title}</h2>
                <ChartUniversity data={
                      {a: 4.5}
                    } />
             </div>} */}

              {s2&& <div>
                <h1>Search a Professor</h1>
                <AutoCompleteProfessor suggestion={s2data} onClicked={(name, item) => hideComponent(name, item)} />
              </div>}
                    
            </div>
          </Suspense>
          
          {s3&& 
          <div className="a-area">

              <div className="comments-area">
                <h4>Top Comments</h4>
                <ul>{s3data.length > 0 && s3data.map(item => {
                    return (
                <li key = {getRandomInt(9999999)}> {item} </li>
                  )
                })}
                </ul>
              </div>

             <div className="chart-area">
              {s4&& s3data.length > 0 &&
                  <div className=".svg-area">
                    <Chart data={
                      chart
                    } />
                  </div>}
              </div> 
        
          </div>}

        </div>
  
        </header>  

      </div>
    );
  
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}