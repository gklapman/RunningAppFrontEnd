////THIS CONTAINS BOTH REDUCER AND STORE

////IMPORTS FOR STORE
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger' ////from example

////IMPORTS FOR DISPATCHERS
import axios from 'axios';


/////CONSTANTS
const SET_USER = 'SET_USER'
const SET_USER_LOCATION = 'SET_USER_LOCATION'
const SET_NEARBY_ROUTES = 'SET_NEARBY_ROUTES'
const SET_SELECTED_ROUTE = 'SET_SELECTED_ROUTE'
const SET_SELECTED_RACER = 'SET_SELECTED_RACER'

// const SET_RUNNER_COORDS = 'SET_ALL_COORDS'

////ACTION CREATORS

export const setUser = function(user){
  return {
    type: SET_USER,
    user: user
  }
}

export const setUserLocation = function(location){

  return {
    type: SET_USER_LOCATION,
    userLocation: location
  }
}

export const setNearbyRoutes = function(routesData){
  return {
    type: SET_NEARBY_ROUTES,
    nearbyRoutes: routesData
  }
}

export const setSelectedRoute = function(routeData){
  return {
    type: SET_SELECTED_ROUTE,
    selectedRoute: routeData,
  }
}

export const setSelectedRacer = function(racerData){
  return {
    type: SET_SELECTED_RACER,
    selectedRacer: racerData,
  }
}



////DISPATCHERS

export const fetchUser = ({email, password}) => {
  return dispatch => {
    return axios.post('http://localhost:3000/api/users/login', { email, password} )
    .then(res => res.data)
    .then(foundUser => {
      if(foundUser) dispatch(setUser(foundUser))
      return 'userSetAllGravy';//this is so I can .then off the thunk in the login component
    })
    .catch(console.log)
  }
}


export const fetchUserLocation = location => {
  return dispatch => {
    return dispatch(setUserLocation(location))
  }
}


export const addNewRoute = (convCoords, userId, timesArr, startTime, endTime, routeId) => {

  return dispatch => {
    return axios.post('http://localhost:3000/api/runroutes', {convCoords, userId, timesArr, startTime, endTime, routeId})
    .then(response => {
          console.log('this is the response', response.data)
          //INVOKE THUNK TO RELOAD ALL ROUTES
    })

  }
}

export const fetchSelectedRoute = selectedRouteId => {
  return dispatch => {
    return axios.get(`http://localhost:3000/api/runroutes/${selectedRouteId}`)
    .then(res => res.data)
    .then(eagerLoadedRoute => {
        eagerLoadedRoute.convCoords=eagerLoadedRoute.coords.map(coordPair=>{
          return {latitude:+coordPair[0], longitude:+coordPair[1]};
        })
        return dispatch(setSelectedRoute(eagerLoadedRoute))
      })
    .catch(console.log)
  }
}

export const fetchNearbyRoutes = (region) => {
// http://localhost:3000/api/runroutes/?latitude=35&longitude=-119&latitudeDelta=3&longitudeDelta=1000 //this is an example of a runroute query
  return dispatch => {
    let query=`?latitude=${region.latitude}&longitude=${region.longitude}&latitudeDelta=${region.latitudeDelta}&longitudeDelta=${region.longitudeDelta}`;
    axios.get('http://localhost:3000/api/runroutes/'+query)
    .then(res => res.data)
    .then(routes => {
      let formattedRoutes = routes.map(routeWCoords => {
        let formattedCoordsPerRoute = routeWCoords.coords.map(coordPair => {
          return {latitude:+coordPair[0], longitude:+coordPair[1]}
        })
        return { id: routeWCoords.id, convCoords: formattedCoordsPerRoute}
      })
      return dispatch(setNearbyRoutes(formattedRoutes))
    })
    .catch(console.log)
  }
}


export const sendSelectedRacer = (racerData) => {
  return dispatch => {
    return dispatch(setSelectedRacer(racerData))
  }
}


/////////////////////////REDUCER
const initialState = {
  user: {},
  userLocation: {},
  nearbyRoutes: [],
  selectedRoute: {},
  selectedRacer: {},
}

function reducer(state = initialState, action){

  const nextState = Object.assign({}, state);

  switch(action.type){

    case SET_USER:
      nextState.user = action.user
      break;
    case SET_USER_LOCATION:
      nextState.userLocation = action.userLocation
      break;
    case SET_NEARBY_ROUTES:
      nextState.nearbyRoutes = action.nearbyRoutes;
      break;
    case SET_SELECTED_ROUTE:
      nextState.selectedRoute = action.selectedRoute
      break;
    case SET_SELECTED_RACER:
      nextState.selectedRacer = action.selectedRacer
      break;
    default:
      return state;
  }
  return nextState;
}

export default createStore(reducer, applyMiddleware(thunkMiddleware, logger));
