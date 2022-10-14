
import React, { Component } from 'react';
import ConvocationForm from "./convocationForm";
import ConvocationTopicsForm from './convocationTopicsForm';

class ConvocationsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            convocations: [],
            convocationSelected: null,
            errorMessage: null,
            componentBusy: null,
            topicsBusy: null,
            editFormOpen: false,
            topicsFormOpen: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleNewButton = this.handleNewButton.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.handleTopicsButton = this.handleTopicsButton.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
        this.toggleTopicsBusy = this.toggleTopicsBusy.bind(this);
        this.toggleEditFormOpen = this.toggleEditFormOpen.bind(this);
        this.toggleTopicsFormOpen = this.toggleTopicsFormOpen.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setErrorMessage(err.message));
    }

    async componentDidMount() {
        await this.handleRefresh();
    }

    async handleRefresh() {
        this.setErrorMessage(null);
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI('convocations');

        const convocations = fetchResult && fetchResult.data ? fetchResult.data : [];
        this.setState({
            convocations: convocations,
            convocationSelected: null
        });
        this.toggleComponentBusy();
    }

    async handleRowClick(event) {
        this.setErrorMessage(null);
        this.toggleTopicsBusy();
        this.setState({ topicsBusy: true });

        const fetchResult = await this.fetchAPI('convocations', null, event.currentTarget.id);
        const convocation = fetchResult && fetchResult.data ? fetchResult.data : null;
        this.setState({
            convocationSelected: convocation,
            topicsBusy: false
        });
        this.toggleTopicsBusy();
    }

    handleNewButton(event) {
        this.setState({ convocationSelected: null });
        this.toggleEditFormOpen();
    }

    handleEditButton(event) {
        this.toggleEditFormOpen();
    }

    handleTopicsButton(event) {
        this.toggleComponentBusy();
        this.toggleTopicsFormOpen();
    }

    handleKeyDown(event) {
        const keyName = event.key;

        if (keyName === "Enter" && this.state.convocationSelected) this.handleEditButton();
        if (keyName === "Escape" && !this.state.editFormOpen && !this.state.topicsFormOpen) this.handleRefresh();
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    toggleTopicsBusy() {
        this.setState({ topicsBusy: !this.state.topicsBusy });
    }

    toggleEditFormOpen() {
        this.setState( prevState => ({ editFormOpen: !prevState.editFormOpen }));
    }

    toggleTopicsFormOpen() {
        this.setState( prevState => ({ topicsFormOpen: !prevState.topicsFormOpen }));
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <div tabIndex="0"
                onKeyDown={this.state.editFormOpen || this.state.topicsFormOpen? null : this.handleKeyDown}>
                <h4 aria-busy={this.state.componentBusy ? true : false}>
                    Convocatorias ({this.state.convocations.length})
                </h4>
                <section className={this.state.componentBusy}>
                    <div className='warning'>{this.state.errorMessage}</div>
                    <a href="#" onClick={this.handleRefresh}>🔁 Actualizar</a>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col"></th>
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
                                        title="Haga click para seleccionar"
                                        className={this.state.convocationSelected &&
                                            this.state.convocationSelected._id === convocation._id ?
                                            "selected" : null}
                                        onClick={this.handleRowClick}>
                                        <td scope="row">
                                            <input type="checkbox"
                                                readOnly
                                                checked={this.state.convocationSelected &&
                                                    this.state.convocationSelected._id === convocation._id ?
                                                    true : false}
                                            />
                                        </td>
                                        <td>{convocation.name}</td>
                                        <td>{convocation.year}</td>
                                        <td>{convocation.institution}</td>
                                        <td>{convocation.category}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <a href="#edit"
                        role="button"
                        className="secondary"
                        disabled={this.state.convocationSelected ? false : true}
                        onClick={this.handleEditButton}>
                        Editar Convocatoria
                    </a>
                    <a href="#topics"
                        role="button"
                        className="primary outline"
                        disabled={this.state.convocationSelected ? false : true}
                        onClick={this.handleTopicsButton}>
                        Editar Temario
                    </a>
                </section>
                <button
                    className="primary"
                    onClick={this.handleNewButton}>
                    Nueva Convocatoria
                </button>
                <section>
                    <h5 aria-busy={this.state.topicsBusy}>
                        Temario de la Convocatoria
                    </h5>
                    <ol>
                        {this.state.convocationSelected ?
                            this.state.convocationSelected.topicList.map((topic) => {
                                return (
                                    <li id={topic._id}
                                        key={topic._id}
                                        title={topic.fullTitle}>
                                        {topic.title}
                                    </li>
                                )
                            }) : "Seleccione una Convocatoria ⬆️"}
                    </ol>
                    <ConvocationForm apiUrl={this.state.apiUrl}
                        open={this.state.editFormOpen}
                        convocation={this.state.convocationSelected}
                        toggleModalOpen={this.toggleEditFormOpen}
                        refreshParent={this.handleRefresh}>
                    </ConvocationForm>
                    <ConvocationTopicsForm apiUrl={this.state.apiUrl}
                        open={this.state.topicsFormOpen}
                        convocation={this.state.convocationSelected}
                        toggleParentBusy={this.toggleComponentBusy}
                        toggleModalOpen={this.toggleTopicsFormOpen}
                        refreshParent={this.handleRefresh}>
                    </ConvocationTopicsForm>
                </section>
            </div>
        )
    }
}

export default ConvocationsTable;