const { expect } = require('chai')

const { httpRequest, ammendRequestPath, getDutyFromDB, insertDuty,
        testSoldiers, requestOptions, expectedDuties } = require('../TestUtils')

describe('/duties/[id] - #patch', () => {
  beforeEach(async () => {
    await insertDuty(expectedDuties[0])
  })

  afterEach(() => {
    delete expectedDuties[0].id
  })  

  it('Should update duty', async () => {
    let patchedDuty = Object.assign({}, expectedDuties[0])
    patchedDuty.soldiersRequired = 3
    patchedDuty.value = 8
    await httpRequest(ammendRequestPath(requestOptions.updateDuties, `/${expectedDuties[0].id}`), 
                      JSON.stringify(patchedDuty))  
    expect(await getDutyFromDB(expectedDuties[0].id)).to.eql(patchedDuty)
  })
  
  it(`Should throw an error when the duties' properties don't match`, async () => {
    let patchedDuty = Object.assign({}, expectedDuties[0])
    patchedDuty.anotherProperty = 'anotherProperty'
    delete patchedDuty.value
    expect(await httpRequest(ammendRequestPath(requestOptions.updateDuties, `/${expectedDuties[0].id}`), 
      JSON.stringify(patchedDuty))).to.eql('Patch properties must match original duty properties')
  })

  it(`Should throw an error when the duties' ids don't match`, async () => {
    let patchedDuty = Object.assign({}, expectedDuties[0])
    patchedDuty.id = '1111111'
    expect(await httpRequest(ammendRequestPath(requestOptions.updateDuties, `/${expectedDuties[0].id}`),
      JSON.stringify(patchedDuty))).to.eql(`Patch's id must match original duty's id`)
  })

  it('Should throw an error when the duty is scheduled', async () => {
    let scheduledDuty = Object.assign({}, expectedDuties[0])
    scheduledDuty.soldiers = [testSoldiers[0].id, testSoldiers[1].id]
    await insertDuty(scheduledDuty)
    scheduledDuty.name = "rasar"
    expect(await httpRequest(ammendRequestPath(requestOptions.updateDuties, `/${expectedDuties[0].id}`),
      JSON.stringify(scheduledDuty))).to.eql('Duty is already scheduled')
  })
})