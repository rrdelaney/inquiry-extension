function isLoaded(id, callback) {
  fetch(`https://backend.inquiry.tech:9000/exists/${id}`)
    .then(function (res) {
      callback(res.status < 400)
    })
}

function search(id, term, callback) {
  fetch(`https://backend.inquiry.tech:9000/query/${id}/${term}`)
    .then(res => res.json())
    .then(json => callback(json))
}

function loadVideo(id, loading, onFinish) {
  console.log(`Loading video ${id}`)

  let stream = new EventSource('backend.inquiry.tech/loading')
  stream.onmessage = (e) => {
    let data = JSON.parse(e.data)
    loading(data.percent)

    if (data.percent === 100) {
      stream.onmessage = null
      loadingDone()
    }
  }

  onFinish()
}

export default function inquiry (vars, init, provider, consumer) {
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
}
