import clone from 'ramda/src/clone'

const DEFAULT_OPTIONS = {
}

const encryption = (options, encrypt, decrypt) => {
  const result = options || { }
  result.encryptString = encrypt
  result.decryptString = decrypt

  const encryptionOptions = options.encryption || {}
  Object.keys(DEFAULT_OPTIONS).forEach((key) => {
    encryptionOptions[key] = encryptionOptions[key] || DEFAULT_OPTIONS[key]
  })

  const safeDecrypt = (document, errorKey, value) => {
    try {
      if (typeof value === 'object') {
        return JSON.parse(decrypt(value.encrypted))
      }

      return decrypt(value)
    } catch (e) {
      document.error = document.error || {}
      document.error[errorKey] = document.error[errorKey] || []
      document.error[errorKey].push(e)
    }
  }

  result.encryptToken = (document) => {
    const resultItem = clone(document)
    resultItem.token = result.encryptString(resultItem.token)

    return resultItem
  }

  result.decryptToken = (document) => {
    const resultItem = clone(document)
    resultItem.token = safeDecrypt(resultItem, 'token', resultItem.token)

    return resultItem
  }

  result.encryptDocument = () => {
    const resultItem = clone(document)
    resultItem.space = result.encryptString(resultItem.space)
    resultItem.token = result.encryptString(resultItem.token)
    resultItem.payload = {
      encrypted: result.encryptString(JSON.stringify(resultItem.payload))
    }

    return resultItem
  }

  result.decryptDocument = () => {
    const resultItem = clone(document)
    resultItem.space = safeDecrypt(resultItem, 'space', resultItem.space)
    resultItem.token = safeDecrypt(resultItem, 'token', resultItem.token)
    resultItem.payload = safeDecrypt(resultItem, 'payload', resultItem.payload)

    return resultItem
  }

  return result
}

export default encryption
