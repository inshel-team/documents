import aes from 'aes-js'

const getKey = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const Ctr = aes.ModeOfOperation.ctr

const encrypt = (value) => {
  const aesCtr = new Ctr(getKey(), new aes.Counter(5))

  return aes.utils.hex.fromBytes(
    aesCtr.encrypt(
      aes.utils.utf8.toBytes(value)
    )
  )
}

const decrypt = (value) => {
  const aesCtr = new Ctr(getKey(), new aes.Counter(5))

  return aes.utils.utf8.fromBytes(
    aesCtr.decrypt(
      aes.utils.hex.toBytes(value)
    )
  )
}

export default {
  encrypt,
  decrypt
}
