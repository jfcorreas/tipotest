const config = {
    app: {
        APIport: 3080,
        appName: "TIPOTEST",
        DEFAULT_NUM_CHOICES: 4,
        DEFAULT_NUM_QUESTIONS: 100,
        DEFAULT_SCORING_FORMULA: "H-(F/4)"
    },
    db: {
        host: 'localhost',
        port: 2000,
        name: 'db'
    }
}

module.exports = config;