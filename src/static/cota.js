const md5 = require('js-md5')
const dom = require('./plugin/dom')
const emoticonImg = require('./imgs/emoticon.png').default
const profileImg = require('./imgs/profile.png').default

const http = { // a simple http query util
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

class CotaBase {
    constructor(options) {
        this.init(options)
    }

    d = window.document
    cota = this.d.getElementById('cota')
    gravatarMirror = 'https://dn-qiniu-avatar.qbox.me/avatar'

    commentPage = 1 // current comment page number
    commentPageSize = 10 // how many comments will be shown per page
    commentTo = null

    emojiSelectBoxStatuts = false
    userInfoBoxStatuts = false

    init = (options) => {
        this.cota = options.el || this.cota
        
        if (!this.cota) { // if this page doesn't contain any element id called 'cota', below code will never run.
            return
        } else {
            this.gravatarMirror = options.avatarUrl || this.gravatarMirror
            this.commentPageSize = options.pageSize || this.commentPageSize
            this.emojiList = this.getEmojiFromServer()
            this.serverPath = this.getServerPathByJSLink()

            this.generateComment()
        }
    }

    generateComment = () => {
        console.log(profileImg)
        // comment-box el
        this.commentBox = dom.create({
            type: 'div',
            className: 'comment-box',
            innerHtml: '<textarea class="comment-input"></textarea><div id="comment-btns"><div class="clear"></div></div>'
        })
        this.cota.prepend(this.commentBox)
        // user infomation button
        const userInfoButton = dom.createATag(this.showPopoverBox, 'user-info-button', `<img src=${profileImg} alt="profile" />`)

        // emoji button el
        this.emojiButton = dom.createATag(this.showPopoverBox, 'emoji', `<img src=${emoticonImg} alt="emoticon" />`)

        // submit button el
        const submitButton = dom.createATag(this.getCommentAndSubmit, 'submit', 'Submit')

        // cancel reply button el
        this.cancelReplyButton = dom.createATag(this.cancelReply, 'cancel-reply-button', 'Cancel')
        this.cancelReplyButton.style.display = 'none' // for default situation, this button will be hide

        // commnet list el
        this.commentListEl = dom.create({ type: 'ul', id: 'comment-list' })

        // emoji box
        this.emojiSelectBox = dom.create({
            type: 'div',
            id: 'emoji-select-box',
            innerHtml: '<div class="box-arrow"></div>'
        })
        const emojiSelectBoxContent = dom.create({ type: 'div', className: 'box-content' })
        this.emojiSelectBox.prepend(emojiSelectBoxContent)

        // user infomation box
        this.userInfoBox = dom.create({
            type: 'div',
            id: 'user-info-box',
            innerHtml: '<div class="box-arrow"></div>'
        })
        const userInfoBoxContent = dom.create({ type: 'div', className: 'box-content' })
        this.userInfoBox.prepend(userInfoBoxContent)

        this.d.documentElement.addEventListener('click', this.hidePopoverBox)

        // inject element
        dom.prepend(this.d.getElementById('comment-btns'), [submitButton, this.cancelReplyButton, this.emojiButton, userInfoButton])
        dom.append(this.cota, [this.commentListEl, this.emojiSelectBox, this.userInfoBox])

        this.renderCommentList()

        dom.append(emojiSelectBoxContent, this.emojiList)
    }

    renderCommentList = () => {
        this.getCommentFromServer().then(res => {
            const commentList = res.comments

            // render main comment
            commentList.mainComments.forEach(item => {
                const commentListItem = this.createCommentItem(item)
                this.commentListEl.append(commentListItem)
            })
            commentList.childComments.forEach(item => {
                const commentListItem = this.createCommentItem(item, true)
                this.d.querySelector(`#comment-list-item-${item.parentId} .child`).append(commentListItem)
            })

            if (res.count > this.commentPageSize) {
                // load more comments button
                const loadMoreCommentsButton = dom.create({
                    type: 'div',
                    id: 'load-more',
                    innerHtml: 'Load More'
                }, {
                    event: 'click',
                    fn: this.loadMoreComments
                })
                this.cota.append(loadMoreCommentsButton)
            }
        })
    }

    switchCommentBoxPlace = (el) => {
        el.prepend(this.commentBox)
    }

    replyCommnet = (e) => {
        // hide main comment box
        this.d.getElementsByClassName('comment-box')[0].remove()

        // show commnet box below the comment which user wanna reply
        this.switchCommentBoxPlace(e.target.parentElement.nextElementSibling.nextElementSibling)
        this.cancelReplyButton.style.display = 'block'
        this.commentTo = e.target.parentElement.parentElement.parentElement
    }

    cancelReply = () => {
        // hide child comment box
        this.d.getElementsByClassName('comment-box')[0].remove()

        // show main comment box
        this.switchCommentBoxPlace(this.cota)
        this.cancelReplyButton.style.display = 'none'
        this.commentTo = null
    }

    createCommentItem = (item) => {
        const commentListItem = dom.create({
            type: 'li',
            className: 'comment-list-item',
            id: `comment-list-item-${item.id}`,
            innerHtml: `<div class="avatar"><img src="${this.gravatarMirror}/${md5(item.email)}" alt="${item.nickname}" /></div><ul class="child"></ul>`
        })
        commentListItem.setAttribute('data-id', item.id)
        commentListItem.setAttribute('data-rootid', item.rootId ? item.rootId : item.id)

        // comment detail el
        const commentDetail = dom.create({
            type: 'div',
            className: 'comment-detail',
            innerHtml: `<div class="comment-content">${item.comment}</div><div class="comment-box-${item.id}"></div>`
        }, {
            event: 'mouseenter',
            fn: (e) => {
                e.stopPropagation()
                e.target.children[0].children[0].style.opacity = '1'
            }
        })
        commentDetail.addEventListener('mouseleave', function(e) {
            e.target.children[0].children[0].style.opacity = '0'
        })

        // comment info el
        const commentInfo = dom.create({
            type: 'div',
            className: 'comment-info',
            innerHtml: item.website ? `<a class="nickname" href="${item.website}">${item.nickname}</a><div class="clear"></div>` : `<span class="nickname">${item.nickname}</span><div class="clear"></div>`
        })

        const reply = dom.createATag(this.replyCommnet, 'reply-comment', 'Reply')

        commentInfo.prepend(reply)
        commentDetail.prepend(commentInfo)
        commentListItem.prepend(commentDetail)
        return commentListItem
    }

    getCommentAndSubmit = (e) => {
        const value = e.target.parentElement.previousElementSibling.value
        
        if (value !== '') {
            http.post(`${this.serverPath}/rest/comment/create`, {
                key: md5(this.d.location.pathname),
                commentContent: value,
                email: 'wangmaozhu@foxmail.com',
                nickname: 'Matthew',
                title: this.d.title,
                url: this.d.location.href,
                parentId: this.commentTo ? parseInt(this.commentTo.dataset.id) : 0,
                rootId: this.commentTo ? parseInt(this.commentTo.dataset.rootid) : 0
            }).then(res => res.json()).then(res => {
                const commentListItem = createCommentItem({
                    id: res.response.id,
                    postId: res.response.postId,
                    parentId: res.response.parentId,
                    rootId: res.response.rootId,
                    email: res.response.email,
                    website: res.response.website,
                    nickname: res.response.nickname,
                    comment: res.response.comment
                })

                if (res.success) {
                    this.notify('Submit comment successfully!', 'success')
                    if (this.commentTo === null) {
                        this.commentListEl.prepend(commentListItem)
                    } else {
                        this.commentTo.children[2].append(commentListItem)
                    }
                    
                    if (e.target.previousElementSibling.style.display === 'block') {
                        e.target.previousElementSibling.click()
                    }
                    e.target.parentElement.previousElementSibling.value = ''
                } else {
                    this.notify('Submit comment failed!', 'failed')
                }
            }).catch(() => this.notify('Submit comment failed!', 'failed'))
        } else {
            this.notify('Comment cannot be empty!', 'failed')
        }
    }

    showPopoverBox = (e) => {
        let target = e.target
        let actualTarget = null

        if (target.className === 'emoji' || target.alt === 'emoticon') {
            actualTarget = this.emojiSelectBox
            this.emojiSelectBoxStatuts = true
        } else if (target.className === 'user-info-button' || target.alt === 'profile') {
            actualTarget = this.userInfoBox
            this.userInfoBoxStatuts = true
        }

        target.alt ? target = target.parentElement : null
        const position = this.getElementPagePosition(target)
        const left = (position.x + ((target.offsetWidth) / 2) - 44)

        actualTarget.style.cssText = `top: ${position.y + this.emojiButton.offsetHeight + 9}px; left: ${left}px`
        actualTarget.className = 'show-box'
    }

    hidePopoverBox = (e) => {
        if (this.emojiSelectBoxStatuts && e.target.closest('#emoji-select-box') === null && e.target.className !== 'emoji' && e.target.alt !== 'emoticon') {
            this.emojiSelectBox.className = 'hide-box'
        } 
        if (this.userInfoBoxStatuts && e.target.closest('#user-info-box') === null && e.target.className !== 'user-info-button' && e.target.alt !== 'profile') {
            this.userInfoBox.className = 'hide-box'
        }
    }

    createEmojiEl = (emoji) => {
        const tEmoji = this.d.createElement('a')
        tEmoji.innerText = emoji
        tEmoji.addEventListener('click', insertEmojiToTextarea)
        return tEmoji
    }

    insertEmojiToTextarea = (e) => {
        const content = e.target.innerText
        const inputBox = this.commentBox.children[0]
        inputBox.value = inputBox.value + content
    }

    getElementPagePosition = (element) => {
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

    // custom notification component
    notify = (msg, type = 'info', delay = 3000) => {
        let notification = null
        const existNotification = this.d.getElementById('notification')
        if (!existNotification) {
            const noti = this.d.createElement('div')
            noti.setAttribute('id', 'notification')
            noti.classList.add('show')
            noti.innerHTML = `<div class="icon"><img src="${this.serverPath}/imgs/${type}.png" alt="${type}" /></div><div class="content">${msg}</div>`
            notification = noti
            this.cota.append(noti)
        } else {
            existNotification.children[0].children[0].src = `${this.serverPath}/imgs/${type}.png`
            existNotification.children[0].children[0].alt = type
            existNotification.children[1].innerText = msg
            existNotification.className = 'show'
            notification = existNotification
        }

        setTimeout(() => {
            notification.className = 'hide'
        }, delay)
    }

    getCommentFromServer = () => {
        return http.get(`${this.serverPath}/rest/comments/${md5(this.d.location.pathname)}/${this.commentPage}/${this.commentPageSize}`).then(res => res.json()).then(res => {
            if (res.success) {
                return {
                    comments: res.response.comments,
                    count: res.response.count
                }
            }
        })
    }

    loadMoreComments = (e) => {
        
    }

    getEmojiFromServer = () => {
        return ['😀', '😃', '😄']
    }

    getServerPathByJSLink = () => {
        const schema = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/^(\S*):\/\//)[1]
        const server = Array.from(document.scripts).find(item => item.src.indexOf('cota.min.js') > -1).src.match(/[https|http]:\/\/(\S*)\//)[1]
        return `${schema}://${server}`
    }
}

function Cota(options = {}) {
    return new CotaBase(options)
}

window.Cota = Cota
module.exports = Cota
module.exports.default = Cota