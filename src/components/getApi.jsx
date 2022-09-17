
import React, { Component } from 'react';

class APIForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            busy: false,
            query: '',
            result: '',
            apiUrl: props.apiUrl
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async fetchInfo (apiPath) {
        return fetch(`${this.state.apiUrl}/${apiPath}`)
        .then(res => res.json())
        .catch(err => console.error(err))
    }

    handleChange(event) {
        this.setState({ query: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState(prevState => ({ busy: !prevState.busy }));
        const fetchResult = await this.fetchInfo(this.state.query);
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
                            placeholder="Introduce aquí la consulta"
                            value={this.state.query}
                            onChange={this.handleChange} />
                        <small>Por ejemplo: convocations, topics, questions o tests</small>
                    </label>
                    <button type="submit" aria-busy={this.state.busy}>
                        Buscar información de esta IP
                    </button>
                </form>
                <pre>
                    {JSON.stringify(this.state.result, null, 2)}
                </pre>
            </div>
        )
    }
}

export default APIForm;