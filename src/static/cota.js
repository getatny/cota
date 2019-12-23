(function(d) {
    importCss()

    const cota = d.getElementById('cota')
    let commentTo = null // null: to this post; object: to this comment

    // comment-box el
    const commentBox = d.createElement('div')
    commentBox.classList.add('comment-box')
    commentBox.innerHTML = '<textarea class="comment-input"></textarea><div id="comment-btns"><div class="clear"></div></div>'
    cota.prepend(commentBox)
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
    const commentListEl = d.createElement('div')
    commentListEl.setAttribute('id', 'comment-list')
    // inject element
    d.getElementById('comment-btns').prepend(submitButton)
    d.getElementById('comment-btns').prepend(cancelReplyButton)
    cota.append(commentListEl)

    renderCommentList()

    // import necessary css style
    function importCss() {
        let ifCssAlreadyLoad = false
        Array.from(document.getElementsByTagName('link')).forEach(item => item.href.indexOf('cota.min.css') > -1 ? ifCssAlreadyLoad = true : null)

        if (!ifCssAlreadyLoad) {
            const styleLink = d.createElement('link')
            styleLink.rel = 'stylesheet'
            styleLink.type = 'text/css'
            styleLink.href = '/cota.min.css'
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
        const commentList = getCommentFromServer()
        // render main comment
        commentList.mainComments.forEach(item => {
            const commentListItem = addCommentItem(item)
            commentListEl.append(commentListItem)
        })
        commentList.childComments.forEach(item => {
            const commentListItem = addCommentItem(item, true)
            d.querySelector(`#comment-list-item-${item.parentId} .child-comment-list`).append(commentListItem)
        })
    }

    function addCommentItem(item, child = false) {
        const commentListItem = d.createElement('div')
        commentListItem.setAttribute('id', 'comment-list-item-' + item.id)
        const commentDetail = d.createElement('div')
        commentDetail.classList.add('comment-detail')
        const commentInfo = d.createElement('div')
        commentInfo.classList.add('comment-info')
        const reply = d.createElement('a')
        reply.classList.add('reply-comment')
        reply.innerText = 'Reply'
        reply.addEventListener('click', replyCommnet)
        if (child) {
            commentDetail.innerHTML = `<div class="comment-content">${item.comment}</div><div class="comment-box-${item.id}"></div>`
        } else {
            commentDetail.innerHTML = `<div class="comment-content">${item.comment}</div><div class="comment-box-${item.id}"></div><div class="child-comment-list"></div>`
        }
        commentInfo.append(reply)
        commentDetail.prepend(commentInfo)
        commentListItem.append(commentDetail)
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
        setTimeout(() => {
            const commentListItem = addCommentItem({
                id: 2,
                postId: 1,
                parentId: 0,
                email: 'wangmaozhu@foxmail.com',
                website: 'matthew-wang.com',
                nickname: 'Matthew',
                comment: value
            })
            if (commentTo === null) {
                commentListEl.prepend(commentListItem)
            } else {
                commentTo.append(commentListItem)
            }
            e.target.parentElement.previousElementSibling.value = ''
        }, 1000)
    }

    // fetch comment list from server
    function getCommentFromServer() {
        return {
            mainComments: [
                {
                    id: 1,
                    postId: 1,
                    parentId: 0,
                    email: 'wangmaozhu@foxmail.com',
                    website: 'matthew-wang.com',
                    nickname: 'Matthew',
                    comment: 'test',
                }
            ],
            childComments: [
                {
                    id: 3,
                    postId: 1,
                    parentId: 1,
                    email: 'wangmaozhu@foxmail.com',
                    website: 'matthew-wang.com',
                    nickname: 'Matthew',
                    comment: 'test child comment',
                }
            ]
        }
    }
})(document)