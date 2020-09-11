const vdomExample = {
    tag: 'div',
    props: {
        class: 'container'
    },
    children: [
        {
            tag: 'h1',
            props: {
                title: 'this is a title'
            },
            children: 'Basic of JS Framework',
        },
        {
            tag: 'p',
            props: {
                class: 'discription'
            },
            children: 'Here we learn, where is behind of every modern JS framework',
        },
    ]
}

//create VNODE (don't mount it)
function h(tag, props, children) {
    return {
        tag,
        props,
        children,
    }
}

// Mount  a VDON to the DOM
function mount(vnode, container) {
    const el = document.createElement(vnode.tag)

    for( const key in vnode.props) {
        el.setAttribute(key, vnode[key])
    }

    if(typeof vnode.children === 'string') {
        el.textContent = vnode.children
    } else {
        vnode.children.forEach( child => {
            mount(child, el)
        })
    }

    container.appendChild(el)

    vnode.$el = el;
}

//unmounte a vnode from the DOM
function unmount(vnode) {
    vnode.$el.parentElement.removeChild(vnode.$el)
}

// take 2 nodes, compares them and figures out the difference.
function patch(n1, n2) {
    console.log(n1.tag !== n2.tag)

    if(n1.tag !== n2.tag) {
        mount(n2, n1.$el.parentNode)
        unmount(n1)
    } else {
        n2.$el = n1.$el
        if(typeof n2.children === 'string') {
            n2.$el.textContent = n2.children

        } else {
            console.log(n2.$el)
            while( n2.$el.attributes.length > 0 ) {
                n2.$el.removeAttribute(n2.$el.attributes[0].name)
            }

            for( const key in n2.props ) {
                n2.$el.setAttribute(key, n2.props[key])
            }

            if(typeof n1.children === 'string') {
                n2.$el.textContent = null
                n2.children.forEach( child => {
                    mount(child, n2.$el)
                })
            } else {
                const commonLenght = Math.min(n1.children.length, n2.children.length)

                for(let i = 0; i < commonLenght; i++) {
                    patch(n1.children[i], n2.children[i])
                }

                if(n1.children.length > n2.children.length) {
                    n1.children.slice(n2.children.length).forEach(child => {
                        unmount(child)
                    })
                }

                else if(n2.children.length > n1.children.length) {
                    n2.children.slice(n1.children.length).forEach(child => {
                        mount(child)
                    })
                }
            }
        }
    }
}
