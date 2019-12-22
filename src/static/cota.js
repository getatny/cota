(function(d) {
    importCss()
    const commentList = getCommentFromServer()
    const commentBox = '<div class="comment-box"><textarea class="comment-input"></textarea><div id="comment-btns"><a class="submit">Submit</a><div class="clear"></div></div></div><div id="comment-list"></div>'

    renderCommentBox(commentBox)
    renderCommentList()

    // import necessary css style
    function importCss() {
        const styleLink = d.createElement('link')
        styleLink.rel = 'stylesheet'
        styleLink.type = 'text/css'
        styleLink.href = '/cota.min.css'
        d.head.append(styleLink)
    }

    // 渲染评论框
    function renderCommentBox(box) {
        const cota = d.getElementById('cota')
        cota.innerHTML = box
    }

    // 渲染评论列表
    function renderCommentList() {
        const commentListEl = d.getElementById('comment-list')
        const render = commentList.map(item => {
            return `<div>${item.comment}</div>`
        })
        commentListEl.innerHTML = render.toString().replace(',', '')
    }

    // 当用户点击submit的时候，先将评论内容保存到内存中
    function getCommentAndSaveToCache(e) {
        const value = e.target.parentElement.previousElementSibling.value
        commentList.unshift({
            id: 'temp' + commentList.length,
            comment: value,
            author: 'matthew'
        })
        renderCommentList()
    }

    // 从服务器中拉取当前文章评论详情
    function getCommentFromServer() {
        return [
            {
                id: 1,
                comment: 'test',
                author: 'matthew'
            }
        ]
    }
})(document)