const { expect } = require('chai')

const { httpRequest, postAllSoldiers, ammendRequestPath, 
        testSoldiers, requestOptions, expectedSoldiers } = require('../TestUtils')

describe('/soldiers - #get', () => {
  beforeEach(async () => {
    await postAllSoldiers()
  })

  it('Should get all soldiers', async () => {
    expect(JSON.parse(await httpRequest(requestOptions.getSoldiers))).to.have.deep.members(expectedSoldiers)
  })
  
  it('Should match one soldier to name query', async () => {
    const nameQuery = `?name=${testSoldiers[1].name.replace(' ', '+')}`
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getSoldiers, nameQuery))))
      .to.have.deep.members([expectedSoldiers[1]])
  })
  
  it('Should match multiple soldiers to name query', async () => {
    const nameQuery = `?name=${testSoldiers[0].name.replace(' ', '+')}`
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getSoldiers, nameQuery))))
      .to.have.deep.members([expectedSoldiers[0], expectedSoldiers[2]])
  })
  
  it('Should match zero soldiers to name query', async () => {
    const nameQuery = `?name=no+name`
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getSoldiers, nameQuery))))
      .to.have.deep.members([])
  })
})