import Options from './options'
import Tokens from './tokens'

const METHODS = ['upsert', 'q']

class Documents {
  constructor (node, options) {
    this.node = node
    this.options = new Options(options)
    this.tokens = new Tokens(this.node, this.options)

    METHODS.forEach((method) => {
      this[method] = this.options.key != null
        ? this[`_${method}`].bind(this, options.key)
        : this[`_${method}`].bind(this)
    })
  }

  async _upsert (key, _documents, _options) {
    const documents = Array.isArray(_documents) ? _documents : [_documents]
    const options = _options || {}

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsUpsert,
      {
        mergeTokens: typeof options.mergeTokens === 'boolean' ? options.mergeTokens : true,
        documents: documents.map(this.options.encryptDocument)
      }
    )

    return Array.isArray(_documents) ? result : result[0]
  }

  async _q (key, space, _tokens, _options) {
    const tokens = Array.isArray(_tokens) ? _tokens : [_tokens]
    const options = _options || {}

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsQ,
      {
        id: options.id,
        limit: options.limit || 10,
        offset: options.offset || 0,
        soft: Boolean(options.soft),
        space: this.options.encryptString(space),
        tokens: tokens.map(this.options.encryptString)
      }
    )

    return {
      ...result,
      documents: result.documents.map(this.options.decryptDocument)
    }
  }
}

export default Documents
