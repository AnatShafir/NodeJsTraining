const { expect } = require('chai')

const { httpRequest, ammendRequestPath, insertDuty, requestOptions, expectedDuties } = require('../TestUtils')

describe('/duties/[id] - #get', () => {
  beforeEach(async () => {
    await insertDuty(expectedDuties[0])
  })
  
  afterEach(() => {
    delete expectedDuties[0].id
  })
  
  it('Should get duty by id', async () => {
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getDuties, `/${expectedDuties[0].id}`))))
      .to.eql(expectedDuties[0])
  })
  
  it(`Should return nothing when duty doesn't exist`, async () => {
    expect(await httpRequest(ammendRequestPath(requestOptions.getDuties, `/abcdefg`))).to.eql('')
  })
})