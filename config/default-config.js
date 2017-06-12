/* eslint-disable indent */

// This is the default configuration file

const config = {
    ironplate: {
        server: {
            publicDirectory: null,                                                  // null / <public-path>
            // publicDirectory: require('path').join(__dirname, '../http-pub/'),
            url: {
                hostname: {
                    value: null,                                    // null / <hostname-string> ; The application is supposed to be accessed using this hostname
                    // value: 'example.com',
                    warnOnOtherHostnames: false,                    // false / true ; Warn if the application is being accessed using hostname other than the one specified in 'hostname.value'
                    redirectToSpecifiedHostname: false              // false / true
                                                                    // If the application is loaded from a URL which is not matching the property
                                                                    // 'hostname.value' (eg: when application is being accessed from localhost or IP address),
                                                                    // then should it redirect to the specified 'hostname.value'
                },
                http: {
                    enabled: false,                                 // false / true
                    port: 80,                                       // 80 / <port-number>
                    redirectToHttps: false                          // false / true
                },
                https: {
                    enabled: false,                                             // false / true
                    // secretsAndSettings: {                                    // https://nodejs.org/api/tls.html
                    //     key: 'config/local/https-keys/example.com.key',      // <https-key>
                    //     cert: 'config/local/https-keys/example.com.crt',     // <https-certificate>
                    //     passphrase: 'dummy-passphrase',                      // <https-passphrase>
                    //     requestCert: false,                                  // false/true
                    //     rejectUnauthorized: false                            // false/true
                    // },
                    port: 443                                                   // 443 / <port-number>
                },
                www: {
                    enabled: false,                                 // false / true
                    redirectToNonWww: false                         // false / true
                },
                nonWww: {
                    enabled: false,                                 // false / true
                    iUnderstandNonWwwMayBeUnsafe: false,            // false / true
                                                                    // Even if 'nonWww.enabled' is set to 'true', 'iUnderstandNonWwwMayBeUnsafe' must be set to truthy value as well, to activate nonWww feature
                                                                    // References:
                                                                    //     - https://stackoverflow.com/questions/1417963/php-setcookie-for-domain-but-not-subdomains/1417979#1417979
                                                                    //     - http://www.yes-www.org/why-use-www/
                                                                    //     - https://news.ycombinator.com/item?id=11004396
                    redirectToWww: false                            // false / true
                                                                    // Note:
                                                                    //     example.com should get redirected to www.example.com, but canonical hostnames,
                                                                    //     like: localhost, user-laptop, 127.0.0.1, 192.168.193.10 would not get redirected
                }
            },
            devTools: {
                // networkDelay: {                                              // Random delay in network requests
                //     minimum: 0,                                              // <undefined-or-null> / <non-negative-integer>
                //     maximum: 0                                               // <undefined-or-null> / <non-negative-integer>
                // },
                // hardCodedResponsesForDebugging: [
                //     {
                //         pattern: '/dummy-data/test.json',                    // '<pattern>'
                //                                                              // If '<pattern>' is found anywhere in req.originalUrl, it would be considered a match
                //                                                              // '*' and 'all' would match all requests, 'none' or <falsy-value> would match none of the requests
                //         status: 200,                                         // 200 / <status-code>
                //         responseFile: path.join(__dirname, '../test/data/test.json'),
                //                                                              // The file would be read in sync and sent as the response
                //         type: 'json'                                         // If we use this, then comments would be stripped using 'cjson' before sending the response,
                //                                                              // to make the response a valid JSON
                //     }
                // ],
                sourceMaps: {
                    block: false,                                               // false / true
                    overrideBlockingWithAccessCode: false                       // false / <string-which-is-key> when 'sourceMaps.block: true'
                    // overrideBlockingWithAccessCode: 'ActivateSourceMapsMode'
                }
            },
            logger: {                                                           // Note: Do not use console.log() directly. Use it through the logger provided by ironplate.
                modes: {
                    saveToFile: {
                        enabled: false,                                         // false / true
                        directory: null,                                        // null / '<directory>' for storing log file
                        // directory: path.join(__dirname, '../logs/'),
                        fileName: null                                          // null / '*<format>*' (excluding quotes) to be used as log file's name
                        // fileName: 'logs-<yyyy-mm-dd>.log'
                    }
                },
                showLogLine: {
                    enabled: false,                                             // false / true - Show the file path and line number of code initiating the console log
                    showRelativePath: false                                     // false / true - Show only the relative path of the file w.r.t. project root
                }
            },
            workers: 1,                                                         // 1 / <number-of-workers>
            webpack: {
                useHotModuleReplacement: false                                  // false / true
            }
        }
    }
};

module.exports = config;
