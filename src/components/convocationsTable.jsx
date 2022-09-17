
import React, { Component } from 'react';
import ConvocationForm from "../components/convocationForm";

class ConvocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            busy: false,
            open: false,
            formOpen: false,
            convocations: [],
            convocationSelectedId: ""
        };

        this.handleDetailsClick = this.handleDetailsClick.bind(this);
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this);
    }

    async fetchInfo(apiPath) {
        return fetch(`${this.state.apiUrl}/${apiPath}`)
            .then(res => res.json())
            .catch(err => console.error(err))
    }

    async handleDetailsClick(event) {
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

    handleRowDoubleClick(event) {
        this.setState({ formOpen: true, convocationSelectedId: event.currentTarget.id });
        setTimeout(() => {this.setState({ formOpen: false })}, 100 );
    }

    render() {
        return (
            <section>
                <details open={this.state.open} >
                    <summary onClick={this.handleDetailsClick} aria-busy={this.state.busy}>
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
                                    <tr key={convocation._id}
                                        id={convocation._id}
                                        title="Double-click to edit"
                                        onDoubleClick={this.handleRowDoubleClick}>
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
                <ConvocationForm apiUrl={this.state.apiUrl} 
                            open={this.state.formOpen}  
                            convocationId={this.state.convocationSelectedId}>

                            </ConvocationForm>
            </section>
        )
    }
}

export default ConvocationsTable;