module.exports = {
    errorResolver: async (fn, ctx) => {
        try {
            await fn()
        } catch(err) {
            console.log(err)
            ctx.body = {
                success: false,
                err
            }
        }
    }
}