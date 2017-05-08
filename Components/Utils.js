

import {StackNavigator} from 'react-navigation';

export function promisifiedGetCurrPos() {
    // 1 - Create a new Promise
    return new Promise(function (resolve, reject) {
        // 2 - Copy-paste your async code inside this function
        navigator.geolocation.getCurrentPosition(position=>{
            // 3 - in your async function's callback
            // reject for the errors and resolve for the results
            return resolve(position);
        },
        (msg)=>reject('Please enable your GPS position future.'),
        {enableHighAccuracy: true}
        );
    });
}

export function testRunnerGetCurrPos(convCoords, timesArr){

}
