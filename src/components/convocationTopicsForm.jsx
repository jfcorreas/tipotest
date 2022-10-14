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
            selectedTopicIndex: -1,
            topicToAdd: null,
            newTopicPosition: -1,
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
        this.handleNewPositionChange = this.handleNewPositionChange.bind(this);
        this.handleNewPositionSubmit = this.handleNewPositionSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
            selectedTopicIndex: -1,
            topicToAdd: null,
            newTopicPosition: -1,
            errorMessage: null,
            open: false,
            busySubmit: false,
            invalidForm: true
        });
        if (isSubmit) this.props.refreshParent();
        this.props.toggleModalOpen();
    }

    handleRowClick(event) {
        const target = event.currentTarget;
        const topicId = target.id;
        const topicIndex = target.tabIndex;

        const selectedTopic = this.state.convocation.topicList.filter(topic => topic._id === topicId)[0];

        this.setState({
            selectedTopic: selectedTopic,
            selectedTopicIndex: topicIndex,
            newTopicPosition: topicIndex,
        });
    }

    handleDeleteTopic(event) {
        const topicToDelete = this.state.convocation.topicList.splice(this.state.selectedTopicIndex, 1)[0];
        this.state.selectableTopics.push(topicToDelete);

        this.setState({
            selectedTopic: null,
            selectedTopicIndex: -1,
            newTopicPosition: -1,
            invalidForm: false
        });
    }

    handleNewPositionChange(event) {
        const target = event.target;
        const newPosition = target.value;

        if (newPosition > 0) this.setState({ newTopicPosition: Number(newPosition - 1) });
    }

    handleNewPositionSubmit(event) {
        const topicToMove = this.state.convocation.topicList.splice(this.state.selectedTopicIndex, 1)[0];
        this.state.convocation.topicList.splice(this.state.newTopicPosition, 0, topicToMove);

        this.setState({
            selectedTopic: null,
            selectedTopicIndex: -1,
            newTopicPosition: -1,
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
        this.handleClose(null, true);
    }

    handleKeyDown(event) {
        const keyName = event.key;

        if (keyName === "Enter") {
            if (this.state.topicToAdd) this.handleNewTopicSubmit();
            if (this.state.selectedTopic &&
                this.state.newTopicPosition !== this.state.selectedTopicIndex) this.handleNewPositionSubmit();
        } 
        if (keyName === "Escape" ) this.handleClose();

    }    

    render() {
        return (
            <div tabIndex="0"
                onKeyDown={this.state.open?  this.handleKeyDown : null}>
                <dialog open={this.state.open}>

                    <article>
                        <a href="#close"
                            aria-label="Close"
                            className="close"
                            onClick={this.handleClose}>
                        </a>
                        <h3>Temas de la Convocatoria</h3>
                        <span className='warning'>{this.state.errorMessage}</span>
                        <div>
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
                            <button
                                className="contrast"
                                disabled={!this.state.selectedTopic}
                                onClick={this.handleDeleteTopic}>
                                Eliminar Tema
                            </button>
                            <label>
                                Cambiar posición del Tema seleccionado:
                                <input name="topicOrder" type="number"
                                    min="1"
                                    placeholder="Ningún tema seleccionado"
                                    aria-disabled={!(this.state.selectedTopicIndex > -1)}
                                    readOnly={!(this.state.selectedTopicIndex > -1)}
                                    onChange={this.handleNewPositionChange}
                                    value={this.state.newTopicPosition > -1 ? this.state.newTopicPosition + 1 : ""} />
                                <button
                                    role="button"
                                    className="contrast outline"
                                    disabled={this.state.newTopicPosition === this.state.selectedTopicIndex}
                                    onClick={this.handleNewPositionSubmit}>
                                    Confirmar nueva posición
                                </button>
                            </label>
                        </div>
                        <footer>
                            <section>
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
                                    <button
                                        className="contrast outline"
                                        disabled={!this.state.topicToAdd}
                                        onClick={this.handleNewTopicSubmit}>
                                        Añadir Tema
                                    </button>
                                </label>
                            </section>
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
