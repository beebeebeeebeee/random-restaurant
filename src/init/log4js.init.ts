import * as log4js from 'log4js'

log4js.configure({
    appenders: {
        out: {
            type: "stdout",
            layout: {
                type: "pattern",
                pattern: "%[%d{yyyy-MM-dd hh:mm:ss.SSS} %5.5p --- [%h %z]%] - %m"
            },
        },
    },
    categories: { default: { appenders: ["out"], level: "info" } },
});