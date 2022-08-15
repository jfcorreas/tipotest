const express = require('express')

const app = express()
const PORT = process.env.PORT || 3080;

app.use(express.json())

app.get('/', (req, res) => {
    res.json({info: 'Multi-choice Tests REST API'})
});

app.listen(PORT, () => {
    console.log(`🌎 TIPOTEST running on port ${PORT}`)
});