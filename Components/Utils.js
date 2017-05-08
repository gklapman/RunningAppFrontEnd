

import {StackNavigator} from 'react-navigation';

//example of a promisified async function
export function promisifiedGetCurrPos() {
    // 1 - Create a new Promise
    return new Promise(function (resolve, reject) {
        // 2 - Copy-paste your async code inside this function
        navigator.geolocation.getCurrentPosition(position=>{
            // 3 - in your async function's callback
            // reject for the errors and resolve for the results
            return resolve(position)
        },
        (msg)=>reject('Please enable your GPS position future.'),
        {enableHighAccuracy: true}
        )
    })
}

export function TestRunner(convCoords, timesArr){
  this.elapsedTime=0;
  this.start=0;
  this.timesArrPointer=1
  this.coordsPointer=0
  this.convCoords=convCoords
  this.timesArr=timesArr
  this.intervalID=0
}

TestRunner.prototype.startTimer= function(){
  this.start=Date.now()
  this.intervalID=setInterval(() => {
    this.elapsedTime=Date.now()-this.start
    // console.log('testrunner timer ', Date.now(), ' elapsed time is ', this.elapsedTime)
    if(this.elapsedTime > this.timesArr[this.timesArr.length-1]+1000) clearInterval(this.intervalID)
  },100)
}

TestRunner.prototype.moveOrNot= function (){
  //this will cause the testrunner to advance to the next location (via incrementing this.coordsPointer)
  //AND move the timesArrPointer up by 1, but only IF timer matches the time that this.timesArrPointer is pointing to.
  if(this.elapsedTime>this.timesArr[this.timesArrPointer]-200 && this.elapsedTime>this.timesArr[this.timesArrPointer]+200){
    //we're not getting to this point for some reason!!
    this.coordsPointer+=1
    this.timesArrPointer+=1
    return true
  }
  return false
}

TestRunner.prototype.getPosition= function (){
  return {coords: this.convCoords[this.coordsPointer]}
}

TestRunner.prototype.moveAndGetPos= function (){
  this.moveOrNot()
  return Promise.resolve(this.getPosition())
}

export const testRoute1=
{convCoords:[{latitude: 41.797,longitude: -87.580},{latitude: 41.798,longitude: -87.582},{latitude: 41.799,longitude: -87.581},{latitude: 41.800368, longitude: -87.581021},{latitude: 41.802024, longitude: -87.580957},{latitude: 41.804015, longitude: -87.581611},{latitude: 41.805902, longitude: -87.583853},{latitude: 41.807989, longitude: -87.586192}],
// timesArr:[0,11000,23000,35000,45000,61000]
timesArr:[0,1000,2000,5500,7000,8500,9000,12000]//faster
}

export const testRoute2=
{convCoords:[{latitude: 41.808, longitude: -87.596837} , {latitude: 41.8087, longitude: -87.596837},{latitude: 41.809590, longitude: -87.596837},{latitude: 41.809686, longitude: -87.592427},{latitude: 41.808071, longitude: -87.590689},{latitude: 41.805676, longitude: -87.589218},{latitude: 41.802476, longitude: -87.587889},{latitude: 41.801058, longitude: -87.587528}],
// timesArr:[0,11000,23000,35000,45000,61000]
timesArr:[0,1000,2000,5500,7000,8500,9000,12000]//faster
}
