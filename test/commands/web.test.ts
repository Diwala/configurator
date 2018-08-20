import {expect, test} from '@oclif/test'

describe('web', () => {
  test
  .stdout()
  .command(['web', 'tests'])
  .it('runs web', ctx => {
    console.log("aetsfafefsefse")
    console.log(ctx)
    console.log("aetsfafefsefse")
  })
})
