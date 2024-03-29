// eslint-disable-next-line import/prefer-default-export
export function createElement({
  tag = 'div',
  classes = [],
  innerHTML = '',
  childs = [],
  appendTo = null,
  onclick = null,
  ...attrs
}) {
  const result = document.createElement(tag)

  classes.filter((c) => c).forEach((c) => result.classList.add(c))
  Object.keys(attrs)
    .filter((attr) => attrs[attr] !== null)
    .forEach((attr) => result.setAttribute(attr, attrs[attr]))
  childs.filter((c) => c).forEach((c) => result.appendChild(c))

  if (innerHTML) result.innerHTML = innerHTML
  if (appendTo instanceof HTMLElement) appendTo.appendChild(result)
  if (onclick instanceof Function) result.onclick = onclick

  return result
}
