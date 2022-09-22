
import React, { Component } from 'react';
import ConvocationForm from "../components/convocationForm";

class ConvocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            convocations: [],
            convocationSelectedId: null,
            errorMessage: null,
            componentBusy: null,
            open: false,
            formOpen: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDetailsClick = this.handleDetailsClick.bind(this);
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this);
        this.handleNewButton = this.handleNewButton.bind(this);
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
    }

    async fetchAPI(apiPath) {
        return fetch(`${this.state.apiUrl}/${apiPath}`)
            .then(res => res.json())
            .catch(err => this.setState({ errorMessage: err.message }))
    }

    async handleRefresh() {
        this.setState({ errorMessage: null });
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI("convocations");

        const convocations = fetchResult && fetchResult.data ? fetchResult.data : [];
        this.setState({ convocations: convocations });
        this.toggleComponentBusy();
    }

    async handleDetailsClick(event) {
        event.preventDefault();
        if (this.state.open) {
            this.setState(() => ({ open: false }));
            return;
        }
        await this.handleRefresh();
        this.setState({ open: true }); 
    }

    handleRowDoubleClick(event) {
        this.toggleComponentBusy();
        this.setState({
            formOpen: true,
            convocationSelectedId: event.currentTarget.id,
            editingConvocation: true
        });
        setTimeout(() => { this.setState({ formOpen: false }) }, 100);
    }

    handleNewButton(event) {
        this.toggleComponentBusy();
        this.setState({
            formOpen: true,
            convocationSelectedId: null
        });
        setTimeout(() => { this.setState({ formOpen: false }) }, 100);
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy? null : 'componentBusy' });
    }

    render() {
        return (
            <section>
                <details open={this.state.open} className={this.state.componentBusy}>
                    <summary onClick={this.handleDetailsClick} aria-busy={this.state.componentBusy? true : false }>
                        Convocatorias
                    </summary>
                    <span className='warning'>{this.state.errorMessage}</span>
                    <a href="#" onClick={this.handleRefresh}>🔁</a>
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
                                        title="Doble click para editar"
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
                    <a href="#"
                        role="button"
                        className="primary outline"
                        onClick={this.handleNewButton}>
                        Nueva Convocatoria
                    </a>
                </details>
                <ConvocationForm apiUrl={this.state.apiUrl}
                    open={this.state.formOpen}
                    convocationId={this.state.convocationSelectedId}
                    cursorBusyHandler={this.toggleComponentBusy}
                    refreshParent={this.handleRefresh}>
                </ConvocationForm>
            </section>
        )
    }
}

export default ConvocationsTable;