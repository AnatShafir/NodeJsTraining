const { expect } = require('chai')

const { httpRequest, ammendRequestPath, insertSoldier,
        testSoldiers, requestOptions, expectedSoldiers } = require('../TestUtils')

describe('/soldiers/[id] - #get', () => {
  beforeEach(async () => {
    await insertSoldier(expectedSoldiers[0])
  })
  
  it('Should get soldier by id', async () => {
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getSoldiers, `/${testSoldiers[0].id}`))))
      .to.eql(expectedSoldiers[0])
  })
  
  it(`Should return nothing when soldier by requested id doesn't exist`, async () => {
    expect(await httpRequest(ammendRequestPath(requestOptions.getSoldiers, `/1111111`))).to.eql('')
  })
})