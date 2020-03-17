# g-Sheeez
> Read and Write to gsheets using google's api  
> Refer to [Google Api - Sheets](https://developers.google.com/sheets/api/quickstart/nodejs).

## Usage
Read and Write to gsheet.

### Read
```javascript
  const rangeVals = sheeez.get({
      spreadsheetId: '<sheetID>',
      range: 'A:O',
  })

  const model = sheeez.createModel(rangeVals, schema)
  console.log(model)
```

#### Schema Definition
TODO

### Write
```javascript
  const trans = sheeez.write(model, 
                             { row: 1, 
                               column: 'Col1' }, 
                             'Hello!')
  const result = await trans.save()
```

## TODO
1. add schema defs
1. complete metadata
1. move all to TypeScript
