
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
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
        this.toggleMoreInfoBusy = this.toggleMoreInfoBusy.bind(this);
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
        this.setState({
            formOpen: true,
            topicSelected: null
        });
        setTimeout(() => { this.setState({ formOpen: false }) }, 100);
    }

    handleEditButton(event) {
        this.setState({ formOpen: true });
        setTimeout(() => { this.setState({ formOpen: false }) }, 100);
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    toggleMoreInfoBusy() {
        this.setState({ moreInfoBusy: !this.state.moreInfoBusy });
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <div>
                <h4 aria-busy={this.state.componentBusy ? true : false}>
                    Temas
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
                        className="primary"
                        onClick={this.handleNewButton}>
                        Nuevo Tema
                    </a>
                    <a href="#"
                        role="button"
                        className="primary outline"
                        disabled={this.state.topicSelected ? false : true}
                        onClick={this.handleEditButton}>
                        Editar Tema
                    </a>
                    <h5 aria-busy={this.state.moreInfoBusy}>
                        Título Completo
                    </h5>
                    {this.state.topicSelected ? <p className="texto">{this.state.topicSelected.fullTitle}</p> : "Seleccione un Tema ⬆️"}
                    <TopicForm apiUrl={this.state.apiUrl}
                        open={this.state.formOpen}
                        topic={this.state.topicSelected}
                        refreshParent={this.handleRefresh}>
                    </TopicForm>
                </section>
            </div>
        )
    }
}

export default TopicsTable;