const DEFAULT_OPTIONS = {
  contract: 16,
  lambda: {
    documentsChangeSpace: 'documents.change-space',
    documentsDelete: 'documents.delete',
    documentsAddTokens: 'documents.add-tokens',
    documentsDeleteTokens: 'documents.delete-tokens',
    documentsMergePayload: 'documents.merge-payload',
    documentsUpsert: 'documents.upsert',
    documentsQ: 'documents.q',

    multiSpacesDelete: 'multi-spaces.delete',
    multiSpacesList: 'multi-spaces.list',
    multiSpacesUpsert: 'multi-spaces.upsert',

    multiSpacesLinksDelete: 'multi-spaces.links.delete',
    multiSpacesLinksList: 'multi-spaces.links.list',
    multiSpacesLinksUpsert: 'multi-spaces.links.upsert',

    tokensGet: 'tokens.get',
    tokensUpsert: 'tokens.upsert'
  },
  multiSpacesLimit: 10,
  qLimit: 10,
  key: null,
  encryptDocument: (i) => i,
  decryptDocument: (i) => i,
  encryptToken: (i) => i,
  decryptToken: (i) => i,
  encryptString: (i) => i,
  decryptString: (i) => i
}

class Options {
  constructor (options = {}) {
    Object.keys(DEFAULT_OPTIONS).forEach((key) => {
      this[key] = options[key] || DEFAULT_OPTIONS[key]
    })
  }
}

export default Options
