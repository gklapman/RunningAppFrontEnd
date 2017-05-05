////THIS CONTAINS BOTH REDUCER AND STORE

////IMPORTS FOR STORE
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger' ////from example

////IMPORTS FOR DISPATCHERS
import axios from 'axios';


/////CONSTANTS
const SET_RUNNER_COORDS = 'SET_ALL_COORDS'
const SET_ROUTES_DATA = 'SET_ROUTES_DATA'

////ACTION CREATORS
export const setRunnerCoords = function(newCoords){
  return {
    type: SET_RUNNER_COORDS,
    newCoords: newCoords
  }
}

export const setRoutesData = function(routesData){
  return {
    type: SET_ROUTES_DATA,
    routesData: routesData
  }
}


////DISPATCHERS
export const fetchRunnerCoords = (newCoords) => {
  console.log("in dispatch in store, runner coords are:", newCoords)
  return dispatch => {
    console.log("here")
    return dispatch(setRunnerCoords(newCoords))
  }
}

///////////////////!!!! still need to add thunk creator for setRoutesData,
/////////////////////   and add it to the reducer & store!


/////////////////////////REDUCER
const initialState = {
  runnerCoords: [],
}



function reducer(state = initialState, action){
  console.log("In reducer", action)
  const nextState = Object.assign({}, state);

  switch(action.type){
    case SET_RUNNER_COORDS:
    console.log("IN SWITCH")

      nextState.runnerCoords = [...state.runnerCoords, action.newCoords];
      break;
    default:
      return state;
  }
  console.log("NEXT STATE IS", nextState)
  return nextState;
}




export default createStore(reducer, applyMiddleware(thunkMiddleware, logger));
