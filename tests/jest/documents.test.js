/* eslint-env jest */

import '@babel/polyfill'
import uuid from 'uuid'

import Documents from '../../src'
import createConfig from '../utils/config'
import nodeUtils from '../utils'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('Upsert', async () => {
  const { node, key } = await nodeUtils.connect(config)
  const space = uuid.v4()
  const token = uuid.v4()

  const documents = new Documents(node, { key })

  const result = await documents.upsert({
    space,
    token,
    payload: { firstDocument: true },
    tokens: {}
  })

  expect(result.token).toEqual(token)
})

test('Query', async () => {
  const { node, key } = await nodeUtils.connect(config)
  const space = uuid.v4()
  const token = uuid.v4()

  const documents = new Documents(node, { key })

  const { id: ratingToken } = await documents.tokens.upsert('RATING')
  await documents.upsert(new Array(25).fill({
    space,
    payload: { firstDocument: true },
    tokens: {}
  }).map((i, index) => ({
    ...i,
    payload: { ...i.payload, index },
    token: `${token}:${index}`,
    tokens: {
      [ratingToken]: index
    }
  })))

  const { documents: data } = await documents.q(space, [])

  expect(data.map(({ token }) => token))
    .toStrictEqual(new Array(10).fill().map((_, index) => `${token}:${24 - index}`))
})
