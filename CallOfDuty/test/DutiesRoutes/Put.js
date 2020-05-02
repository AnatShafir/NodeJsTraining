const { expect } = require('chai')

const { httpRequest, ammendRequestPath, postAllSoldiers, insertDuty,
        requestOptions, expectedDuties, testSoldiers } = require('../TestUtils')

describe('/duties/[id]/schedule - #put', () => {
  beforeEach(async () => {
    await postAllSoldiers()
    await insertDuty(expectedDuties[1])
  })
  
  afterEach(() => {
    delete expectedDuties[1].id
  })

  it('Should schedule duty', async () => {
    await httpRequest(ammendRequestPath(requestOptions.scheduleDuties, `/${expectedDuties[1].id}/schedule`))
    expect(JSON.parse(await httpRequest(ammendRequestPath(requestOptions.getDuties, `/${expectedDuties[1].id}`))).soldiers)
      .to.have.members([testSoldiers[1].id, testSoldiers[2].id])
  })

  it(`Should throw an error when the duty is scheduled`, async () => {
    await httpRequest(ammendRequestPath(requestOptions.scheduleDuties, `/${expectedDuties[1].id}/schedule`)) 
    expect(await httpRequest(ammendRequestPath(requestOptions.scheduleDuties, `/${expectedDuties[1].id}/schedule`)))
      .to.eql('Duty is already scheduled')
  })

  it(`Should throw an error when not enough soldiers match the duty`, async () => {
    let patchedDuty = Object.assign({}, expectedDuties[1])
    patchedDuty.soldiersRequired = 4
    await insertDuty(patchedDuty)
    expect(await httpRequest(ammendRequestPath(requestOptions.scheduleDuties, `/${expectedDuties[1].id}/schedule`)))
      .to.eql('Not enough soldiers that match the constraints to schedule duty')
  })
})