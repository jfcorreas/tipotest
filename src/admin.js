const config = {
    apiurl: "http://localhost:3080/api/v1"
};

const OPTIONS = {
    method: 'GET',
    mode: 'cors' 
};

const fetchInfo = (apiPath) => {
    return fetch(`${config.apiurl}/${apiPath}`,
      OPTIONS)
        .then(res => res.json())
        .catch(err => console.error(err))
}

const $ = selector => document.querySelector(selector)
const $all = selector => document.querySelectorAll(selector)

const $html =$('html');
const $convocations = $('#convocations')
const $convocationsTable = $('#convocationsTable')
const $convocationModal = $('#convocationModal')

$convocations.addEventListener('click', async (event) => {
    if ($convocations.parentElement.open){    
        $convocations.parentElement.setAttribute('open', false);
        return;
    }
    $convocations.setAttribute('aria-busy', 'true');
    const convocations = await fetchInfo('convocations');
    $convocations.setAttribute('aria-busy', 'false');
    $convocations.parentElement.setAttribute('open', true);

    if (convocations.status === "OK") {
        const tbody = $convocationsTable.getElementsByTagName("tbody")[0];
        tbody.innerHTML = '';
        for (const convocation of convocations.data) {
            const newRow = tbody.insertRow(tbody.rows.length);
            newRow.setAttribute('id', convocation._id);
            const rowHtml = `<th scope="row">${convocation.name}</th>
                            <td>${convocation.year}</td>
                            <td>${convocation.institution}</td>
                            <td>${convocation.category}</td>`
            newRow.innerHTML = rowHtml;
        }
        const $convocationsRows = $all('#convocationsTable tbody tr')

        $convocationsRows.forEach(e => e.addEventListener("click", async function(event) {
            // Here, `this` refers to the element the event was hooked on
            console.log(event.target.parentElement.id)
            $html.classList.add('modal-is-open');
            $convocationModal.setAttribute('open', true);
            const convocation = await fetchInfo(`convocations/${event.target.parentElement.id}`);
            if (convocation.status === "OK") {
                const content = $('#convocationModal p');
                content.innerHTML = `${convocation.data.name}  ${convocation.data.year} - ${convocation.data.institution}`;
            }
        }));
    }
})

const toggleModal = (event) => {
    if ($convocationModal.open) {
        $convocationModal.setAttribute('open', false);
        $html.classList.remove('modal-is-open');
    } else {
        $html.classList.add('modal-is-open');
        $convocationModal.setAttribute('open', true);
    }
};

/*
$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const {value} = $input
    if (!value) return
  
    $submit.setAttribute('disabled', '')
    $submit.setAttribute('aria-busy', 'true')

    const ipInfo = await fetchInfo(value);
    if (ipInfo) {
        $results.innerHTML = JSON.stringify(ipInfo, null, 2)
    }

    $submit.removeAttribute('disabled')
    $submit.removeAttribute('aria-busy')
}) */