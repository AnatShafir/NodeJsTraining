const { expect } = require('chai')

const { httpRequest, testSoldiers, requestOptions } = require('../TestUtils')

describe('/soldiers - #post', () => {
  it('Should post a new soldier to db', async () => {
    expect(await httpRequest(requestOptions.postSoldiers, JSON.stringify(testSoldiers[0])))
      .to.eql(testSoldiers[0].id)
  })
  
  it('Should throw an error when not all parameters exist', async () => {
    let soldierWithoutRank = Object.assign({}, testSoldiers[0])
    delete soldierWithoutRank.rank
    expect(await httpRequest(requestOptions.postSoldiers, JSON.stringify(soldierWithoutRank)))
      .to.eql('Parameters are invalid')
  })
  
  it('Should throw an error when other than valid properties exist', async () => {
    let soldierWithAnotherProperty = Object.assign({}, testSoldiers[0])
    soldierWithAnotherProperty.anotherProperty = 'anotherProperty'
    expect(await httpRequest(requestOptions.postSoldiers, JSON.stringify(soldierWithAnotherProperty)))
      .to.eql('Parameters are invalid')
  })
})