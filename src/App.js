import React, { useState,useEffect } from 'react';
import './App.css';
import Die from './component/Die';
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'
function App() {

  const allNewDice =()=>{
    const newDice = []

    for(let i =0 ; i<10 ; i++){
      newDice.push({
        id:nanoid(),
        value:Math.ceil(Math.random() * 6)
        ,isHeld:false
      })
    }
    return newDice;
  }

  const [dice , setDice] = useState(allNewDice())

  const [tenzies , setTenzies] = useState(false);

  const [roll ,setRoll] = useState(0);


  

  useEffect(()=>{
  const allHeld =  dice.every(die => die.isHeld);
  const firstValue = dice[0].value;
  const allSameValue = dice.every(die => die.value === firstValue)
  if(allHeld && allSameValue)
  {
    setTenzies(true)
    console.log("You Won")
  }
  if(roll ===20){
    setTenzies(true);

  }
  },[dice])



  const generateNewDie =()=>{
    return{
      id:nanoid(),
      value:Math.ceil(Math.random() * 6)
      ,isHeld:false
    }
  }
  

  const rollDice = ()=>{
    if(!tenzies)
    {
      setDice(oldDice => oldDice.map(die=>{
        return die.isHeld ?
        die:
        generateNewDie()
      }))      
      setRoll(prevRoll => prevRoll + 1)
    }else{
      setTenzies(false);
      setDice(allNewDice());
      setRoll(0);
    }
  }



  const holdDice =(diceId)=>{
    setDice(oldDice => oldDice.map(die=>{
      return die.id === diceId?
      {...die , isHeld:!die.isHeld}:
      die
    }))
  }

  const dieComponent = dice.map((el)=>{
    return(
      <Die 
      key={el.id}
      value={el.value}
      isHeld={el.isHeld}
      holdDice={()=>holdDice(el.id)}/>
    )
  })

  const [time , setTime] = useState(0);

  useEffect(()=>{
    const timer = setInterval(()=>{
      if(tenzies ===false){
        setTime(prevTime => prevTime+1)
        localStorage.setItem('bestTime',time);
      }else{
        setTime(0);
      }

    },1000)
    return ()=>clearInterval(timer)
  },[time])


  const bestTime = localStorage.getItem('bestTime');

  return (
    <div className="App">
      <div className='main'>
        {tenzies&&<Confetti width={400} height={400}/>}
        <div className='mainText'>
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </div>

        <div className='Rolls'>
            <h3>Rolls:</h3>
            <h3>{roll}</h3>
            <h4>Time: {time} s</h4>
        </div>

        <div className='content'>
        <p>{roll ===20?"You Lose":""}</p>
        <p>Best Time: {bestTime} s</p>

        <div className='dieContainer'>
          {dieComponent}            
        </div>
        <button className='btnRoll' onClick={rollDice}>{tenzies?"New Game":"Roll"}</button>
        </div>

      </div>
    </div>
  );
}

export default App;
