const { expect } = require('chai')

const { httpRequest, ammendRequestPath, postAllSoldiers, postAllDuties,
        testSoldiers, requestOptions, expectedDuties } = require('../TestUtils')

describe('/justiceBoard - #get', () => {
  beforeEach(async () => {
    await postAllSoldiers()
    await postAllDuties()
    for (const duty of expectedDuties) {
      await httpRequest(ammendRequestPath(requestOptions.scheduleDuties, `/${duty.id}/schedule`))
    }
  })

  afterEach(() => {
    expectedDuties.map(testDuty => delete testDuty.id)
  })

  it('Should get the justice board', async () => {
    expect(JSON.parse(await httpRequest(requestOptions.getJusticeBoard)))
      .to.have.deep.members([{ id: testSoldiers[0].id, score: 7 },
                             { id: testSoldiers[1].id, score: 22 },
                             { id: testSoldiers[2].id, score: 17 }])
  })
})