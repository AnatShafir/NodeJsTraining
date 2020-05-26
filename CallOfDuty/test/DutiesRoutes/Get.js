const { expect } = require('chai')

const { httpRequest, ammendRequestPath, postAllDuties,
        testDuties, requestOptions, expectedDuties } = require('../TestUtils')

describe('/duties - #get', () => {
  beforeEach(async () => {
    await postAllDuties()
  })

  afterEach(() => {
    expectedDuties.forEach(testDuty => delete testDuty.id)
  })
  
  it('Should get all duties', async () => {
    expect(JSON.parse(await httpRequest(requestOptions.getDuties))).to.have.deep.members(expectedDuties)
  })
  
  it('Should match one duty to name query', async () => {
    const nameQuery = `?name=${testDuties[0].name.replace(' ', '+')}`
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getDuties, nameQuery))))
      .to.have.deep.members([expectedDuties[0]])
  })
  
  it('Should match multiple duties to name query', async () => {
    const nameQuery = `?name=${testDuties[1].name.replace(' ', '+')}`
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getDuties, nameQuery))))
      .to.have.deep.members([expectedDuties[1], expectedDuties[2]])
  })
  
  it('Should matche zero duties to name query', async () => {
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getDuties, `?name=no+name`))))
      .to.have.deep.members([])
  })
})