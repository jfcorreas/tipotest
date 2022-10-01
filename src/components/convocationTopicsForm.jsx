import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

class ConvocationTopicsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            convocation: props.convocation,
            selectableTopics: [],
            selectedTopic: null,
            selectedTopicIndex: null,
            topicToAdd: null,
            errorMessage: null,
            open: false,
            busySubmit: false,
            invalidForm: true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleDeleteTopic = this.handleDeleteTopic.bind(this);
        this.handleNewTopicChange = this.handleNewTopicChange.bind(this);
        this.handleNewTopicSubmit = this.handleNewTopicSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setState({ errorMessage: err.message }))
    }

    async componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open &&
            this.props.open === true &&
            this.props.convocation) {
            const fetchResult = await this.fetchAPI('topics');
            const allTopics = fetchResult && fetchResult.data ? fetchResult.data : [];
            const selectableTopics = allTopics.filter((topic) =>
                !this.props.convocation.topicList.find(topicFind => topicFind._id === topic._id));

            this.props.toggleParentBusy();
            this.setState({
                convocation: structuredClone(this.props.convocation),
                selectableTopics: selectableTopics,
                open: true,
                errorMessage: false
            });
        }
    }

    handleClose(event, isSubmit) {
        this.setState({
            convocation: null,
            selectableTopics: [],
            selectedTopic: null,
            selectedTopicIndex: null,
            topicToAdd: null,
            errorMessage: null,
            open: false,
            busySubmit: false,
            invalidForm: true
        });
        if (isSubmit) this.props.refreshParent();
    }

    handleRowClick(event) {
        const target = event.currentTarget;
        const topicId = target.id;
        const topicIndex = target.tabIndex;

        const selectedTopic = this.state.convocation.topicList.filter(topic => topic._id === topicId)[0];

        this.setState({
            selectedTopic: selectedTopic,
            selectedTopicIndex: topicIndex

        });
    }

    handleDeleteTopic(event) {
        const index = this.state.convocation.topicList.findIndex(topic => topic._id === this.state.selectedTopic._id);

        const topicToDelete = this.state.convocation.topicList.splice(index, 1)[0];
        this.state.selectableTopics.push(topicToDelete);

        this.setState({
            selectedTopic: null,
            invalidForm: false
        });
    }

    handleNewTopicChange(event) {
        const target = event.target;
        const newTopicId = target.value;

        this.setState({
            topicToAdd: newTopicId
        });
    }

    handleNewTopicSubmit(event) {

        const index = this.state.selectableTopics.findIndex(topic => topic._id === this.state.topicToAdd);
        const topicToAdd = this.state.selectableTopics.splice(index, 1)[0];
        this.state.convocation.topicList.push(topicToAdd);
        this.setState({
            topicToAdd: null,
            invalidForm: false
        });
    }

    async handleSubmit() {
        let options = {
            method: 'PATCH',
            headers: headersList,
            body: JSON.stringify(this.state.convocation)
        };

        let result;
        this.setState({ busySubmit: true });
        result = await this.fetchAPI('convocations', 'topics', this.state.convocation._id, null, options);
        this.setState({ busySubmit: false });

        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }
        this.props.refreshParent();
        this.handleClose();
    }

    render() {
        return (
            <div>
                <dialog open={this.state.open}>

                    <article>
                        <a href="#close"
                            aria-label="Close"
                            className="close"
                            onClick={this.handleClose}>
                        </a>
                        <h3>Temas de la Convocatoria</h3>
                        <span className='warning'>{this.state.errorMessage}</span>
                        <div className='grid'>
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">#</th>
                                        <th scope="col">Título</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.convocation &&
                                        this.state.convocation.topicList.map((topic, index) => {
                                            return (
                                                <tr key={topic._id}
                                                    id={topic._id}
                                                    tabIndex={index}
                                                    title="Haga click para seleccionar"
                                                    className={this.state.selectedTopic &&
                                                        this.state.selectedTopic._id === topic._id ?
                                                        "selected" : null}
                                                    onClick={this.handleRowClick}>
                                                    <td scope="row">
                                                        <input type="checkbox"
                                                            readOnly
                                                            checked={this.state.selectedTopic &&
                                                                this.state.selectedTopic._id === topic._id ?
                                                                true : false}
                                                        />
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{topic.title}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                            <a href="#deleteTopic"
                                    role="button"
                                    className="contrast"
                                    disabled={!this.state.selectedTopic}
                                    onClick={this.handleDeleteTopic}>
                                    Eliminar Tema
                                </a>
                        </div>
                        <footer>
                            <div className='grid'>
                                <label htmlFor="availableTopics">
                                    Temas disponibles
                                    <select name="availableTopics" type="text"
                                        placeholder="Todos los Temas disponibles"
                                        aria-disabled={this.state.selectableTopics.length === 0}
                                        onChange={this.handleNewTopicChange}
                                        value={this.state.topicToAdd ? this.state.topicToAdd : ""}>
                                        {this.state.selectableTopics.length > 0 ?
                                            <option value="">Seleccione un Tema para añadir...</option> :
                                            <option value="">No quedan Temas para añadir</option>
                                        }
                                        {this.state.selectableTopics ? this.state.selectableTopics.map((topic) => {
                                            return (
                                                <option key={topic._id} value={topic._id}>{topic.title}</option>
                                            )
                                        }) : null}
                                    </select>
                                    <a href="#newTopic"
                                        role="button"
                                        className="contrast outline"
                                        disabled={!this.state.topicToAdd}
                                        onClick={this.handleNewTopicSubmit}>
                                        Añadir Tema
                                    </a>
                                </label>
                            </div>
                            <section>
                                <a href="#cancel"
                                    role="button"
                                    className="secondary"
                                    onClick={this.handleClose}>
                                    Cancelar
                                </a>

                                <a href="#confirm"
                                    role="button"
                                    aria-busy={this.state.busySubmit}
                                    disabled={this.state.invalidForm}
                                    onClick={this.handleSubmit}>
                                    Guardar Cambios
                                </a>
                            </section>

                        </footer>
                    </article>

                </dialog>
            </div>
        )
    }
}

export default ConvocationTopicsForm;
