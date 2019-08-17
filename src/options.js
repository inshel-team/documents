const DEFAULT_OPTIONS = {
  contract: 16,
  lambda: {
    tokensGet: 'tokens.get',
    tokensUpsert: 'tokens.upsert',
    documentsQ: 'documents.q',
    documentsUpsert: 'documents.upsert',
    documentsDelete: 'documents.delete',
    documentsAddTokens: 'documents.add-tokens',
    documentsDeleteTokens: 'documents.delete-tokens'
  },
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
