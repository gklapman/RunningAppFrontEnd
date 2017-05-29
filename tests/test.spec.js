import React from 'react'

import chai, {expect} from 'chai'

import { IntersectADJLIST } from '../Components/utils/genRoute'

describe('RunningAppFrontEnd Test Specs', function (){
  this.timeout(10000)//because some of these axios calls to geonames are notoriously long

  describe('Test should run', () => {
    var a= 2
    beforeEach('blah blah blah', () => {

    })

    it('2 + 2 should equal ...', () => {
      expect(a+a).to.be.equal(4)
    })

    describe('Testing IntersectADJLIST, centered near (and super zoomed in near) Chicago and Wabash', () => {
      let region= {
        latitude:41.89739581173342,
        latitudeDelta:0.0007545541320510551,
        longitude:-87.6261898043719,
        longitudeDelta:0.0006758132295772157,
      }
      let intAdjList= new IntersectADJLIST(region)
      let intAdjListPromise= intAdjList.intersectsPerRegion()

      it('the instance intersectADJLIST prototype method intersectQueryBulk (IntersectADJLIST.prototype.intersectQueryBulk) centered near Chicago and Wabash should return an array of 8 elements ', (done) => {
        intAdjListPromise
          .then(res=>{
            let intersectionsArr= res.intersections
            expect(intersectionsArr.length).to.be.equal(8)
            done()
          })
          .catch(err=>err)
      })

      it('the instance intersectADJLIST should have an adjacency list, with 6 key value pairs',()=>{
        expect(Object.keys(intAdjList.adjList).length).to.be.equal(6)//2 of the intersections should have been combined into one
      })

      it('the instance intersectADJLIST prototype method sortStreetLookup should sort all street values in its streetLookup property',()=>{
        intAdjList.sortStreetLookup()
        // console.log(intAdjList.streetLookup)
        expect(intAdjList.streetLookup['N Wabash Ave'][0].latitude).to.be.below(intAdjList.streetLookup['N Wabash Ave'][3].latitude)
        expect(intAdjList.streetLookup['E Chicago Ave'][2].longitude).to.be.above(intAdjList.streetLookup['E Chicago Ave'][0].longitude)
      })

      it('the instance intersectADJLIST prototype method connectIntersectNodes should connect intersections in a street from lowest ',()=>{
        intAdjList.connectIntersectNodes()
        // console.dir(intAdjList, { depth: 5 })
        expect(intAdjList.adjList['41.896695,-87.62685'].connections.length).to.be.equal(4)
      })

    })

  })

})

describe("blah blah blah", function(){
	it("make more tests hereee!!  Don't forget you need done if you want to test async stuff", function(done){
    expect(1).to.be.equal(1)
		done()
	})
})
