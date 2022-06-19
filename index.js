const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3080

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({info: 'Multi-choice Tests REST API'})
})

app.listen(port, () => {
    console.log(`TIPOTEST running on port ${port}`)
})