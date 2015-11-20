
var i = {}

i.videoId = window.location.search.split('=')[1]

i.searchTerm = function() {
    return document.getElementsByClassName('i-search')[0].value
}

i.loadYTPlayer = function() {
    var script = document.createElement('script')
    script.textContent = `(function() {
        document.body.setAttribute('ytplayer', JSON.stringify(ytplayer.config.args))
    })()`

    document.body.appendChild(script);
    i.ytargs = JSON.parse(document.body.getAttribute('ytplayer'))
}

i.createMarker = function(time, text) {
    var videoLength = parseInt(i.ytargs.length_seconds)
    var width = document.getElementsByClassName('ytp-progress-list')[0].clientWidth
    var left = Math.floor((time / videoLength) * width)

    var marker = (function() {
        var e = document.createElement('div')
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

i.createSearch = function(onSearch) {
    var searchBox = (function() {
        var container = document.createElement('form')
        container.setAttribute('class', 'i-container')

        var label = document.createElement('label')
        label.setAttribute('for', 'i-searcher')
        label.setAttribute('class', 'i-search-icon')

        var input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('class', 'i-search')
        input.setAttribute('name', 'i-searcher')

        var submit = document.createElement('input')
        submit.setAttribute('type', 'submit')
        submit.style.display = 'none'

        container.appendChild(label)
        container.appendChild(input)
        container.appendChild(submit)

        container.onsubmit = function(e) {
            e.preventDefault()
            onSearch()
        }

        return container
    })()

    var header = document.getElementById('watch7-user-header')
    header.appendChild(searchBox)
}

i.clearMarkers = function() {
    var elements = document.getElementsByClassName('i-marker')
    for (var j = 0; j < elements.length; j++) {
        elements[j].style.display = 'none'
    }
}

i.doSearch = function() {
    i.clearMarkers()
    fetch(`http://104.236.166.190:9000/query/${i.videoId}/${i.searchTerm()}`)
        .then(function(res) {
            return res.json()
        }).then(function(times) {
            times.forEach(function(time) {
                i.createMarker(time, i.searchTerm())
            })
        })
}

var spinnerTimeout = undefined;
i.search = function(term) {
    var node = document.getElementsByClassName('i-search-icon')[0]
    node.setAttribute('class', 'fa-spin i-search-icon loading')

    if (spinnerTimeout) {
        clearTimeout(spinnerTimeout)
    }

    spinnerTimeout = setTimeout(function() {
        node.setAttribute('class', 'i-search-icon')
        i.doSearch()
    }, 500)
}

i.loadYTPlayer()
i.createSearch(i.search)
