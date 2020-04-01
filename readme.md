# g-Sheeez

> Read and Write to gsheets using google's api  
> Refer to [Google Api - Sheets](https://developers.google.com/sheets/api/quickstart/nodejs).

## Usage

Turn on the Google Sheets API by following the instructions from link above.  
Then download client configuration and save the file `credentials.json` to your working dir.

### Read

```javascript
sheep.configure(insertConfigObjHere)

const sheet = sheep.create({
  spreadsheetId: '',
  range: 'A:I',
})

const gridValues = sheet.grid({ headerLength: 1 })
const model = createModel(schema, gridValues)
console.log(model.getAll())
```

#### Schema Definition

### Write

```javascript
const sheet = sheep.create({
  spreadsheetId: '',
  range: 'A:I',
})

const grid = sheet.grid({ headerLength: 1 })
const model = createModel(schema, grid)

const blackSheep = model.get({ color: 'black' })

const newBlackSheep = sheet.update(blackSheep, { age: 5 })
sheet.save({ headerLength: 1 }, model.getChanges())
```

## API

## TODO

1. ~~add schema defs~~
1. ~~complete metadata~~ inprogress
1. ~~move all to TypeScript~~ inprogress
1. add multi sheet support
1. figure out how to tackle sheet refresh
