import DOMNode from '../DOMNode'

export const args = ['ytplayer']

export function init (args, isLoaded, loadVideo, done) {
  isLoaded(getVideoId(), function (videoLoaded) {
    let searchBox = DOMNode('form', ['i-yt-container'], {}, [
      DOMNode('label', ['i-yt-search-icon'], {'for': 'i-search'}),
      DOMNode('input', ['i-yt-search'], {name: 'i-search', autocomplete: 'off', type: 'text', disabled: videoLoaded}),
      DOMNode('label', ['i-yt-results']),
      DOMNode('input', ['i-yt-submit'], {type: 'submit'})
    ])

    searchBox.onclick = videoLoaded
      ? () => { document.getElementsByClassName('i-yt-search')[0].disabled = false }
      : loadVideo

    document.getElementById('watch7-user-header').appendChild(searchBox)

    if (videoLoaded) {
      done()
    } else {
      loadVideo(getVideoId(), function (percent) {
        document.getElementsByClassName('i-yt-search')[0].setAttribute('percent-done', percent)
      }, done)
    }
  })
}

export function provider (args, search) {
  document.getElementsByClassName('i-yt-container')[0].onsubmit = function (e) {
    e.preventDefault()
    setSpinner()
    search(getVideoId(), getSearchTerm())
  }
}

export function consumer (args, term, results) {
  removeSpinner()
  clearMarkers()
  results.forEach(result => createMarker(args.ytplayer, result, term))
  document.getElementsByClassName('i-yt-results')[0].textContent = `${results.length} Results`
}

function getVideoId () {
  return window.location.search.split('=')[1]
}

function getSearchTerm () {
  return document.getElementsByClassName('i-yt-search')[0].value.toLowerCase()
}

function setSpinner () {}

function removeSpinner() {}

function createMarker (ytplayer, time, text) {
  let videoLength = parseInt(ytplayer.config.args.length_seconds)
  let width = document.getElementsByClassName('ytp-progress-list')[0].clientWidth
  let left = Math.floor((time / videoLength) * width)

  let marker = (function () {
    let e = document.createElement('div')
    e.setAttribute('class', 'ytp-ad-progress i-marker hint--bottom')
    e.setAttribute('data-hint', text)
    e.style.width = '' + Math.max(Math.ceil(width / videoLength), 6) + 'px'
    e.style.left = '' + left + 'px'
    e.style['backgroundColor'] = 'mediumspringgreen'
    return e
  })()

  document.getElementsByClassName('ytp-ad-progress-list')[0]
    .appendChild(marker)
}

function clearMarkers () {
  let elements = document.getElementsByClassName('i-marker')
  for (let j = 0; j < elements.length; j++) {
    elements[j].style.display = 'none'
  }
}
