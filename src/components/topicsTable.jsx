
import React, { Component } from 'react';
import TopicForm from './topicForm';

class TopicsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            topics: [],
            topicSelected: null,
            errorMessage: null,
            componentBusy: null,
            moreInfoBusy: null,
            formOpen: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleNewButton = this.handleNewButton.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.toggleFormOpen = this.toggleFormOpen.bind(this);
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
        this.toggleMoreInfoBusy = this.toggleMoreInfoBusy.bind(this);
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

        const fetchResult = await this.fetchAPI('topics');

        const topics = fetchResult && fetchResult.data ? fetchResult.data : [];
        this.setState({
            topics: topics,
            topicSelected: null
        });
        this.toggleComponentBusy();
    }

    async handleRowClick(event) {
        this.setErrorMessage(null);
        this.toggleMoreInfoBusy();
        this.setState({ moreInfoBusy: true });

        const fetchResult = await this.fetchAPI('topics', null, event.currentTarget.id);
        const topic = fetchResult && fetchResult.data ? fetchResult.data : null;
        this.setState({
            topicSelected: topic,
            moreInfoBusy: false
        });
        this.toggleMoreInfoBusy();
    }

    handleNewButton(event) {
        this.setState({ topicSelected: null });
        this.toggleFormOpen();
    }

    handleEditButton(event) {
        this.toggleFormOpen();
    }

    handleKeyDown(event) {
        const keyName = event.key;

        if (this.state.topicSelected && keyName === "Enter") this.handleEditButton();
        if (keyName === "Escape") this.handleRefresh();
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    toggleMoreInfoBusy() {
        this.setState({ moreInfoBusy: !this.state.moreInfoBusy });
    }

    toggleFormOpen() {
        this.setState( prevState => ({ formOpen: !prevState.formOpen }));
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <div tabIndex="0" onKeyDown={this.state.formOpen? null : this.handleKeyDown}>
                <h4 aria-busy={this.state.componentBusy ? true : false}>
                    Temas ({this.state.topics.length})
                </h4>
                <section className={this.state.componentBusy}>
                    <div className='warning'>{this.state.errorMessage}</div>
                    <a href="#" onClick={this.handleRefresh}>🔁 Actualizar</a>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Abreviatura</th>
                                <th scope="col">Título</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.topics.map((topic) => {
                                return (
                                    <tr key={topic._id}
                                        id={topic._id}
                                        title="Haga click para seleccionar"
                                        className={this.state.topicSelected &&
                                            this.state.topicSelected._id === topic._id ?
                                            "selected" : null}
                                        onClick={this.handleRowClick}>
                                        <th scope="row">
                                            <input type="checkbox"
                                                readOnly
                                                checked={this.state.topicSelected &&
                                                    this.state.topicSelected._id === topic._id ?
                                                    true : false}
                                            />
                                        </th>
                                        <td>{topic.shorthand}</td>
                                        <td>{topic.title}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <a href="#"
                        role="button"
                        className="primary outline"
                        disabled={this.state.topicSelected ? false : true}
                        onClick={this.handleEditButton}>
                        Editar Tema
                    </a>
                </section>
                    <button
                        className="primary"
                        onClick={this.handleNewButton}>
                        Nuevo Tema
                    </button>
                <section>
                    <h5 aria-busy={this.state.moreInfoBusy}>
                        Título Completo
                    </h5>
                    {this.state.topicSelected ? <p className="texto">{this.state.topicSelected.fullTitle}</p> : "Seleccione un Tema ⬆️"}
                    <TopicForm apiUrl={this.state.apiUrl}
                        open={this.state.formOpen}
                        topic={this.state.topicSelected}
                        toggleModalOpen={this.toggleFormOpen}
                        refreshParent={this.handleRefresh}>
                    </TopicForm>
                </section>
            </div>
        )
    }
}

export default TopicsTable;