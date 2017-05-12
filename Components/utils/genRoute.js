import axios from 'axios'
import {herokuUrl, localHost} from '../../config.js'
import { flatten } from '../Utils.js'

const localHostorHeroku=''
// localHostorHeroku= localHost
localHostorHeroku= herokuUrl

export function IntersectADJLIST(region){
  this.region= region
}

IntersectADJLIST.prototype.intersectQuery= function (coord){//for getting a single intersection near a coordinate
  //this is so stupid...  stupid react native wont let me make http requests so i have to make a request to the server and then have SERVER
  //make http request to the geonames.org site... a;sdfkj;aoifj
  return axios.get(`${localHostorHeroku}/api/geonames/?latitude=${coord.latitude}&longitude=${coord.longitude}&username=CharlesinCharge43`)
    .then(res=>{
      // console.log('intersection ',res.data)
      res.data.latitude=+res.data.lat
      res.data.longitude=+res.data.lng
      let intersection = res.data
      return intersection})
    .catch(err=>err)
}

IntersectADJLIST.prototype.intersectQueryBulk= function (centercoord){//for getting multiple intersections near a coordinate (you can set maxrows if you need.. see the api route for geonames)
  //this is so stupid...  stupid react native wont let me make http requests so i have to make a request to the server and then have SERVER
  //make http request to the geonames.org site... a;sdfkj;aoifj

  console.log('centerCoord is ', centercoord)
  return axios.get(`${localHostorHeroku}/api/geonames/bulk/?latitude=${centercoord.latitude}&longitude=${centercoord.longitude}&username=CharlesinCharge43`)
    .then(res=>{
      let intersectionsArr= res.data
      return intersectionsArr.map(intersection=>{
        intersection.latitude= +intersection.lat
        intersection.longitude= +intersection.lng
        return intersection
      })
    })
    .catch(err=>err)
}

IntersectADJLIST.prototype.intersectsPerRegion= function(){
  let lat=this.region.latitude
  let lng=this.region.longitude
  // let latDelt=this.region.latitudeDelta//the actualy delta from manually zooming seems way too large?
  // let lngDelt=this.region.longitudeDelta//the actualy delta from manually zooming seems way too large?

  let latDelt= .0016
  let lngDelt= .0016

  if(latDelt>.05 || lngDelt>.05) {console.log('region too large... need to zoom in more ');return Promise.resolve('error');}



  let rightEdge=lng+lngDelt
  let topEdge=lat+latDelt
  let leftEdge=lng-lngDelt
  let botEdge=lat-latDelt
  let querycoord={latitude: botEdge, longitude: leftEdge} //start at the bottom left corner

  // console.log('querycoord latitude ',querycoord.latitude)
  // console.log('top edge ', topEdge)
  // console.log('right edge ', rightEdge)
  let querycoords=[]
  let queryPromiseArr=[]
  while(querycoord.latitude<topEdge){
    querycoord.longitude= leftEdge
    while(querycoord.longitude<rightEdge){
      console.log('longitude looping ')
      querycoords.push(querycoord)
      queryPromiseArr.push(this.intersectQueryBulk(querycoord))
      querycoord.longitude=querycoord.longitude+.0005
    }
    console.log('latitude looping ')
    querycoord.latitude=querycoord.latitude+.0005
  }
  console.log('querycoords ',querycoords)

  return Promise.all(queryPromiseArr)
    .then(arrIntArr=>{
      console.log('arrIntArr', arrIntArr)
      return {intersections: flatten(arrIntArr), querycoords}
    })
    .catch(err=>err)
}

function IntersectNode(coord){
  this.coord=coord,
  this.connections=[]
}
