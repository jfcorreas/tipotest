
import React, { Component } from 'react';
import ConvocationForm from "../components/convocationForm";

class ConvocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            convocations: [],
            convocationSelectedId: null,
            topicList: [],
            errorMessage: null,
            componentBusy: null,
            open: false,
            formOpen: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDetailsClick = this.handleDetailsClick.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this);
        this.handleNewButton = this.handleNewButton.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setErrorMessage(err.message));
    }

    async handleRefresh() {
        this.setErrorMessage(null);
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI('convocations');

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

    handleRowClick(event) {
        this.setState({
            convocationSelectedId: event.currentTarget.id,
        });
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

    handleEditButton(event) {
        this.toggleComponentBusy();
        this.setState({
            formOpen: true,
            editingConvocation: true
        });
        setTimeout(() => { this.setState({ formOpen: false }) }, 100);
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <section>
                <details open={this.state.open} className={this.state.componentBusy}>
                    <summary onClick={this.handleDetailsClick} aria-busy={this.state.componentBusy ? true : false}>
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
                                        onClick={this.handleRowClick}
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
                        className="primary"
                        onClick={this.handleNewButton}>
                        Nueva Convocatoria
                    </a>
                    <a href="#"
                        role="button"
                        className="primary outline"
                        disabled={this.state.convocationSelectedId ? false : true}
                        onClick={this.handleEditButton}>
                        Editar Convocatoria
                    </a>
                    <h5 aria-busy={this.state.componentBusy ? true : false}>
                        Temario de la Convocatoria
                    </h5>
                    <ol>
                        {this.state.topicList.map((topic) => {
                            return (
                                <li title={topic.fullTitle}>{topic.title}</li>
                            )
                        })}
                    </ol>
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