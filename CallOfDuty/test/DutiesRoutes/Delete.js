const { expect } = require('chai')

const { httpRequest, ammendRequestPath, insertDuty, getDutyFromDB,
        requestOptions, expectedDuties, testSoldiers } = require('../TestUtils')

describe('/duties/[id] - #delete', () => {
  beforeEach(async () => {
    await insertDuty(expectedDuties[0])
  })
  
  afterEach(() => {
    delete expectedDuties[0].id
  })

  it('Should delete duty from db', async () => {
    await httpRequest(ammendRequestPath(requestOptions.deleteDuties, `/${expectedDuties[0].id}`))
    expect(await getDutyFromDB(expectedDuties[0].id)).to.be.undefined
  })
      
  it(`Should throw an error when the duty is scheduled`, async () => {
    let scheduledDuty = Object.assign({}, expectedDuties[0])
    scheduledDuty.soldiers = [testSoldiers[0].id, testSoldiers[1].id]
    await insertDuty(scheduledDuty)
    expect(await httpRequest(ammendRequestPath(requestOptions.deleteDuties, `/${scheduledDuty.id}`)))
      .to.eql('Duty is already scheduled')
  })
})