
import React, { Component } from 'react'
import ReviewTest from './reviewTest'

const headersList = {
  Accept: '*/*',
  'Content-Type': 'application/json'
}

class TestsTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      apiUrl: props.apiUrl,
      adminMode: props.adminPage,
      tests: [],
      testSelected: null,
      errorMessage: null,
      componentBusy: null,
      busyDelete: false,
      reviewFormOpen: false,
      openConfirm: false,
      deletionConfirmed: false
    }

    this.handleRefresh = this.handleRefresh.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
    this.handleCloseConfirm = this.handleCloseConfirm.bind(this)
    this.handleDeletion = this.handleDeletion.bind(this)
    this.handleReview = this.handleReview.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.toggleComponentBusy = this.toggleComponentBusy.bind(this)
    this.toggleReviewFormOpen = this.toggleReviewFormOpen.bind(this)
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
    await this.handleRefresh()
  }

  async handleRefresh () {
    this.setErrorMessage(null)
    this.toggleComponentBusy()

    const fetchResult = await this.fetchAPI('tests')

    const tests = fetchResult && fetchResult.data ? fetchResult.data : []
    this.setState({
      tests,
      testSelected: null,
      openConfirm: false,
      deletionConfirmed: false
    })
    this.toggleComponentBusy()
  }

  handleRowClick (event) {
    this.setErrorMessage(null)

    const test = this.state.tests.find(test => test._id === event.currentTarget.id)

    this.setState({
      testSelected: test
    })
  }

  handleCloseConfirm () {
    this.setState({ openConfirm: false, deletionConfirmed: false })
  }

  async handleDeletion () {
    if (!this.state.deletionConfirmed) {
      this.setState({ openConfirm: true, deletionConfirmed: true })
      return
    }

    const options = {
      method: 'DELETE',
      headers: headersList
    }
    this.setState({ busyDelete: true })

    const result = await this.fetchAPI('tests', null, this.state.testSelected._id, null, options)

    this.setState({ busyDelete: false })

    this.handleCloseConfirm()
    if (result && result.status === 'FAILED') {
      this.setState({ errorMessage: result.data.error })
      return
    }
    this.handleRefresh()
  }

  handleReview () {
    this.toggleReviewFormOpen()
  }

  handleKeyDown (event) {
    const keyName = event.key

    if (keyName === 'Enter') {
      event.preventDefault()
      if (this.state.testSelected && this.state.adminMode) this.handleDeletion()
      if (this.state.testSelected && !this.state.adminMode) this.handleReview()
    }
    if (keyName === 'Escape' && this.state.openConfirm) this.handleCloseConfirm()
    if (keyName === 'Escape' && !this.state.openConfirm) this.handleRefresh()
  }

  toggleComponentBusy () {
    this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' })
  }

  toggleReviewFormOpen () {
    this.setState(prevState => ({ reviewFormOpen: !prevState.reviewFormOpen }))
  }

  setErrorMessage (msg) {
    this.setState({ errorMessage: msg })
  }

  render () {
    return (
      <div tabIndex='0' onKeyDown={this.handleKeyDown}>
        <h4 aria-busy={!!this.state.componentBusy}>
          Tests Realizados ({this.state.tests.length})
        </h4>
        <section className={this.state.componentBusy}>
          <div className='warning'>{this.state.errorMessage}</div>
          <a href='#' onClick={this.handleRefresh}>🔁 Actualizar</a>
          <table>
            <thead>
              <tr>
                <th scope='col' />
                <th scope='col'>Fecha de Realización</th>
                <th scope='col'>#Preguntas</th>
                <th scope='col'>Puntuación Obtenida</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tests.map((test) => {
                return (
                  <tr
                    key={test._id}
                    id={test._id}
                    title='Haga click para seleccionar'
                    className={this.state.testSelected &&
                                            this.state.testSelected._id === test._id
                      ? 'selected'
                      : null}
                    onClick={this.handleRowClick}
                  >
                    <td scope='row'>
                      <input
                        type='checkbox'
                        readOnly
                        checked={!!(this.state.testSelected &&
                                                    this.state.testSelected._id === test._id)}
                      />
                    </td>
                    <td>{test.submitted
                      ? new Intl.DateTimeFormat('es-ES', {
                        dateStyle: 'long',
                        timeStyle: 'short'
                      }).format(new Date(test.updatedAt))
                      : 'Sin completar'}
                    </td>
                    <td>{test.questionList.length}</td>
                    <td>{test.score}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <a
            href='#delete'
            role='button'
            className='primary outline'
            hidden={!this.state.adminMode}
            disabled={!this.state.testSelected}
            onClick={this.handleDeletion}
          >
            Eliminar
          </a>
          <a
            href='#review'
            role='button'
            className='secondary'
            hidden={this.state.adminMode}
            disabled={!this.state.testSelected}
            onClick={this.handleReview}
          >
            Revisar Test
          </a>
        </section>
        <dialog open={this.state.openConfirm && this.state.adminMode}>
          <article>
            <h3>Atención</h3>
            <p>
              ¿Seguro que quieres borrar el test seleccionado?
            </p>
            <footer>
              <a
                href='#cancel'
                role='button'
                className='secondary'
                onClick={this.handleCloseConfirm}
              >
                Cancelar
              </a>
              <a
                href='#confirmDeletion'
                role='button'
                aria-busy={this.state.busyDelete}
                onClick={this.handleDeletion}
              >
                Eliminar Test
              </a>
            </footer>
          </article>
        </dialog>
        <ReviewTest
          open={this.state.reviewFormOpen && !this.state.adminMode}
          test={this.state.testSelected}
          toggleModalOpen={this.toggleReviewFormOpen}
        />
      </div>
    )
  }
}

export default TestsTable
