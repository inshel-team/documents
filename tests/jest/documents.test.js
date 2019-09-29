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

test('Main way', async () => {
  const { node, key } = await nodeUtils.connect(config)
  const space = uuid.v4()
  const documentTokens = [uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4()]

  node.documents = new Documents(node, { key })
  const tokens = [uuid.v4(), uuid.v4()]
  const tokensIndexes = tokens.reduce((agg, t, i) => {
    agg[t] = i
    return agg
  }, {})
  const tokensId = (await node.documents.tokens.upsert(tokens))
    .reduce((agg, { id, token }, index) => {
      agg[tokensIndexes[token]] = id
      return agg
    }, {})

  const _documents = await node.documents.upsert([
    { space, token: documentTokens[0], payload: { a: 0 }, tokens: { [tokensId[0]]: 1000, [tokensId[1]]: 1000 } },
    { space, token: documentTokens[1], payload: { b: 0 }, tokens: { [tokensId[0]]: 900 } },
    { space, token: documentTokens[2], payload: { c: 0 }, tokens: { [tokensId[0]]: 800 } },
    { space, token: documentTokens[3], payload: { d: 0 }, tokens: { [tokensId[0]]: 700 } }
  ])
  const documentTokensIndexes = documentTokens.reduce((agg, documentToken, i) => {
    agg[documentToken] = i
    return agg
  }, {})
  const documents = _documents.reduce((agg, { id, token }) => {
    agg[documentTokensIndexes[token]] = id
    return agg
  }, {})

  await node.documents.delete(documents[2])
  await node.documents.changeSpace(documents[3], `${space}#`)

  await node.documents.multiSpaces.upsert(`${space}:ALL`)
  await node.documents.multiSpaces.links.upsert(`${space}:ALL`, space)
  await node.documents.multiSpaces.links.upsert(`${space}:ALL`, `${space}#`)

  const q = async (...args) => {
    const { documents: result } = await node.documents.q(...args)
    return result.map(({ token }) => token).sort()
  }

  await node.documents.addTokens(documents[1], [{ token: tokensId[1], rating: 1000 }])
  await node.documents.deleteTokens(documents[0], [tokensId[1]])

  expect(await q(space))
    .toStrictEqual([documentTokens[0], documentTokens[1]].sort())
  expect(await q(`${space}:ALL`))
    .toStrictEqual([documentTokens[0], documentTokens[1], documentTokens[3]].sort())
  expect(await q(`${space}:ALL`, [tokens[1]]))
    .toStrictEqual([documentTokens[1]].sort())
}, 30000)
