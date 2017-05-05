////THIS CONTAINS BOTH REDUCER AND STORE

////IMPORTS FOR STORE
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger' ////from example

////IMPORTS FOR DISPATCHERS
import axios from 'axios';


/////CONSTANTS
const SET_RUNNER_COORDS= 'SET_ALL_COORDS'

////ACTION CREATORS
const setRunnerCoords = function(newCoords){
  return {
    type: SET_RUNNER_COORDS,
    newCoords: newCoords
  }
}


////DISPATCHERS
export const fetchRunnerCoords = (newCoords) => {
  console.log("in dispatch in store, runner coords are:", newCoords)
  return dispatch => {
    return dispatch(setRunnerCoords(newCoords))
  }
}



/////////////////////////REDUCER
const initialState = {
  runnerCoords: [],
  test: {x: 1, y: 2}
}



function reducer(state = initialState, action){

  const nextState = Object.assign({}, state);

  switch(action.type){
    case SET_RUNNER_COORDS:
      nextState.runnerCoords = [...state.runnerCoords, action.newCoords];
      break;
    default:
      return state;
  }
  return nextState;
}




export default createStore(reducer, applyMiddleware(thunkMiddleware, logger));
