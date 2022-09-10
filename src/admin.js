const config = {
    apiurl: "http://localhost:3080/api/v1"
};

const OPTIONS = {
    method: 'GET',
    mode: 'cors' 
};

const fetchIpInfo = (apiPath) => {
    return fetch(`${config.apiurl}/${apiPath}`,
      OPTIONS)
        .then(res => res.json())
        .catch(err => console.error(err))
}

const $ = selector => document.querySelector(selector)

// const $convocations = $('#convocations')

/* window.addEventListener("load", async (event) => {
    const convocations = await fetchIpInfo('convocations');    
    $convocations.remove(0);
    let index = 0;
    for (const convocation of convocations.data) {
        const opt = document.createElement("option");
        opt.value = convocation._id;
        opt.innerText = convocation.name;

        $convocations.appendChild(opt);
        index++;
    }
})

$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const {value} = $input
    if (!value) return
  
    $submit.setAttribute('disabled', '')
    $submit.setAttribute('aria-busy', 'true')

    const ipInfo = await fetchIpInfo(value);
    if (ipInfo) {
        $results.innerHTML = JSON.stringify(ipInfo, null, 2)
    }

    $submit.removeAttribute('disabled')
    $submit.removeAttribute('aria-busy')
}) */