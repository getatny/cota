module.exports = {
    errorResolver: async (fn, ctx) => {
        try {
            await fn()
        } catch(err) {
            console.log(err)
            ctx.sendError(err)
        }
    }
}