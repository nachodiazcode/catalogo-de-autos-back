const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'logfile.log' }),
        new transports.Console({ format: format.simple() })
    ]
});

module.exports = logger;
