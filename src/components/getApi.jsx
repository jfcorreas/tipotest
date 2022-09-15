
import React, { Component } from 'react';

const config = {
    apiurl: "http://localhost:3080/api/v1"
};

const fetchInfo = (apiPath) => {
    return fetch(`${config.apiurl}/${apiPath}`)
        .then(res => res.json())
        .catch(err => console.error(err))
}

class APIForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busy: false,
            query: '',
            result: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ query: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState(prevState => ({ busy: !prevState.busy }));
        const fetchResult = await fetchInfo(this.state.query);
        const convocations = fetchResult && fetchResult.data ? fetchResult.data : [];

        this.setState(prevState => ({ busy: !prevState.busy, result: convocations }));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label> IP del usuario
                        <input required
                            type="text"
                            placeholder="Introduce aquí la IP"
                            value={this.state.query}
                            onChange={this.handleChange} />
                        <small>Por ejemplo: 54.85.132.205</small>
                    </label>
                    <button type="submit" aria-busy={this.state.busy}>
                        Buscar información de esta IP
                    </button>
                </form>
                <pre id="results">
                    {JSON.stringify(this.state.result, null, 2)}
                </pre>
            </div>
        )
    }
}

export default APIForm;