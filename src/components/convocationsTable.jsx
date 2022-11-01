
import React, { Component } from 'react'
import ConvocationForm from './convocationForm'
import ConvocationTopicsForm from './convocationTopicsForm'
import { FullButton } from './FullButton'
import { ShortButton } from './ShortButton'

class ConvocationsTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      apiUrl: props.apiUrl,
      convocations: [],
      convocationSelected: null,
      errorMessage: null,
      componentBusy: null,
      topicsBusy: null,
      editFormOpen: false,
      topicsFormOpen: false
    }

    this.doRefresh = this.doRefresh.bind(this)
    this.handleRowClick = this.handleRowClick.bind(this)
    this.handleNewButton = this.handleNewButton.bind(this)
    this.handleEditButton = this.handleEditButton.bind(this)
    this.handleTopicsButton = this.handleTopicsButton.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.toggleComponentBusy = this.toggleComponentBusy.bind(this)
    this.toggleTopicsBusy = this.toggleTopicsBusy.bind(this)
    this.toggleEditFormOpen = this.toggleEditFormOpen.bind(this)
    this.toggleTopicsFormOpen = this.toggleTopicsFormOpen.bind(this)
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
    await this.doRefresh()
  }

  async doRefresh () {
    this.setErrorMessage(null)
    this.toggleComponentBusy()

    const fetchResult = await this.fetchAPI('convocations')

    const convocations = fetchResult && fetchResult.data ? fetchResult.data : []
    this.setState({
      convocations,
      convocationSelected: null
    })
    this.toggleComponentBusy()
  }

  async handleRowClick (event) {
    this.setErrorMessage(null)
    this.toggleTopicsBusy()
    this.setState({ topicsBusy: true })

    const fetchResult = await this.fetchAPI('convocations', null, event.currentTarget.id)
    const convocation = fetchResult && fetchResult.data ? fetchResult.data : null
    this.setState({
      convocationSelected: convocation,
      topicsBusy: false
    })
    this.toggleTopicsBusy()
  }

  handleNewButton (event) {
    this.setState({ convocationSelected: null })
    this.toggleEditFormOpen()
  }

  handleEditButton (event) {
    this.toggleEditFormOpen()
  }

  handleTopicsButton (event) {
    this.toggleComponentBusy()
    this.toggleTopicsFormOpen()
  }

  handleKeyDown (event) {
    const keyName = event.key

    if (keyName === 'Enter' && this.state.convocationSelected) this.handleEditButton()
    if (keyName === 'Escape' && !this.state.editFormOpen && !this.state.topicsFormOpen) this.doRefresh()
  }

  toggleComponentBusy () {
    this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' })
  }

  toggleTopicsBusy () {
    this.setState({ topicsBusy: !this.state.topicsBusy })
  }

  toggleEditFormOpen () {
    this.setState(prevState => ({ editFormOpen: !prevState.editFormOpen }))
  }

  toggleTopicsFormOpen () {
    this.setState(prevState => ({ topicsFormOpen: !prevState.topicsFormOpen }))
  }

  setErrorMessage (msg) {
    this.setState({ errorMessage: msg })
  }

  render () {
    return (
      <div
        tabIndex='0'
        onKeyDown={this.state.editFormOpen || this.state.topicsFormOpen ? null : this.handleKeyDown}
      >
        <h4 aria-busy={!!this.state.componentBusy}>
          Convocatorias ({this.state.convocations.length})
        </h4>
        <section className={this.state.componentBusy}>
          <div className='warning'>{this.state.errorMessage}</div>
          <a href='#' onClick={() => { this.doRefresh() }}>🔁 Actualizar</a>
          <table>
            <thead>
              <tr>
                <th scope='col' />
                <th scope='col'>Nombre</th>
                <th scope='col'>Año</th>
                <th scope='col'>Administración</th>
                <th scope='col'>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {this.state.convocations.map((convocation) => {
                return (
                  <tr
                    key={convocation._id}
                    id={convocation._id}
                    title='Haga click para seleccionar'
                    className={this.state.convocationSelected &&
                                            this.state.convocationSelected._id === convocation._id
                      ? 'selected'
                      : null}
                    onClick={this.handleRowClick}
                  >
                    <td scope='row'>
                      <input
                        type='checkbox'
                        readOnly
                        checked={!!(this.state.convocationSelected &&
                                                    this.state.convocationSelected._id === convocation._id)}
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
          <ShortButton
            href='#edit'
            buttonText='Editar Convocatoria'
            appearance='secondary'
            disabled={!this.state.convocationSelected}
            onClick={this.handleEditButton}
          />
          <ShortButton
            href='#topics'
            buttonText='Editar Temario'
            appearance='primary outline'
            disabled={!this.state.convocationSelected}
            onClick={this.handleTopicsButton}
          />
        </section>
        <FullButton
          buttonText='Nueva Convocatoria'
          className='primary'
          onClick={this.handleNewButton}
        />
        <section>
          <h5 aria-busy={this.state.topicsBusy}>
            Temario de la Convocatoria
          </h5>
          <ol>
            {this.state.convocationSelected
              ? this.state.convocationSelected.topicList.map((topic) => {
                return (
                  <li
                    id={topic._id}
                    key={topic._id}
                    title={topic.fullTitle}
                  >
                    {topic.title}
                  </li>
                )
              })
              : 'Seleccione una Convocatoria ⬆️'}
          </ol>
          <ConvocationForm
            apiUrl={this.state.apiUrl}
            open={this.state.editFormOpen}
            convocation={this.state.convocationSelected}
            toggleModalOpen={this.toggleEditFormOpen}
            refreshParent={this.doRefresh}
          />
          <ConvocationTopicsForm
            apiUrl={this.state.apiUrl}
            open={this.state.topicsFormOpen}
            convocation={this.state.convocationSelected}
            toggleParentBusy={this.toggleComponentBusy}
            toggleModalOpen={this.toggleTopicsFormOpen}
            refreshParent={this.doRefresh}
          />
        </section>
      </div>
    )
  }
}

export default ConvocationsTable
