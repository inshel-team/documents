const METHODS = ['delete', 'list', 'upsert']
const LINK_METHODS = ['delete', 'list', 'upsert']

class MultiSpaces {
  constructor (node, options) {
    this.node = node
    this.options = options

    this.links = {}

    METHODS.forEach((method) => {
      this[method] = this.options.key != null
        ? this[`_${method}`].bind(this, options.key)
        : this[`_${method}`].bind(this)
    })

    LINK_METHODS.forEach((method) => {
      this.links[method] = this.options.key != null
        ? this[`_links${method[0].toUpperCase()}${method.substr(1)}`].bind(this, options.key)
        : this[`_links${method[0].toUpperCase()}${method.substr(1)}`].bind(this)
    })
  }

  _delete (key, name) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.multiSpacesDelete,
      { name }
    )
  }

  _list (key, { limit, offset } = {}) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.multiSpacesList,
      {
        limit: limit || this.options.multiSpacesLimit,
        offset: offset || 0
      }
    )
  }

  _upsert (key, name) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.multiSpacesUpsert,
      { name }
    )
  }

  _linksDelete (key, multiSpace, space) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.multiSpacesLinksDelete,
      { multiSpace, space }
    )
  }

  _linksList (key, multiSpace, { limit, offset } = { }) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.multiSpacesLinksList,
      {
        multiSpace,
        limit: limit || this.options.multiSpacesLimit,
        offset: offset || 0
      }
    )
  }

  _linksUpsert (key, multiSpace, space) {
    return this.node.contracts.lambda(
      key,
      this.options.contract,
      this.options.lambda.multiSpacesLinksUpsert,
      { multiSpace, space }
    )
  }
}

export default MultiSpaces
