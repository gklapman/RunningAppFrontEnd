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
const SET_SELECTED_ROUTE_COORDS = 'SET_SELECTED_ROUTE_COORDS'
const SET_SELECTED_ROUTE_TIMES = 'SET_SELECTED_ROUTE_TIMES'
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

export const setSelectedRouteCoords = function(routeCoords){
  return {
    type: SET_SELECTED_ROUTE_COORDS,
    selectedRouteCoords: routeCoords,
  }
}

export const setSelectedRouteTimes = function(routeTimes){
  return {
    type: SET_SELECTED_ROUTE_TIMES,
    selectedRouteTimes: routeTimes ////should the associated users be eager loaded here?
  }
}

// export const setRunnerCoords = function(newCoords){
//   return {
//     type: SET_RUNNER_COORDS,
//     newCoords: newCoords
//   }
// }

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
  console.log("or this?!")

  return dispatch => {
    console.log("it worked!")
    axios.get('http://localhost:3000/api/runroutes')
    .then(res => res.data)
    .then(routesData => {
      console.log("ROUTE DATA!", routesData)

      let formattedRouteData = routesData.map(routeWCoords => {
        // console.log("ROUTEWCOORDS is", Array.isArray(routeWCoords.coords))
        let formattedCoordsPerRoute = routeWCoords.coords.map(coordPair => {
          // console.log("COORD PAIR",coordPair)
          return coordPair.map(coord => {
            // console.log("COORD", +coord)
            return +coord
          })
        })
        return { id: routeWCoords.id, coords: formattedCoordsPerRoute}
      })

      console.log("FORMATTED COORDS!",formattedRouteData)



      return dispatch(setNearbyRoutes(formattedRouteData))
    })
    .catch(console.log)
  }
}

export const fetchSelectedRouteCoords = selectedRoute => {
  return dispatch => {
    axios.get('/api/ROUTES/IDorSOMETHING')
    .then(res => res.data)
    .then(routeCoords => {
      return dispatch(setSelectedRouteCoords(routeCoords))
    })
    .catch(console.log)
  }
}

export const fetchSelectedRouteTimes = selectedRoute => {
  return dispatch => {
    axios.get('/api/ROUTESTIMES/IDorSOMETHING')
    .then(res => res.data)
    .then(routeTimes => {
      return dispatch(setSelectedRouteTimes(routeTimes))
    })
    .catch(console.log)
  }
}

export const createNewRoute = (newRouteCoords, newRouteTimes) => {
  return dispatch => {
    axios.post('/api/ROUTESorSomething', routeCoords)
    .then(res => res.data)
    .then(newRoute => {
      return newRoute
    })
    .then(newRouteCoords => {
      axios.post('/api/ROUTESTIMESorSomething', (newRouteTimes, newRoute.id))
      .then(res => res.data)
      .then(newRouteTimes => newRouteTimes)
    })
    .then(newRouteCoords => {
      return dispatch(setSelectedRouteCoords(newRoute))
    })
    .catch(console.log)
  }
}




////~~~~~I think we said that this would be on local state
// export const fetchRunnerCoords = (newCoords) => {
//   return dispatch => {
//     return dispatch(setRunnerCoords(newCoords))
//   }
// }


/////////////////////////REDUCER
const initialState = {
  user: {},
  userLocation: {},
  nearbyRoutes: [],
  selectedRouteCoords: [],
  selectedRouteTimes: [],
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
      console.log("in store NB routes")
      nextState.nearbyRoutes = action.nearbyRoutes;
      break;
    case SET_SELECTED_ROUTE_COORDS:
      nextState.selectedRouteCoords = action.selectedRouteCoords
      break;
    case SET_SELECTED_ROUTE_TIMES:
      nextState.selectedRouteTimes = action.selectedRouteTimes
      break;
    default:
      return state;
  }
  console.log("NEXT STATE IS", nextState)
  return nextState;
}




export default createStore(reducer, applyMiddleware(thunkMiddleware, logger));
