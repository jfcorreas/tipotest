
import React, { Component } from 'react'

const headersList = {
  Accept: '*/*',
  'Content-Type': 'application/json'
}

class doTest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      apiUrl: props.apiUrl,
      convocations: [],
      convocationSelected: null,
      currentTest: null,
      correctAnswers: [],
      checkedAnswers: [],
      showResults: false,
      errorMessage: null,
      componentBusy: null
    }

    this.handleSelectConvocation = this.handleSelectConvocation.bind(this)
    this.handleStartTest = this.handleStartTest.bind(this)
    this.handleCheckAnswer = this.handleCheckAnswer.bind(this)
    this.handleCleanAnswer = this.handleCleanAnswer.bind(this)
    this.handleSubmitTest = this.handleSubmitTest.bind(this)
    this.toggleShowResults = this.toggleShowResults.bind(this)
    this.toggleComponentBusy = this.toggleComponentBusy.bind(this)
  }

  async fetchAPI (path, subpath, objectId, filterParams, options) {
    let requestUrl = `${this.state.apiUrl}/${path}`
    if (objectId) requestUrl = requestUrl + '/' + objectId
    if (subpath) requestUrl = requestUrl + '/' + subpath
    if (filterParams) requestUrl = requestUrl + '?' + filterParams

    return fetch(requestUrl, options)
      .then(res => res.json())
      .catch(err => this.setErrorMessage(err.message))
  }

  async componentDidMount () {
    this.setErrorMessage(null)
    this.toggleComponentBusy()

    const fetchResult = await this.fetchAPI('convocations', null, null, null, undefined)

    const convocations = fetchResult && fetchResult.data ? fetchResult.data : []
    this.setState({
      convocations: structuredClone(convocations),
      convocationSelected: null
    })
    this.toggleComponentBusy()
  }

  handleSelectConvocation (event) {
    const target = event.target
    const value = target.value

    const convocationSelected = this.state.convocations.find(convocation => convocation._id === value)

    this.setState({ convocationSelected })
  }

  // FIXME: fix error "test validation failed: questionList.1.answers: Parameter \"obj\" to Document() must be an object, got false"
  async handleStartTest (event) {
    this.setErrorMessage(null)
    const options = {
      method: 'POST',
      headers: headersList,
      body: JSON.stringify({ convocationId: this.state.convocationSelected._id })
    }
    this.toggleComponentBusy()

    const [status, data] = await this.fetchAPI('tests', null, null, null, options)

    if (status === 'FAILED') {
      this.setErrorMessage(data.error)
    } else {
      const newTest = data

      const correctAnswers = newTest.questionList.map(question => {
        return question.answers.findIndex(answer => answer.isCorrect)
      })

      this.setState({
        currentTest: newTest,
        convocationSelected: null,
        convocations: [],
        correctAnswers: new Array(correctAnswers),
        checkedAnswers: new Array(newTest.questionList.length)
      })
    }

    this.toggleComponentBusy()
  }

  handleCheckAnswer (event) {
    const target = event.target
    const questionId = target.name
    const answerId = target.id

    const questionIndex =
            this.state.currentTest.questionList.findIndex(question =>
              question._id === questionId
            )

    const answerIndex =
            this.state.currentTest.questionList[questionIndex].answers.findIndex(answer =>
              answer._id === answerId
            )

    const newCheckedAnswers = this.state.checkedAnswers
    newCheckedAnswers[questionIndex] = Number(answerIndex)

    this.setState({ checkedAnswers: newCheckedAnswers })
  }

  handleCleanAnswer (event) {
    event.preventDefault()
    const target = event.target
    const questionIndex = target.target

    const newCheckedAnswers = this.state.checkedAnswers
    newCheckedAnswers[questionIndex] = undefined

    this.setState({ checkedAnswers: newCheckedAnswers })
  }

  async handleSubmitTest (event) {
    this.setErrorMessage(null)
    const options = {
      method: 'PATCH',
      headers: headersList,
      body: JSON.stringify({ testResponses: this.state.checkedAnswers })
    }
    this.toggleComponentBusy()
    const fetchResult = await this.fetchAPI('tests', null, this.state.currentTest._id, null, options)
    this.toggleComponentBusy()

    if (fetchResult.status === 'FAILED') {
      this.setErrorMessage(fetchResult.data.error)
      return
    }

    const finishedTest = fetchResult && fetchResult.data ? fetchResult.data : null
    this.setState({
      currentTest: finishedTest
    })
  }

  toggleShowResults () {
    this.setState((prevState) => ({ showResults: !prevState.showResults }))
  }

  toggleComponentBusy () {
    this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' })
  }

  setErrorMessage (msg) {
    this.setState({ errorMessage: msg })
  }

  render () {
    return (
      <div>
        <section className={this.state.componentBusy}>
          <select
            required
            disabled={this.state.convocations.length === 0}
            onChange={this.handleSelectConvocation}
          >
            <option>Seleccione una convocatoria...</option>
            {this.state.convocations.map((convocation) => {
              return (
                <option
                  key={convocation._id}
                  value={convocation._id}
                >
                  {convocation.fullName}
                </option>
              )
            })}
          </select>
          <div className='warning'>{this.state.errorMessage}</div>
          <button
            className='primary'
            disabled={!this.state.convocationSelected}
            aria-disabled={!this.state.convocationSelected}
            aria-busy={!!this.state.componentBusy}
            onClick={this.handleStartTest}
          >
            Comenzar Test
          </button>
        </section>
        <section hidden={!this.state.currentTest}>
          <hgroup>
            <h2 aria-busy={!!this.state.componentBusy}>Test</h2>
            <h4>
              {this.state.currentTest
                ? (
                  <p>{new Intl.DateTimeFormat('es-ES', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                  }).format(new Date(this.state.currentTest.createdAt))}&nbsp;
                    - {this.state.currentTest.questionList.length} preguntas
                  </p>
                  )
                : null}
              {this.state.currentTest && this.state.currentTest.scoringFormula === 'H-(F/4)'
                ? (
                  <ul>
                    <li>Cada acierto suma 1 punto.</li>
                    <li>Cada fallo penaliza 0,25 puntos.</li>
                    <li>Las preguntas no contestadas no se computan.</li>
                  </ul>
                  )
                : null}
            </h4>
          </hgroup>
          <form>
            {this.state.currentTest
              ? this.state.currentTest.questionList.map((question, questionIndex) => {
                return (
                  <article key={question._id} id={question._id}>
                    <fieldset>
                      <legend><strong>{questionIndex + 1}. {question.text}:</strong></legend><br />
                      {question.answers.map((answer, answerIndex) => {
                        return (
                          <label htmlFor={answer._id} key={answer._id}>
                            <input
                              type='radio'
                              id={answer._id}
                              name={question._id}
                              value={answer.text}
                              checked={this.state.checkedAnswers[questionIndex] === Number(answerIndex)}
                              onChange={this.handleCheckAnswer}
                            />
                            {this.state.showResults
                              ? this.state.correctAnswers[questionIndex] === Number(answerIndex)
                                ? <ins>{answer.text}</ins>
                                : this.state.checkedAnswers[questionIndex] === Number(answerIndex)
                                  ? <del>{answer.text}</del>
                                  : answer.text
                              : answer.text}
                          </label>
                        )
                      })}

                    </fieldset>
                    <footer>
                      <a
                        href='#'
                        target={questionIndex}
                        onClick={this.handleCleanAnswer}
                      >
                        Limpiar Respuesta
                      </a>
                    </footer>
                  </article>
                )
              })
              : null}
          </form>
        </section>
        <button
          className='contrast'
          disabled={!this.state.currentTest}
          aria-disabled={!this.state.currentTest}
          aria-busy={!!this.state.componentBusy}
          hidden={!this.state.currentTest}
          onClick={this.handleSubmitTest}
        >
          {this.state.currentTest && this.state.currentTest.score < 0
            ? 'Terminar Test'
            : 'Volver a enviar Test'}
        </button>

        <div className='warning'>{this.state.errorMessage}</div>
        <article hidden={!this.state.currentTest || this.state.currentTest.score === -1}>
          Puntuación Obtenida: &nbsp;
          <strong>{this.state.currentTest ? this.state.currentTest.score : ''}</strong>&nbsp;
          sobre {this.state.currentTest ? this.state.currentTest.questionList.length : ''}
          <label>
            <input
              type='checkbox'
              hidden={this.state.currentTest && this.state.currentTest.score < 0}
              onChange={() => { this.toggleShowResults() }}
            />
            Mostrar Respuestas
          </label>
          <a href='/test' role='button' className='secondary'>Terminar y empezar un nuevo Test</a>
        </article>
      </div>
    )
  }
}

export default doTest
