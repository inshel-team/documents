# Documents

## upsert

Insert or update documents (values of space and token are unique).

### Parameters

| *Parameter*   | *Required* | *Type*                             |
| ------------- |:----------:| :--------------------------------- |
| documents     | *yes*      | UpsertDocument or UpsertDocument[] |
| options       | *no*       | UpsertOptions                      |

*UpsertDocument*

| *Key*         | *Type*  | *Required* | *Description*              |
| ------------- | :------ | :--------: | :------------------------- |
| space         | String  | *yes*      | Document space             |
| token         | String  | *yes*      | Document token             |
| payload       | Object  | *yes*      | Document payload           |
| tokens        | Object  | *yes*      | Document search vector     |
|               |         |            | { [tokenID]: tokenRating } |

*UpsertOptions*

| *Key*         | *Type*   | *Required* | *Default value*        | *Description*                        |
| ------------- | :------- | :--------: | :--------------------- | :----------------------------------- |
| mergeTokens   | Boolean  | *no*       | true                   | Merge or update search vector        |
| rays          | String[] | *no*       | null                   | Rays into which upsert events fall   |
|               |          |            |                        | (use pattern "key/ray" to subscribe) |

### Result

If documents was array, returns array of result type.

| *Key*         | *Type*    | *Description*  |
| ------------- | ---------:| :------------- |
| id            | Integer   | Document id    |
| token         | String    | Document token |

### Example

```javascript
const TOKENS = {
  MY_TOKEN: 1876,
  ANOTHER_TOKEN: 1877,
}

console.log(await documents.upsert(
  [
    { 
      space: 'my-space', 
      token: 'my-doc', 
      payload: { a: 18 }, 
      tokens: {
        [TOKENS.MY_TOKEN]: 42,
        [TOKENS.ANOTHER_TOKEN]: 420
      } 
    },
    { 
      space: 'my-space', 
      token: 'my-doc2', 
      payload: { b: 2 }, 
      tokens: {
        [TOKENS.MY_TOKEN]: 420,
        [TOKENS.ANOTHER_TOKEN]: 4200
      } 
    }
  ],
  {}
))
console.log(await documents.upsert(
  { 
    space: 'my-space', 
    token: 'my-doc2', 
    payload: { c: 42 }, 
    tokens: {
      [TOKENS.ANOTHER_TOKEN]: 10
    } 
  }
))
console.log(await documents.upsert(
  { 
    space: 'my-space', 
    token: 'my-doc', 
    payload: {}, 
    tokens: {
      [TOKENS.ANOTHER_TOKEN]: 420
    } 
  },
  {
    mergeTokens: false
  }
))
// Console:
// [ { id: 42, token: 'my-doc' }, { id: 43, token: 'my-doc2' } ]
// { id: 43, token: 'my-doc2' }
// { id: 42, token: 'my-doc' }

// Documents:
// { id: 42, space: 'my-space', token: 'my-doc', payload: { a: 18 }, searchTokens: { '1877': 420 } }
// { id: 43, space: 'my-space', token: 'my-doc2', payload: { b: 2 }, searchTokens: { '1876': 420, '1877': 10 } }
```

## changeSpace

Change documents space.

### Parameters

| *Parameter*   | *Required* | *Type*               | *Description* |
| ------------- | :--------: | :------------------- | :------------ |
| id            | *yes*      | Integer or Integer[] | Documents id  |
| space         | *yes*      | String               | New space     |

### Result

If id was array, returns array of result type.

| *Key*         | *Type*    | *Description*  |
| ------------- | :-------- | :------------- |
| id            | Integer   | Document id    |
| token         | String    | Document token |

### Example

```javascript
console.log(await documents.changeSpace(0, 'new space'))
console.log(await documents.changeSpace([ 0 ], 'new space'))
console.log(await documents.changeSpace([ 0, 1 ], 'new space'))

// Console:
// { id: 0, token: 'document token' }
// [ { id: 0, token: 'document token' } ]
// [ { id: 0, token: 'document token' }, { id: 1, token: 'my document token' } ]
```

## mergePayload

Merge documents payload.

### Parameters

| *Parameter* | *Required* | *Type*               | *Description* |
| ----------- | :--------: | :------------------- | :------------ |
| id          | *yes*      | Integer or Integer[] | Documents id  |
| payload     | *yes*      | Object               | Payload       |

### Result

If id was array, returns array of result type.

| *Key*         | *Type*    | *Description*  |
| ------------- | :-------- | :------------- |
| id            | Integer   | Document id    |

### Example

