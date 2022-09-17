
import React, { Component } from 'react';

class ConvocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            busy: false,
            open: false,
            query: '',
            convocations: [],
            apiUrl: props.apiUrl
        };

        this.handleClick = this.handleClick.bind(this);
    }

    async fetchInfo(apiPath) {
        return fetch(`${this.state.apiUrl}/${apiPath}`)
            .then(res => res.json())
            .catch(err => console.error(err))
    }

    async handleClick(event) {
        event.preventDefault();
        if (this.state.open) {
            this.setState(() => ({ open: false }));
            return;
        }

        this.setState((prevState) => ({ busy: !prevState.busy, open: true }));
        const fetchResult = await this.fetchInfo("convocations");
        const convocations = fetchResult && fetchResult.data ? fetchResult.data : [];
        this.setState((prevState) => ({ busy: !prevState.busy, convocations: convocations }));
    }

    render() {
        return (

            <details open={this.state.open} >
                <summary onClick={this.handleClick} aria-busy={this.state.busy}>
                    Convocatorias
                </summary>
                <table role="grid">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Año</th>
                            <th scope="col">Administración</th>
                            <th scope="col">Categoría</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.convocations.map((convocation) => {
                            return (
                                <tr key={convocation._id}>
                                    <th scope="row">{convocation.name}</th>
                                    <td>{convocation.year}</td>
                                    <td>{convocation.institution}</td>
                                    <td>{convocation.category}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <a href="#" role="button" className="contrast outline">Nueva Convocatoria</a>
            </details>
        )
    }
}

export default ConvocationsTable;