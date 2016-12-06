# Slog

Stupid simple library for logging via slack

## API

### Constructor

Construct by passing a webhook URL and options

```js
var slog = require('slog')(url, options)
```

Options is currently limited to `logInterval`, which controls how
often the logs are posted as messages to slack. By default, this
is set to 3 seconds.

This can be changed to any value, but it's highly recommended that you keep
it to a minimum of 1 second to avoid being penalized by the slack
rate-limiting.

#### log, warn, info

There are 3 levels of logging, all of which have the same for

```js
slog.level(msg)
```

Where level is either:
- log: Just a regular messag
- warn: A message that will be bold
- info: A message that will be italicized

In addition to the message that's input, before it will be an ISO timestamp,
that represents the time at which the function was called.

#### flush

The flush method is used to kill the interval that the logger uses for
continuously posting logs, and allows the program to finish.

If you don't call flush, the program will __never end__. So don't forget
to call it, or you'll be waiting for a long time :)

# Misc

## Errors
lol, all log messages are treated as fire and forget, if slack is down, or something breaks down, there's no guaruntee that your message will actually arrive

## Large messages
Messages are posted together in batches to avoid the rate limit issues with
slack's API. I have no idea what the maximum size of a message is, but try not to post
a ton of messages in a short timespan, or a really large message. Who knows
if it will actually go through.