```javascript
console.log(await documents.mergePayload(0, { a: 1 }))
console.log(await documents.changeSpace([ 0 ], { b: 2 }))
console.log(await documents.changeSpace([ 0, 1 ], { c: 3 }))

// Console:
// { id: 0 }
// [ { id: 0 } ]
// [ { id: 0 }, { id: 1 } ]
```

## q

Get documents.  
Support soft query (loose match).

### Parameters

| *Parameter*  | *Required* | *Type*             | *Description*  |
| ------------ | :--------: | :----------------- | :------------- |
| space        | *yes*      | String or String[] | Spaces         |
| searchTokens | *yes*      | String or String[] | Search tokens  |
| options      | *yes*      | QOptions           | Search options |

*QOptions*

| *Key*  | *Type*               | *Default value* | *Description*  |
| ------ | :------------------- | :-------------- | :------------- |
| id     | Integer or Integer[] | null            | Document id    |
| tokens | String or String[]   | null            | Document token |
| soft   | Boolean              | false           | Soft query     |
| limit  | Integer              | 10              | Query limit    |
| offset | Integer              | 0               | Query offset   |

### Result

| *Key*     | *Type*            | *Description*                   |
| --------- | :---------------- | :------------------------------ |
| tokens    | QTokenResult[]    | Query search tokens description |
| documents | QDocumentResult[] | Query documents                 |

*QTokenResult*

| *Key*     | *Type*  | *Description* |
| --------- | :------ | :------------ |
| ignored   | Boolean | Token status  |
| token     | Integer | Token id      |

*QDocumentResult*

| *Key*   | *Type*  | *Description*    |
| ------- | :------ | :--------------- |
| id      | Integer | Document id      |
| token   | String  | Document token   |
| payload | Object  | Document payload |

### Example

```javascript
await documents.q('my-space', 'my-token')
await documents.q('my-space', [ 'cute', 'my-token' ])
```

## delete

Delete documents.

### Parameters

| *Parameter*   | *Required* | *Type*               | *Description* |
| ------------- | :--------: | :------------------- | :------------ |
| id            | *yes*      | Integer or Integer[] | Documents id  |

### Result

If id was array, returns array of result type.

| *Key*         | *Type*    | *Description*  |
| ------------- | :-------- | :------------- |
| id            | Integer   | Document id    |
| token         | String    | Document token |

### Example

```javascript
console.log(await documents.delete(0))
console.log(await documents.delete([ 1 ]))
console.log(await documents.delete([ 2, 3 ]))

// Console:
// { id: 0, token: 'document token' }
// [ { id: 1, token: 'document token2' } ]
// [ { id: 2, token: 'document token3' }, { id: 3, token: 'my document token4' } ]
```

## deleteByTokens

Delete documents by tokens.

### Parameters

| *Parameter*   | *Required* | *Type*             | *Description*    |
| ------------- | :--------: | :----------------- | :--------------- |
| space         | *yes*      | String             | Documents space  |
| tokens        | *yes*      | String or String[] | Documents tokens |

### Result

If tokens was array, returns array of result type.

| *Key*         | *Type*    | *Description*  |
| ------------- | :-------- | :------------- |
| id            | Integer   | Document id    |
| token         | String    | Document token |

### Example

```javascript
console.log(await documents.deleteByTokens('my-space', 'document token'))
console.log(await documents.deleteByTokens('my-space', [ 'document token2' ]))
console.log(await documents.deleteByTokens('my-space', [ 'dt3', 'dt4' ]))

// Console:
// { id: 0, token: 'document token' }
// [ { id: 1, token: 'document token2' } ]
// [ { id: 2, token: 'dt3' }, { id: 3, token: 'dt4' } ]
```

## addTokens

Add search tokens to document.

### Parameters

| *Parameter*   | *Required* | *Type*  | *Description*              |
| ------------- | :--------: | :------ | :------------------------- |
| document      | *yes*      | Integer | Document id                |
| tokens        | *yes*      | Object  | Document search vector     |
|               |            |         | { [tokenID]: tokenRating } |

### Result

Returns array of tokens (String[]).

### Example

```javascript
await documents.addTokens(documentId, { [TOKENS.MY_TOKEN]: 1290 })
```

## deleteTokens

Remove search tokens from document.

### Parameters

| *Parameter*   | *Required* | *Type*    | *Description* |
| ------------- | :--------: | :-------- | :------------ |
| document      | *yes*      | Integer   | Document id   |
| tokens        | *yes*      | Integer[] | Tokens id     |

### Result

Returns array of tokens (String[]).

### Example

```javascript
await documents.deleteTokens(documentId, TOKENS.MY_TOKEN)
```