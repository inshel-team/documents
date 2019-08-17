import Node from '@inshel/node'
import JSEncrypt from 'node-jsencrypt'

class Utils {
  constructor () {
    this.nodes = []
  }

  connect = async (config) => {
    const encryptkey = new JSEncrypt()
    encryptkey.setPrivateKey(config.key)

    const node = new Node()
    this.nodes.push(node)
    await node.connect()

    const { key } = await node.keys.approve(encryptkey)

    return { node, key }
  }

  disconnectAll = async () => {
    while (this.nodes.length > 0) {
      const node = this.nodes.shift()
      if (node.status !== Node.STATUSES.CONNECTED) {
        continue
      }

      await node.disconnect()
    }
  }
}

export default new Utils()
