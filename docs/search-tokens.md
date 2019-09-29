# Search tokens

## tokens.get

Get tokens.

### Parameters

| *Parameter*   | *Required* | *Type*                             |
| ------------- |:----------:| :--------------------------------- |
| tokens        | *yes*      | String or String[]                 |

### Result

If tokens was array, returns array of result type.

| *Key*         | *Type*    | *Description*  |
| ------------- | ---------:| :------------- |
| id            | Integer   | Token id       |
| token         | String    | Token value    |

### Example

```javascript
const { id: tokenIdCat } = await documents.tokens.get('CAT')
const tokens = await documents.tokens.get([ 'DOG', 'FOX' ])

const byToken = tokens.reduce((agg, { id, token }) => {
  agg[token.toLowerCase()] = id
  return agg
}, {})
```

## tokens.upsert

Insert or update tokens.

### Parameters

| *Parameter*   | *Required* | *Type*                             |
| ------------- |:----------:| :--------------------------------- |
| tokens        | *yes*      | String or String[]                 |

### Result

If tokens was array, returns array of result type.

| *Key*         | *Type*    | *Description*  |
| ------------- | ---------:| :------------- |
| id            | Integer   | Token id       |
| token         | String    | Token value    |

### Example

```javascript
const { id: tokenIdCat } = await documents.tokens.upsert('CAT')
const tokens = await documents.tokens.upsert([ 'DOG', 'FOX' ])

const byToken = tokens.reduce((agg, { id, token }) => {
  agg[token.toLowerCase()] = id
  return agg
}, {})
```