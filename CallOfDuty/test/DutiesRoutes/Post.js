const { expect } = require('chai')

const { httpRequest, getDutyFromDB, testDuties, requestOptions, expectedDuties } = require('../TestUtils')

describe('/duties - #post', () => {
  it('Should post a new duty to db', async () => {
    expectedDuties[0].id = await httpRequest(requestOptions.postDuties, JSON.stringify(testDuties[0]))
    expect(await getDutyFromDB(expectedDuties[0].id)).to.eql(expectedDuties[0])
  })
  
  it('Should throw an error when not all parameters exist', async () => {
    let dutyWithoutName = Object.assign({}, testDuties[0])
    delete dutyWithoutName.name
    expect(await httpRequest(requestOptions.postDuties, JSON.stringify(dutyWithoutName)))
      .to.eql('Parameters are invalid')
  })
  
  it('Should throw an error when other than valid properties exist', async () => {
    let dutyWithAnotherProperty = Object.assign({}, testDuties[0])
    dutyWithAnotherProperty.anotherProperty = 'anotherProperty'
    expect(await httpRequest(requestOptions.postDuties, JSON.stringify(dutyWithAnotherProperty)))
      .to.eql('Parameters are invalid')
  })
})