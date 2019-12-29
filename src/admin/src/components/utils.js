export const http = { // a simple http query util
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