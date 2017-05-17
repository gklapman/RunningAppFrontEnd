

import {StackNavigator} from 'react-navigation';

//navigator geolocation promisified so we can .then off it and not have to write all those nasty nested functions
export function promisifiedGetCurrPos() {
  //reminder for how to do promisify async stuff in general:
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
    // console.log(' test runner elapsed time is ', this.elapsedTime)
    if(this.elapsedTime > this.timesArr[this.timesArr.length-1]+1000) clearInterval(this.intervalID)
  },100)
}

TestRunner.prototype.moveOrNot= function (){
  //this will cause the testrunner to advance to the next location (via incrementing this.coordsPointer)
  //AND move the timesArrPointer up by 1, but only IF timer matches the time that this.timesArrPointer is pointing to.

  let origCoordsPointer=this.coordsPointer;

  while (this.elapsedTime >= this.timesArr[this.timesArrPointer]){
    this.coordsPointer+=1
    this.timesArrPointer+=1
  }
  // console.log('testrunenr elapsedtime ', this.elapsedTime)
  // console.log(origCoordsPointer, this.coordsPointer, this.timesArrPointer)

  return origCoordsPointer!==this.coordsPointer ? true : false
}

TestRunner.prototype.getPosition= function (){
  // console.log('testrunner coordinates ', this.convCoords[this.coordsPointer])
  return {coords: this.convCoords[this.coordsPointer]}
}

TestRunner.prototype.moveAndGetPos= function (){
  this.moveOrNot()
  // return Promise.resolve(this.getPosition())
  return this.getPosition()
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

let testRoute3Coords=[
           [
              "41.8091q0",
              "-87.596837"
            ],
            [
              "41.80959",
              "-87.596837"
            ],
            [
              "41.809686",
              "-87.592427"
            ],
            [
              "41.808071",
              "-87.590689"
            ],
            [
              "41.805676",
              "-87.589218"
            ],
            [
              "41.802476",
              "-87.587889"
            ],
            [
              "41.801058",
              "-87.587528"
            ],
            [
              "41.801058",
              "-87.5874"
            ],
            [
              "41.801058",
              "-87.5873"
            ],
            [
              "41.801058",
              "-87.5872"
            ],
            [
              "41.801058",
              "-87.5871"
            ],
            [
              "41.801058",
              "-87.587"
            ],
            [
              "41.801058",
              "-87.5869"
            ],
            [
              "41.801058",
              "-87.5868"
            ],
            [
              "41.801058",
              "-87.5867"
            ],
            [
              "41.801058",
              "-87.5866"
            ],
            [
              "41.801058",
              "-87.5865"
            ],
            [
              "41.801058",
              "-87.5864"
            ],
            [
              "41.801058",
              "-87.5863"
            ],
            [
              "41.801058",
              "-87.5862"
            ],
            [
              "41.801058",
              "-87.5861"
            ],
            [
              "41.801058",
              "-87.5855"
            ]
          ]
let testRoute3ConvCoords=testRoute3Coords.map(coordpair=>{return {latitude: coordpair[0], longitude: coordpair[1]} })

export const testRoute3=
{convCoords: testRoute3ConvCoords,
// timesArr:[0,11000,23000,35000,45000,61000]
timesArr:[0,2000,6150,7000,7200,13000,20000,20000,24000,24500,26000,28000,32000,33000,34000,36000,38000,40000,42000,44000,44100,44200] //faster
}


export const numToRGBConverter = (num=0, range, minRGB = 0, maxRGB = 255, convToHex = false) => {
  var diffRGB = maxRGB - minRGB
  var r = 0;
  var g = 0;
  var b = 0;
  var convRange = range/2;
  var convNum = num - range/2;
  if (convNum >= 0){
    if (convNum > convRange/2){
      r = maxRGB
      g = diffRGB * ((convRange - convNum)/ convRange) + minRGB
    } else {
      r = diffRGB * (convNum / convRange) + minRGB
      g = maxRGB
    }
  } else {
    var nRange = (0 - convRange) / 2
    var posNum = 0 - convNum
    if (convNum < nRange){
      b = maxRGB
      g = diffRGB * ((convRange - posNum) /convRange) + minRGB
    } else {
      b = diffRGB * (posNum / convRange) + minRGB
      g = maxRGB
    }
  }
  var output = ''
  if (convToHex){
    output = [r, g, b].map(val => {
      var hexVals = {
        11: 'A',
        12: 'B',
        13: 'C',
        14: 'D',
        15: 'F',
      }
      if (val > 9){
        return hexVals[val]
      } else {
        return Math.floor(val).toString()
      }
    })
    return '#'+output.join('')
    } else {
    output = [r,g,b].map(val => {
      return Math.floor(val)
    })
    // console.log("NUM & OUTPUT", num, output)

    return 'rgb(' + output.join(",") + ')'
  }
}

export const flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}


function generateNorthLat(lat, lat2, lng){
  let finalArr = []
  for (let i = lat; i< lat2; i+=0.0005){
    console.log(i)
   let nextVal = i.toFixed(6)
    finalArr.push({latitude: +nextVal, longitude: lng})
  }
  return finalArr
}

function generateSouthLat(lat, lat2, lng){
  let finalArr = []
  for (let i = lat; i> lat2; i-=0.0005){
    console.log(i)
   let nextVal = i.toFixed(6)
    finalArr.push({latitude: +nextVal, longitude: lng})
  }
  return finalArr
}


function generateWestLng(lat, lng, lng2){
  let finalArr = []
  for (let i = lng; i> lng2; i-=0.0005){
   console.log(i)
   let nextVal = i.toFixed(6)
    finalArr.push({latitude: lat, longitude: +nextVal})
  }
  return finalArr
}

function generateEastLng(lat, lng, lng2){
  let finalArr = []
  for (let i = lng; i< lng2; i+=0.0005){
    console.log(i)
   let nextVal = i.toFixed(6)
    finalArr.push({latitude: lat, longitude: +nextVal})
  }
  return finalArr
}

