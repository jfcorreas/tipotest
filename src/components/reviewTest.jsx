
import React, { Component } from 'react'

class reviewTest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTest: null,
      correctAnswers: [],
      open: false
    }

    this.handleClose = this.handleClose.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (this.props.open !== prevProps.open &&
            this.props.open === true &&
            this.props.test) {
      const correctAnswers = this.props.test.questionList.map(question => {
        return question.answers.findIndex(answer => answer.isCorrect)
      })

      this.setState({
        currentTest: this.props.test,
        correctAnswers,
        open: true,
        errorMessage: false
      })
    }
  }

  handleClose () {
    this.setState({ open: false, currentTest: null, correctAnswers: [] })
    this.props.toggleModalOpen()
  }

  handleKeyDown (event) {
    const keyName = event.key

    if (keyName === 'Escape' && this.state.open) this.handleClose()
  }

  render () {
    return (
      <div
        tabIndex='0'
        onKeyDown={this.state.open ? this.handleKeyDown : null}
      >
        <dialog open={this.state.open}>

          <article>
            <a
              href='#close'
              aria-label='Close'
              className='close'
              onClick={this.handleClose}
            />
            <hgroup>
              <h2>Test</h2>
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

              </h4>
              <article hidden={!this.state.currentTest || this.state.currentTest.score === -1}>
                {this.state.currentTest && this.state.currentTest.scoringFormula === 'H-(F/4)'
                  ? (
                    <ul>
                      <li>Cada acierto suma 1 punto.</li>
                      <li>Cada fallo penaliza 0,25 puntos.</li>
                      <li>Las preguntas no contestadas no se computan.</li>
                    </ul>
                    )
                  : null}
                Puntuación Obtenida: &nbsp;
                <strong>{this.state.currentTest ? this.state.currentTest.score : ''}</strong>&nbsp;
                sobre {this.state.currentTest ? this.state.currentTest.questionList.length : ''}
              </article>
            </hgroup>
            <section>
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
                                type='radio' disabled
                                id={answer._id}
                                name={question._id}
                                value={answer.text}
                                defaultChecked={this.state.currentTest.responses[questionIndex] === Number(answerIndex)}
                                onChange={this.handleCheckAnswer}
                              />
                              {this.state.correctAnswers[questionIndex] === Number(answerIndex)
                                ? <ins>{answer.text}</ins>
                                : this.state.currentTest.responses[questionIndex] === Number(answerIndex)
                                  ? <del>{answer.text}</del>
                                  : answer.text}
                            </label>
                          )
                        })}

                      </fieldset>
                    </article>
                  )
                })
                : null}
            </section>
            <footer>
              <button
                className='secondary'
                onClick={this.handleClose}
              >
                Cerrar
              </button>
            </footer>
          </article>
        </dialog>
      </div>
    )
  }
}

export default reviewTest
