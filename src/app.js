const config = {
    apiurl: "http://localhost:3080/api/v1"
};

const OPTIONS = {
    method: 'GET',
    mode: 'cors' 
};

const fetchIpInfo = ip => {
    return fetch(`${config.apiurl}/convocations`,
      OPTIONS)
        .then(res => res.json())
        .catch(err => console.error(err))
}

const $ = selector => document.querySelector(selector)

const $form = $('#formulario')
const $input = $('#input')
const $submit = $('#submit')
const $results = $('#results')

$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const {value} = $input
    if (!value) return
  
    $submit.setAttribute('disabled', '')
    $submit.setAttribute('aria-busy', 'true')
  
    const ipInfo = await fetchIpInfo(value)
  
    if (ipInfo) {
      $results.innerHTML = JSON.stringify(ipInfo, null, 2)
    }
  
    $submit.removeAttribute('disabled')
    $submit.removeAttribute('aria-busy')
  })