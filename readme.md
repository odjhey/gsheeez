# g-Sheeez
> Read and Write to gsheets using google's api  
> Refer to [Google Api - Sheets](https://developers.google.com/sheets/api/quickstart/nodejs).

## Usage
Turn on the Google Sheets API by following the instructions from link above.  
Then download client configuration and save the file `credentials.json` to your working dir.


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

### Write
```javascript
  const trans = sheeez.write(model, 
                             { row: 1, 
                               column: 'Col1' }, 
                             'Hello!')
  const result = await trans.save()
```

## API

## TODO
1. ~~add schema defs~~
1. ~~complete metadata~~ inprogress
1. ~~move all to TypeScript~~ inprogress
1. add multi sheet support
1. figure out how to tackle sheet refresh
