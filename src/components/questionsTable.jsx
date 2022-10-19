
import React, { Component } from 'react';
import QuestionForm from './questionForm';
import QuestionAnswersForm from './questionAnswersForm';

class QuestionsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            questions: [],
            questionSelected: null,
            topics: null,
            topicFilter: null,
            errorMessage: null,
            componentBusy: null,
            moreInfoBusy: null,
            topicFilterBusy: null,
            formOpen: false,
            answersFormOpen: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleCleanFilter = this.handleCleanFilter.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleFilterByTopic = this.handleFilterByTopic.bind(this);
        this.handleNewButton = this.handleNewButton.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.handleAnswersButton = this.handleAnswersButton.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
        this.toggleMoreInfoBusy = this.toggleMoreInfoBusy.bind(this);
        this.toggleTopicFilterBusy = this.toggleTopicFilterBusy.bind(this);
        this.toggleFormOpen = this.toggleFormOpen.bind(this);
        this.toggleAnswersFormOpen = this.toggleAnswersFormOpen.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (filterParams) {
            requestUrl = requestUrl + '?' +
                new URLSearchParams(filterParams).toString()
        }

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

        let fetchResult = await this.fetchAPI('questions',
            null,
            null,
            this.state.topicFilter ? { topic: this.state.topicFilter } : null,
            null);

        const questions = fetchResult && fetchResult.data ? fetchResult.data : [];

        fetchResult = await this.fetchAPI('topics');

        const topics = fetchResult && fetchResult.data ? fetchResult.data : [];

        this.setState({
            questions: questions,
            topics: topics,
            questionSelected: null
        });
        this.toggleComponentBusy();
    }

    handleCleanFilter(event) {
        this.setState({ topicFilter: null });
        setTimeout(() => this.handleRefresh(), 100);
    }

    async handleRowClick(event) {
        this.setErrorMessage(null);
        this.toggleMoreInfoBusy();

        const fetchResult = await this.fetchAPI('questions', null, event.currentTarget.id);
        const question = fetchResult && fetchResult.data ? fetchResult.data : null;

        this.setState({ questionSelected: question });
        this.toggleMoreInfoBusy();
    }

    async handleFilterByTopic(event) {
        const target = event.target;
        const topicId = target.value;

        this.setErrorMessage(null);
        this.toggleTopicFilterBusy();

        const fetchResult = await this.fetchAPI('questions', null, null, { topic: topicId }, null);

        const questions = fetchResult && fetchResult.data ? fetchResult.data : [];

        this.setState({
            questions: questions,
            questionSelected: null,
            topicFilter: topicId
        });

        this.toggleTopicFilterBusy();
    }

    handleNewButton(event) {
        this.setState({ questionSelected: null });
        this.toggleFormOpen();
    }

    handleEditButton(event) {
        this.toggleFormOpen();
    }

    handleAnswersButton(event) {
        this.toggleAnswersFormOpen();
    }

    handleKeyDown(event) {
        const keyName = event.key;

        if (keyName === "Enter" && this.state.questionSelected) this.handleEditButton();
        if (keyName === "Escape" && !this.state.formOpen && !this.state.answersFormOpen) this.handleRefresh();
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    toggleMoreInfoBusy() {
        this.setState(prevState => ({ moreInfoBusy: !prevState.moreInfoBusy }));
    }

    toggleTopicFilterBusy() {
        this.setState(prevState => ({ topicFilterBusy: !prevState.topicFilterBusy }));
    }

    toggleFormOpen() {
        this.setState(prevState => ({ formOpen: !prevState.formOpen }));
    }

    toggleAnswersFormOpen() {
        this.setState(prevState => ({ answersFormOpen: !prevState.answersFormOpen }));
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <div tabIndex="0"
                onKeyDown={this.state.formOpen || this.state.answersFormOpen ? null : this.handleKeyDown}>
                <h4 aria-busy={this.state.componentBusy ? true : false}>
                    Preguntas ({this.state.questions.length})
                </h4>
                <label>
                    Tema
                    <select name="topic" type="text"
                        placeholder="Filtrar por Tema"
                        onChange={this.handleFilterByTopic}
                        value={this.state.topicFilter ? this.state.topicFilter : ""}>
                        {this.state.topicFilter ? null :
                            <option value="">Filtrar por Tema...</option>
                        }
                        {this.state.topics ? this.state.topics.map((topic) => {
                            return (
                                <option key={topic._id} value={topic._id}>({topic.shorthand}) {topic.title}</option>
                            )
                        }) : null}
                    </select>
                </label>
                <section className={this.state.componentBusy}>
                    <div className='warning'>{this.state.errorMessage}</div>
                    <a href="#refresh" onClick={this.handleRefresh}>🔁 Actualizar</a>&nbsp;
                    <a href="#cleanFilter" onClick={this.handleCleanFilter}>🆑 Limpiar filtro</a>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Texto</th>
                                <th scope="col">#Respuestas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.questions.map((question) => {
                                return (
                                    <tr key={question._id}
                                        id={question._id}
                                        title="Haga click para seleccionar"
                                        className={this.state.questionSelected &&
                                            this.state.questionSelected._id === question._id ?
                                            "selected" : null}
                                        onClick={this.handleRowClick}>
                                        <th scope="row">
                                            <input type="checkbox"
                                                readOnly
                                                checked={this.state.questionSelected &&
                                                    this.state.questionSelected._id === question._id ?
                                                    true : false}
                                            />
                                        </th>
                                        <td>{question.text}</td>
                                        <td>
                                            <a href='#answersSection'>
                                                {question.answers.length} ({
                                                    question.answers.filter((answer) => answer.isCorrect).length > 0 ?
                                                        <ins> {question.answers.filter((answer) => answer.isCorrect).length} </ins> :
                                                        <span className='warning'>Ninguna Correcta</span>
                                                })
                                            </a>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <a href="#editQuestion"
                        role="button"
                        className="secondary"
                        disabled={this.state.questionSelected ? false : true}
                        onClick={this.handleEditButton}>
                        Editar Pregunta
                    </a>
                    <a href="#editAnswers"
                        role="button"
                        className="primary outline"
                        disabled={this.state.questionSelected ? false : true}
                        onClick={this.handleAnswersButton}>
                        Editar Respuestas
                    </a>
                </section>
                <button
                    className="primary"
                    onClick={this.handleNewButton}>
                    Nueva Pregunta
                </button>
                <section id="answersSection" className='grid'>
                    <div>

                        <h5 aria-busy={this.state.moreInfoBusy}>
                            Tema
                        </h5>
                        {this.state.questionSelected ?
                            <p>{this.state.questionSelected.topic.title}</p>
                            : "Seleccione una Pregunta ⬆️"}
                    </div>
                    <div>

                        <h5>Respuestas</h5>
                        <ul>
                            {this.state.questionSelected ?
                                this.state.questionSelected.answers.map((answer) => {
                                    return (
                                        <li id={answer._id}
                                            key={answer._id}
                                            className={answer.isCorrect ? 'trueQuestion' : null}>
                                            {answer.text}
                                        </li>
                                    )
                                }) : null}
                        </ul>
                    </div>
                </section>
                <QuestionForm apiUrl={this.state.apiUrl}
                    open={this.state.formOpen}
                    question={this.state.questionSelected}
                    topics={this.state.topics}
                    topicFilter={this.state.topicFilter}
                    toggleModalOpen={this.toggleFormOpen}
                    refreshParent={this.handleRefresh}>
                </QuestionForm>
                <QuestionAnswersForm apiUrl={this.state.apiUrl}
                    open={this.state.answersFormOpen}
                    question={this.state.questionSelected}
                    toggleModalOpen={this.toggleAnswersFormOpen}
                    refreshParent={this.handleRefresh}>
                </QuestionAnswersForm>

            </div>
        )
    }
}

export default QuestionsTable;