export default function DOMNode (tag, classes, others, children) {
  var node = document.createElement(tag)

  if (classes) {
    node.setAttribute('class', classes.join(' '))
  }

  if (others) {
    Object.keys(others).forEach(key => {
      if (key === 'disabled') {
        node.disabled = others[key]
      } else {
        node.setAttribute(key, others[key])
      }
    })
  }

  if (children) {
    children.forEach(child => node.appendChild(child))
  }

  return node
}
