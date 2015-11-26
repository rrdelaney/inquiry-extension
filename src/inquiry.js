function isLoaded(id, callback) {
  fetch(`https://backend.inquiry.tech:9000/exists/${id}`)
    .then(res => res.status < 400)
    .then(callback)
}

function search(id, term, callback) {
  fetch(`https://backend.inquiry.tech:9000/query/${id}/${term}`)
    .then(res => res.json())
    .then(json => callback(json))
}

function loadVideo(id, loading, onFinish) {

}

export default function inquiry (vars, init, provider, consumer, reloadOn) {
  if (vars) {
    console.log(`Injecting sciprt: requesting ${vars.join(',')}`)
    let script = document.createElement('script')
    script.textContent = `(function() {
        document.body.setAttribute('data-inquiry-inject', JSON.stringify({
          ${vars.map(v => '' + v + ': ' + v).join(',')}
        }))
    })()`

    document.body.appendChild(script);
  }

  let args = vars ? JSON.parse(document.body.getAttribute('data-inquiry-inject')) : []

  let loadingDone = function () {
    console.log('Registering provider')

    provider(args, function (id, term) {
      console.log(`Searching for ${term} in video ${id}`)

      search(id, term, function (results) {
        console.log('Triggering consumer')

        consumer(args, term, results)
      })
    })
  }

  init(args, isLoaded, loadVideo, loadingDone)

  if (reloadOn) {
    reloadOn(() => init(args, isLoaded, loadVideo, loadingDone))
  }
}
