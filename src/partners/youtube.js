import { $, DOMNode } from '../DOMNode'

export const args = ['ytplayer']

export function init (args, isLoaded, loadVideo, done) {
  isLoaded(getVideoId(), function (videoLoaded) {
    let searchBox = DOMNode('form', ['i-yt-container'], {}, [
      DOMNode('label', ['i-yt-search-icon'], {'for': 'i-search'}),
      DOMNode('input', ['i-yt-search'], {name: 'i-search', autocomplete: 'off', type: 'text', disabled: videoLoaded}),
      DOMNode('label', ['i-yt-results']),
      DOMNode('input', ['i-yt-submit'], {type: 'submit'})
    ])

    $('#watch7-user-header').appendChild(searchBox)

    if (videoLoaded) {
      searchBox.onclick = () => { $('.i-yt-search').disabled = false }
      done()
    } else {
      setUnloadedIcon()
      searchBox.onclick = () => {
        setSpinner()
        loadVideo(getVideoId(), function (percent) {
          $('.i-yt-search').setAttribute('data-percent-done', percent)
        }, function () {
          removeSpinner()
          done()
        })
      }
    }
  })
}

export function provider (args, search) {
  $('.i-yt-container').onsubmit = function (e) {
    e.preventDefault()
    setSpinner()
    search(getVideoId(), getSearchTerm())
  }
}

export function consumer (args, term, results) {
  removeSpinner()
  clearMarkers()
  results.forEach(result => createMarker(args.ytplayer, result, term))
  $('.i-yt-results').textContent = `${results.length} Results`
}

function getVideoId () {
  return window.location.search.split('=')[1]
}

function getSearchTerm () {
  return $('.i-yt-search').value.toLowerCase()
}

function setUnloadedIcon () {
  $('.i-yt-search-icon').setAttribute('class', 'i-yt-search-icon not-loaded')
}

function setSpinner () {
  $('.i-yt-search-icon').setAttribute('class', 'i-yt-search-icon loading')
}

function removeSpinner() {
  $('.i-yt-search-icon').setAttribute('class', 'i-yt-search-icon')
}

function createMarker (ytplayer, time, text) {
  let videoLength = parseInt(ytplayer.config.args.length_seconds)
  let width = $('.ytp-progress-list').clientWidth
  let left = Math.floor((time / videoLength) * width)

  let marker = DOMNode('div', ['ytp-play-progress i-marker hint--bottom'], {
    style: {
      width: Math.max(Math.ceil(width / videoLength), 6) + 'px',
      left: `${left}px`,
      'background-color': 'mediumspringgreen'
    },
    'data-hint': text
  })

  $('.ytp-progress-list').appendChild(marker)
}

function clearMarkers () {
  let elements = $('.i-marker') || []
  for (let j = 0; j < elements.length; j++) {
    elements[j].style.display = 'none'
  }
}
