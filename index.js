var queue = require('queue')
var IncomingWebhook = require('@slack/client').IncomingWebhook
var _ = require('lodash')

// How often we will push logs to slack
const LOGGING_INTERVAL = 3000

const bold = (text) => '*' + text  + '*'
const italic = (text) => '_' + text + '_'

const bunchMessages = (messages) => _.join(messages, '\n')
const postMsg = (msg, hook, cb) => hook.send(msg, cb.bind(null))

function logger(url, options) {
    const logInterval = options ? options.logInterval || LOGGING_INTERVAL : LOGGING_INTERVAL
    const webhook = new IncomingWebhook(url) 
    const q = queue({concurrency: 1})

    // Store all the messages in this buffer
    let messages = []
    
    function pushMsg(text) {
        const date = bold((new Date()).toISOString()) // Get current Time
        const msg = date + ': ' + text
        messages.push(msg)
    }

    this.log = pushMsg.bind(null)
    this.warn = (text) => pushMsg(bold(text))
    this.info = (text) => pushMsg(italic(text))

    function slurp() {
        if (!_.isEmpty(messages)) {
            const bunch = bunchMessages(messages)
            q.push(cb => postMsg(bunch, webhook, cb)) // Add bunch to queue
            q.start()
            messages = [] // Clear messages
        }
    }

    const slurpLoop = setInterval(slurp, logInterval)

    // Stops our loop from running, program will run forever if this
    // isn't called
    this.flush = () => setTimeout(
        clearInterval.bind(undefined, slurpLoop), logInterval)

    return this
}

module.exports = logger