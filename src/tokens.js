const METHODS = ['get', 'upsert']

class Tokens {
  constructor (node, options) {
    this.node = node
    this.options = options

    METHODS.forEach((method) => {
      this[method] = this.options.key != null
        ? this[`_${method}`].bind(this, options.key)
        : this[`_${method}`].bind(this)
    })
  }

  async _get (key, _tokens) {
    const tokens = Array.isArray(_tokens) ? _tokens : [_tokens]

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.tokensGet,
      {
        tokens: tokens.map(this.options.encryptString)
      }
    )

    return Array.isArray(_tokens)
      ? result.map(this.options.decryptToken)
      : this.options.decryptToken(result[0])
  }

  async _upsert (key, _tokens) {
    const tokens = Array.isArray(_tokens) ? _tokens : [_tokens]

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.tokensUpsert,
      {
        tokens: tokens.map(this.options.encryptString)
      }
    )

    return Array.isArray(_tokens)
      ? result.map(this.options.decryptToken)
      : this.options.decryptToken(result[0])
  }
}

export default Tokens
