'use strict'

let fs = require('fs')

const IMPORT_EXPR = /^import ([\w{} ,$]+) from ["']([\/\.\w]+)["']/g
const EXPORT_EXPR = /^export( default)? (function|const|class) ([\w$]+)/g
const symbol = fname => fname.split('/').join('__').split('.')[0]

function processFile (fname) {
  let contents = '\n'
  let deps = {}
  var res

  fs.readFileSync(fname).toString().split('\n').forEach(line => {
    if (res = IMPORT_EXPR.exec(line)) {
      if (res[1].startsWith('{')) {
        res[1]
          .slice(1, -1)
          .split(',')
          .map(p => p.trim())
          .forEach(p => contents += `var ${p} = ${resolveFile(fname, res[2])}.${p}\n`)

        deps[resolveFile(fname, res[2])] = res[2]
      } else {
        deps[res[1]] = res[2]
      }
    } else if (res = EXPORT_EXPR.exec(line)) {
      if (res[1] === 'default') {
        contents += `exports = ${line.replace('export ', '')}\n`
      } else {
        contents += `exports.${res[3]} = ${line.replace('export ', '')}\n`
      }
    } else {
      contents += line + '\n'
    }
  })

  contents = `var ${symbol(fname)} = {}\n
;(function (exports) {
  ;(function (${Object.keys(deps).join(', ')}) {
${contents}
  })(${Object.keys(deps).map(k => deps[k]).map(f => resolveFile(fname, f)).join(', ')})
})(${symbol(fname)})`

  return { deps, contents }
}

function resolveFile (host, guest) {
  return guest
    .split('/')
    .reduce(
      (hostPath, p) => p === '..' ? hostPath.slice(0, -1) : hostPath.concat([p]),
      host.split('/').slice(0, -1)
    )
    .filter(p => p !== '.')
    .join('__')
}

console.log(process.argv.slice(2).map(processFile).map(x => x.contents).join('\n\n\n'))
