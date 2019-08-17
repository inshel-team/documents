# Crypted storage

You can use IS Documents with client-side encryption.

## aes-js example

```javascript
import Documents from '@inshel/documents'
import documentsEncryption from '@inshel/documents/lib/encryption'
import aes from 'aes-js'

const encrypt = (value) => {
  const aesCtr = new aes.ModeOfOperation.ctr(
    [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
    new aes.Counter(5)
  )

  return aes.utils.hex.fromBytes(
    aesCtr.encrypt(
      aes.utils.utf8.toBytes(value)
    )
  )
}

const decrypt = (value) => {
  const aesCtr = new aes.ModeOfOperation.ctr(
    [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
    new aes.Counter(5)
  )

  return aes.utils.utf8.fromBytes(
    aesCtr.decrypt(
      aes.utils.hex.toBytes(value)
    )
  )
}

const encryptedDocuments = new Documents(
  node, 
  documentsEncryption({ key }, encrypt, decrypt)
)
```