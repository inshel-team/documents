import Options from './options'
import MultiSpaces from './multi-spaces'
import Tokens from './tokens'

const METHODS = [
  'changeSpace',
  'delete',
  'deleteByTokens',
  'addTokens',
  'deleteTokens',
  'mergePayload',
  'upsert',
  'q'
]

class Documents {
  constructor (node, options) {
    this.node = node
    this.options = new Options(options)

    this.tokens = new Tokens(this.node, this.options)
    this.multiSpaces = new MultiSpaces(this.node, this.options)

    METHODS.forEach((method) => {
      this[method] = this.options.key != null
        ? this[`_${method}`].bind(this, options.key)
        : this[`_${method}`].bind(this)
    })
  }

  async _changeSpace (key, _ids, space) {
    const id = Array.isArray(_ids) ? _ids : [_ids]

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsChangeSpace,
      { id, space }
    )

    return Array.isArray(_ids) ? result : result[0]
  }

  async _delete (key, _ids) {
    const id = Array.isArray(_ids) ? _ids : [_ids]

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsDelete,
      { id }
    )

    return Array.isArray(_ids) ? result : result[0]
  }

  async _deleteByTokens (key, space, _tokens) {
    const tokens = Array.isArray(_tokens) ? _tokens : [_tokens]

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsDelete,
      { space, tokens }
    )

    return Array.isArray(_tokens) ? result : result[0]
  }

  _addTokens (key, document, tokens) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsAddTokens,
      { document, tokens }
    )
  }

  _deleteTokens (key, document, tokens) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsDeleteTokens,
      { document, tokens }
    )
  }

  async _mergePayload (key, _ids, payload) {
    const id = Array.isArray(_ids) ? _ids : [_ids]

    const result = await this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.documentsMergePayload,
      { id, payload }
    )

    return Array.isArray(_ids) ? result : result[0]
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
    const tokens = Array.isArray(_tokens)
      ? _tokens
      : (_tokens == null ? [] : [_tokens])
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
        space: Array.isArray(space)
          ? space.map(this.options.encryptString)
          : this.options.encryptString(space),
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
