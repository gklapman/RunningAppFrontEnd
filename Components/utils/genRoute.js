import axios from 'axios'
import {herokuUrl, localHost} from '../../config.js'
import { flatten } from '../Utils.js'

const localHostorHeroku=''
localHostorHeroku= localHost
// localHostorHeroku= herokuUrl

export function IntersectADJLIST(region){
  this.region= region
  this.adjList= {}//remember, this property will NOT get populated until intersect queries have been done... in other words, you can only access this property in this instance in promises
  this.streetLookup= {}
}

IntersectADJLIST.prototype.intersectQuery= function (coord){//for getting a single intersection near a coordinate
  //this is so stupid...  stupid react native wont let me make http requests so i have to make a request to the server and then have SERVER
  //make http request to the geonames.org site... a;sdfkj;aoifj
  return axios.get(`${localHostorHeroku}/api/geonames/?latitude=${coord.latitude}&longitude=${coord.longitude}&username=CharlesinCharge43&max=8`)
    .then(res=>{
      // console.log('intersection ',res.data)
      res.data.latitude=+res.data.lat
      res.data.longitude=+res.data.lng
      let intersection = res.data
      return intersection})
    .catch(err=>err)
}

IntersectADJLIST.prototype.intersectQueryBulk= function (centercoord){//for getting multiple intersections near a coordinate (you can set maxrows if you need.. see the api route for geonames)

  console.log('centerCoord is ', centercoord)
  return axios.get(`${localHostorHeroku}/api/geonames/bulk/?latitude=${centercoord.latitude}&longitude=${centercoord.longitude}&username=CharlesinCharge43&max=8`)
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
  let latDelt=this.region.latitudeDelta//the actual delta from manually zooming seems way too large?
  let lngDelt=this.region.longitudeDelta//the actual delta from manually zooming seems way too large?

  let latDeltMax= .012
  let lngDeltMax= .016

  if(latDelt>latDeltMax || lngDelt>lngDeltMax){
    latDelt=latDeltMax
    lngDelt=lngDeltMax
  }
// {console.log('region too large... need to zoom in more ');return Promise.resolve('error');}

  let rightEdge=lng+lngDelt
  let topEdge=lat+latDelt
  let leftEdge=lng-lngDelt
  let botEdge=lat-latDelt
  let querycoord={latitude: botEdge, longitude: leftEdge} //start at the bottom left corner

  let querycoords=[]
  let queryPromiseArr=[]
  while(querycoord.latitude<topEdge){
    querycoord.longitude= leftEdge
    while(querycoord.longitude<rightEdge){
      querycoords.push(Object.assign({},querycoord))//Remember you don't want to push the original object.. otherwise you'll just end up with multiple references to the same object
      queryPromiseArr.push(this.intersectQueryBulk(querycoord))
      querycoord.longitude=querycoord.longitude+.003
    }
    querycoord.latitude=querycoord.latitude+.0025
  }

  return Promise.all(queryPromiseArr)
    .then(arrIntArr=>{
      let arrInt=flatten(arrIntArr)
      this.makeAdjList(arrInt)
      return {intersections: arrInt, querycoords}
    })
    .catch(err=>err)
}

IntersectADJLIST.prototype.makeAdjList= function (arrInt){
  for(let intersection of arrInt){
    //must check if exist or not, because geonames does sometimes respond with an intersection more than once
    //especially when an intersection has more than 2 streets associated with it ( i know it's weird.. see this query:
    //http://api.geonames.org/findNearestIntersectionJSON?lat=41.954153&lng=-87.678783&username=CharlesinCharge43&maxRows=2 for a good example)
    // console.log(intersection.lat+','+intersection.lng)
    if(!this.adjList[intersection.lat+','+intersection.lng]){//if doesn't exist... make a new intersection node
      let intersectNodeInstance= new IntersectNode(intersection)

      //modify adjacency list
      this.adjList[intersection.lat+','+intersection.lng]=intersectNodeInstance
      // console.log('street 1, ',intersection.street1, 'street 2 ', intersection.street2)
      intersectNodeInstance.streets.push(intersection.street1)
      intersectNodeInstance.streets.push(intersection.street2)
      // console.log('intersectNodeInstance.streets should have 2', intersectNodeInstance.streets)
      //modify street lookup
      if(!this.streetLookup[intersection.street1]) this.streetLookup[intersection.street1]=[intersectNodeInstance]
      else this.streetLookup[intersection.street1].push(intersectNodeInstance)
      if(!this.streetLookup[intersection.street2]) this.streetLookup[intersection.street2]=[intersectNodeInstance]
      else this.streetLookup[intersection.street2].push(intersectNodeInstance)

    }
    else {//if it does exist, modify an existing intersection node
      let intersectNodeInstance= this.adjList[intersection.lat+','+intersection.lng]
      if(intersectNodeInstance.streets.indexOf(intersection.street1)===-1) {
        intersectNodeInstance.streets.push(intersection.street1)
        if(!this.streetLookup[intersection.street1]) this.streetLookup[intersection.street1]=[intersectNodeInstance]
        else this.streetLookup[intersection.street1].push(intersectNodeInstance)
      }
      if(intersectNodeInstance.streets.indexOf(intersection.street2)===-1) {
        intersectNodeInstance.streets.push(intersection.street2)
        if(!this.streetLookup[intersection.street2]) this.streetLookup[intersection.street2]=[intersectNodeInstance]
        else this.streetLookup[intersection.street2].push(intersectNodeInstance)
      }
    }
  }
}

IntersectADJLIST.prototype.sortStreetLookup= function(){
  for(let streetKey in this.streetLookup){
    let streetVal= this.streetLookup[streetKey]
    this.sortStreet(streetVal)
  }
}

IntersectADJLIST.prototype.sortStreet= function(streetVal){
  //this will sort intersections on a streetVal (value of street key value pair in this.streetLookup) from either west to east or south to north (depending on what property changes the most -lat or long-
  //from intersection to intersection)
  if(streetVal.length===1) return
  else {
    if(Math.abs(streetVal[1].latitude-streetVal[0].latitude) > Math.abs(streetVal[1].longitude-streetVal[0].longitude)){
      streetVal.sort(function(a,b){return a.latitude-b.latitude})
    }
    else streetVal.sort(function(a,b){return a.longitude-b.longitude})
  }
}

IntersectADJLIST.prototype.connectIntersectNodes= function(){
  //remember you MUST first run the sortStreetLookup prototype method BEFORE invoking this one!!
  for(let streetKey in this.streetLookup){
    let streetVal= this.streetLookup[streetKey]
    for(let i=0;i<streetVal.length-1;i++){//length - 2 because you cant have a leaf node (in a street, i.e., i of length-1) connect to a nonexisted node of higher i
      let firstNode=streetVal[i]
      let secondNode=streetVal[i+1]
      firstNode.connections.push(secondNode)
      secondNode.connections.push(firstNode)
    }
    // for(let i=0;i<streetVal.length-1;i++){
    //   let intersectNode=streetVal[i]
    //   let neighborsToConnect=streetVal.slice(i+1,streetVal.length)
    //   intersectNode.connections= intersectNode.connections.concat(neighborsToConnect)
    //   for(let neighboringNode of neighborsToConnect){
    //   }
    // }
  }
}

//I wonder... should I also make a street object?  the street object can have street properties with array of associated intersect Nodes
export function IntersectNode(intersection){//takes in intersection object (returned by geonames.org)
  this.latitude=intersection.latitude
  this.longitude=intersection.longitude
  this.streets=[]
  this.connections=[]
}
