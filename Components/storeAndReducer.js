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




////DISPATCHERS

export const fetchUser = (email, password) => {
  return dispatch => {
    return axios.get('/api/USERSorSomething', { params: { email: email, password: password}})
    .then(res => res.data)
    .then(foundUser => {
      dispatch(setUser(foundUser))
    })
    .catch(console.log)
  }
}

export const fetchUserLocation = location => {
  return dispatch => {
    return dispatch(setUserLocation(location))
  }
}

export const fetchNearbyRoutes = () => {
  return dispatch => {
    axios.get('http://localhost:3000/api/runroutes')
    .then(res => res.data)
    .then(routesData => {
      let formattedRouteData = routesData.map(routeWCoords => {
        let formattedCoordsPerRoute = routeWCoords.coords.map(coordPair => {
          return coordPair.map(coord => {
            return +coord
          })
        })
        return { id: routeWCoords.id, coords: formattedCoordsPerRoute}
      })
      return dispatch(setNearbyRoutes(formattedRouteData))
    })
    .catch(console.log)
  }
}



export const fetchSelectedRoute = selectedRouteId => {
  return dispatch => {
    axios.get(`http://localhost:3000/api/runroutes/${selectedRouteId}`)
    .then(res => res.data)
    .then(routeData => {
      console.log(routeData)
      return dispatch(setSelectedRoute(routeData))
    })
    .catch(console.log)
  }
}

//////////GABI WILL HAVE RE-WRITTEN THIS
// export const createNewRoute = (newRouteCoords, newRouteTimes) => {
//   return dispatch => {
//     axios.post('/api/ROUTESorSomething', routeCoords)
//     .then(res => res.data)
//     .then(newRoute => {
//       return newRoute
//     })
//     .then(newRouteCoords => {
//       axios.post('/api/ROUTESTIMESorSomething', (newRouteTimes, newRoute.id))
//       .then(res => res.data)
//       .then(newRouteTimes => newRouteTimes)
//     })
//     .then(newRouteCoords => {
//       return dispatch(setSelectedRouteCoords(newRoute))
//     })
//     .catch(console.log)
//   }
// }



/////////////////////////REDUCER
const initialState = {
  user: {},
  userLocation: {},
  nearbyRoutes: [],
  selectedRoute: {},
}



function reducer(state = initialState, action){
  console.log("In reducer", action)
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
    default:
      return state;
  }
  return nextState;
}




export default createStore(reducer, applyMiddleware(thunkMiddleware, logger));
