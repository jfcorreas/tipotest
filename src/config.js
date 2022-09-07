const config = {
    app: {
        port: 3080,
        name: "TipoTest API",
        DEFAULT_NUM_CHOICES: 4,
        DEFAULT_NUM_QUESTIONS: 100,
        DEFAULT_SCORING_FORMULA: "H-(F/4)"
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'tipotest'
    }
}

module.exports = config;