const d = window.document

const utils = {

    create: function ({ type, className, id, innerHtml }, { event, fn } = {}) {
        const element = d.createElement(type)
        className && (element.className = className)
        innerHtml && (element.innerHTML = innerHtml)
        id && (element.setAttribute('id', id))

        if (event) {
            element.addEventListener(event, fn)
        }

        return element
    },

    createATag: function (fn, className = undefined, innerHtml = undefined, id = undefined, ) {
        return this.create({
            type: 'a',
            innerHtml,
            className,
            id
        }, {
            event: 'click',
            fn
        })
    },

    append: function(dom, nodes) {
        nodes.forEach(node => dom.append(node))
    },

    prepend: function(dom, nodes) {
        nodes.forEach(node => dom.prepend(node))
    }

}

module.exports = utils