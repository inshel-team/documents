# Multi-spaces

## multiSpaces.upsert

Upsert multi-space.

### Parameters

| *Parameter*   | *Required* | *Type* |
| ------------- | :--------: | :----- |
| name          | *yes*      | String |

### Result

Returns true.

### Example

```javascript
await documents.multiSpaces.upsert('ANIMALS')
```

## multiSpaces.delete

Delete multi-space.

### Parameters

| *Parameter*   | *Required* | *Type*                             |
| ------------- |:----------:| :--------------------------------- |
| name          | *yes*      | String                             |

### Result

Returns true.

### Example

```javascript
await documents.multiSpaces.delete('ANIMALS')
```

## multiSpaces.list

Get multi-spaces.

### Parameters

| *Parameter* | *Required* | *Type* | *Default value*          |
| ----------- | :--------: | :----- | :----------------------- |
| options     | *no*       | Object | { limit: 10, offset: 0 } |

### Result

Returns array of result type.

| *Key*       | *Type*  |
| ----------- | :------ |
| name        | String  |
| links       | Integer |

### Example

```javascript
console.log(await documents.multiSpaces.list())
console.log(await documents.multiSpaces.list({ limit: 1 }))

// Console:
// [ { name: 'ASPACE', links: 10 }, { name: 'BSPACE', links: 0 }, ... ]
// [ { name: 'ASPACE', links: 10 } ]
```

## multiSpaces.links.upsert

Upsert multi-space link.

### Parameters

| *Parameter* | *Required* | *Type* |
| ----------- |:----------:| :----- |
| multiSpace  | *yes*      | String |
| space       | *yes*      | String |

### Result

Returns true.

### Example

```javascript
await documents.multiSpaces.links.upsert('ANIMALS', 'CATS')
```

## multiSpaces.links.delete

Delete multi-space link.

### Parameters

| *Parameter* | *Required* | *Type* |
| ----------- |:----------:| :----- |
| multiSpace  | *yes*      | String |
| space       | *yes*      | String |

### Result

Returns true.

### Example

```javascript
await documents.multiSpaces.links.delete('ANIMALS', 'CATS')
```

## multiSpaces.links.list

Get multi-space links.

### Parameters

| *Parameter* | *Required* | *Type* | *Default value*          |
| ----------- | :--------: | :----- | :----------------------- |
| multiSpace  | *yes*      | String | *No*                     |
| options     | *no*       | Object | { limit: 10, offset: 0 } |

### Result

Returns array of string.

### Example

```javascript
console.log(await documents.multiSpaces.list())
console.log(await documents.multiSpaces.list({ limit: 1 }))

// Console:
// [ 'CATS', 'DOGS', 'FOXES', ... ]
// [ 'CATS' ]
```