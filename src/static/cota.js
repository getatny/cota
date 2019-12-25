(function(d) {
    const gravatarMirror = 'https://dn-qiniu-avatar.qbox.me/avatar'

    const http = {
        get: (url) => {
            return fetch(url)
        },
        post: (url, data) => {
            return fetch(url, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        },
        delete: (url, data) => {
            return fetch(url, {
                method: 'delete',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }
    }

    importCss()

    const cota = d.getElementById('cota')
    let commentTo = null // null: to this post; object: to this comment

    // comment-box el
    const commentBox = d.createElement('div')
    commentBox.classList.add('comment-box')
    commentBox.innerHTML = '<textarea class="comment-input"></textarea><div id="comment-btns"><div class="clear"></div></div>'
    cota.prepend(commentBox)
    // emoji button el
    const emojiButton = d.createElement('a')
    emojiButton.classList.add('emoji')
    emojiButton.innerText = 'Emoji'
    emojiButton.addEventListener('click', showEmojiSelectBox)
    // submit button el
    const submitButton = d.createElement('a')
    submitButton.classList.add('submit')
    submitButton.innerText = 'Submit'
    submitButton.addEventListener('click', getCommentAndSubmit)
    // cancel reply button el
    const cancelReplyButton = d.createElement('a')
    cancelReplyButton.classList.add('cancel-reply-button')
    cancelReplyButton.innerText = 'Cancel'
    cancelReplyButton.addEventListener('click', cancelReply)
    cancelReplyButton.style.display = 'none' // for default situation, this button will be hide
    // commnet list el
    const commentListEl = d.createElement('ul')
    commentListEl.setAttribute('id', 'comment-list')
    // emoji box
    let emojiSelectBoxStatuts = false
    const emojiSelectBox = d.createElement('div')
    emojiSelectBox.setAttribute('id', 'emoji-select-box')
    emojiSelectBox.innerHTML = '<div class="emoji-select-arrow"></div>'
    const emojiSelectBoxContent = d.createElement('div')
    emojiSelectBoxContent.classList.add('emoji-select-content')
    emojiSelectBox.prepend(emojiSelectBoxContent)
    d.documentElement.addEventListener('click', hideEmojiSelectBox)
    // inject element
    d.getElementById('comment-btns').prepend(submitButton)
    d.getElementById('comment-btns').prepend(cancelReplyButton)
    d.getElementById('comment-btns').prepend(emojiButton)
    cota.append(commentListEl)
    cota.append(emojiSelectBox)

    renderCommentList()

    let emojiList = getEmojiFromServer()
    emojiList.forEach(item => {
        emojiSelectBoxContent.append(createEmojiEl(item))
    })

    // import necessary css style
    function importCss() {
        let ifCssAlreadyLoad = false
        Array.from(document.getElementsByTagName('link')).forEach(item => item.href.indexOf('cota.min.css') > -1 ? ifCssAlreadyLoad = true : null)

        if (!ifCssAlreadyLoad) {
            const serverPath = getServerPathByJSLink()
            const styleLink = d.createElement('link')
            styleLink.rel = 'stylesheet'
            styleLink.type = 'text/css'
            styleLink.href = `${serverPath}/cota.min.css`
            d.head.append(styleLink)
            console.log('load css')
        }
    }

    // render main comment box
    function switchCommentBoxPlace(el) {
        el.prepend(commentBox)
    }

    function cancelReply(e) {
        // hide child comment box
        d.getElementsByClassName('comment-box')[0].remove()

        // show main comment box
        switchCommentBoxPlace(cota)
        cancelReplyButton.style.display = 'none'
        commentTo = null
    }

    // render comment lsit
    function renderCommentList() {
        getCommentFromServer().then(res => {
            const commentList = res

            // render main comment
            commentList.mainComments.forEach(item => {
                const commentListItem = createCommentItem(item)
                commentListEl.append(commentListItem)
            })
            commentList.childComments.forEach(item => {
                const commentListItem = createCommentItem(item, true)
                d.querySelector(`#comment-list-item-${item.parentId} .child`).append(commentListItem)
            })
        })
    }

    function createCommentItem(item, child = false) {
        const commentListItem = d.createElement('li')
        commentListItem.classList.add('comment-list-item')
        commentListItem.setAttribute('id', 'comment-list-item-' + item.id)
        commentListItem.setAttribute('data-id', item.id)
        commentListItem.innerHTML = `<div class="avatar"><img src="${gravatarMirror}/${md5(item.email)}" alt="${item.nickname}" /></div><ul class="child"></ul>`
        // comment detail el
        const commentDetail = d.createElement('div')
        commentDetail.classList.add('comment-detail')
        commentDetail.addEventListener('mouseenter', function(e) {
            e.stopPropagation()
            e.target.children[0].children[0].style.opacity = '1'
        })
        commentDetail.addEventListener('mouseleave', function(e) {
            e.target.children[0].children[0].style.opacity = '0'
        })
        // comment info el
        const commentInfo = d.createElement('div')
        commentInfo.classList.add('comment-info')
        if (item.website !== '') {
            commentInfo.innerHTML = `<a class="nickname" href="${item.website}">${item.nickname}</a><div class="clear"></div>`
        } else {
            commentInfo.innerHTML = `<span class="nickname">${item.nickname}</span><div class="clear"></div>`
        }
        const reply = d.createElement('a')
        reply.classList.add('reply-comment')
        reply.innerText = 'Reply'
        reply.addEventListener('click', replyCommnet)
        commentDetail.innerHTML = `<div class="comment-content">${item.comment}</div><div class="comment-box-${item.id}"></div>`
        commentInfo.prepend(reply)
        commentDetail.prepend(commentInfo)
        commentListItem.prepend(commentDetail)
        return commentListItem
    }

    // when Reply button clicked
    function replyCommnet(e) {
        // hide main comment box
        d.getElementsByClassName('comment-box')[0].remove()

        // show commnet box below the comment which user wanna reply
        switchCommentBoxPlace(e.target.parentElement.nextElementSibling.nextElementSibling)
        cancelReplyButton.style.display = 'block'
        commentTo = e.target.parentElement.parentElement.parentElement
    }

    // submit comment when user click submit button
    function getCommentAndSubmit(e) {
        const value = e.target.parentElement.previousElementSibling.value
        const server = getServerPathByJSLink()
        http.post(server + '/rest/comment/create', {
            key: md5(d.location.pathname),
            commentContent: value,
            email: 'wangmaozhu@foxmail.com',
            nickname: 'Matthew',
            title: d.title,
            url: d.location.href,
            parentId: commentTo ? parseInt(commentTo.dataset.id) : 0
        }).then(res => res.json()).then(res => {
            const commentListItem = createCommentItem({
                id: res.data.id,
                postId: res.data.postId,
                parentId: res.data.parentId,
                email: res.data.email,
                website: res.data.website ? res.data.website : '',
                nickname: res.data.nickname,
                comment: res.data.comment
            })

            if (res.success) {
                if (commentTo === null) {
                    commentListEl.prepend(commentListItem)
                } else {
                    commentTo.children[2].append(commentListItem)
                }
                
                if (e.target.previousElementSibling.style.display === 'block') {
                    e.target.previousElementSibling.click()
                }
                e.target.parentElement.previousElementSibling.value = ''
            }
        })
    }

    function showEmojiSelectBox(e) {
        const position = getElementPagePosition(e.target)
        const left = (position.x + ((e.target.offsetWidth) / 2) - 42)

        emojiSelectBox.style.cssText = `top: ${position.y - emojiSelectBox.offsetHeight - 9}px; left: ${left}px`
        emojiSelectBox.className = 'show-selection'
        emojiSelectBoxStatuts = true
    }

    function hideEmojiSelectBox(e) {
        if (e.target.closest('#emoji-select-box') === null && e.target.className !== 'emoji' && emojiSelectBoxStatuts === true) {
            emojiSelectBox.className = 'hide-selection'
        }
    }

    function createEmojiEl(emoji) {
        const tEmoji = d.createElement('a')
        tEmoji.innerText = emoji
        tEmoji.addEventListener('click', insertEmojiToTextarea)
        return tEmoji
    }

    function insertEmojiToTextarea(e) {
        const content = e.target.innerText
        const inputBox = commentBox.children[0]
        inputBox.value = inputBox.value + content
    }

    function getElementPagePosition(element){
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        let actualTop = element.offsetTop;
        current = element.offsetParent;
        while (current !== null) {
            actualTop += (current.offsetTop+current.clientTop);
            current = current.offsetParent;
        }
        return { x: actualLeft, y: actualTop }
    }

    // fetch comment list from server
    function getCommentFromServer() {
        const server = getServerPathByJSLink()
        return http.get(`${server}/rest/comments/${md5(d.location.pathname)}`).then(res => res.json()).then(res => {
            if (res.success) {
                return res.data
            }
        })
    }

    function getEmojiFromServer() {
        return ['😀', '😃', '😄']
    }

    function getServerPathByJSLink() {
        const schema = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/^(\S*):\/\//)[1]
        const serverPath = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/https:\/\/(\S*)\//)[1]
        return `${schema}://${serverPath}`
    }

    // ========================================================================================================== md5
    function md5(d){result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
})(document)