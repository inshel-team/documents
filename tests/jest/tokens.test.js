/* eslint-env jest */

import '@babel/polyfill'

import Documents from '../../src'
import createConfig from '../utils/config'
import nodeUtils from '../utils'

const config = createConfig()

afterEach(async () => {
  await nodeUtils.disconnectAll()
})

test('Upsert', async () => {
  const { node, key } = await nodeUtils.connect(config)

  const documents = new Documents(node, { key })

  const result = await documents.tokens.upsert('MIH')
  const resultMany = await documents.tokens.upsert(['MIH', 'KAKA'])

  expect(result.token).toEqual('MIH')
  expect(resultMany.map(({ token }) => token)).toEqual(expect.arrayContaining(['MIH', 'KAKA']))
})

test('Get', async () => {
  const { node, key } = await nodeUtils.connect(config)

  const documents = new Documents(node, { key })
  await documents.tokens.upsert(['MIH', 'KAKA'])

  const result = await documents.tokens.get('MIH')
  const resultMany = await documents.tokens.get(['MIH', 'KAKA'])

  expect(result.token).toEqual('MIH')
  expect(resultMany.map(({ token }) => token)).toEqual(expect.arrayContaining(['MIH', 'KAKA']))
})
