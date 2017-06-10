// This is an example configuration file

let publicDirectory = "http-pub",
    useHMR = true;                                              // Short for useHotModuleReplacement

let config = {
    "ironplate": {
        "server": {
            "publicDirectory": publicDirectory,                 // <public-path>
            "url": {
                "hostname": {
                    "value": "example.com",                     // The application is supposed to be accessed using this hostname
                    "warnOnOtherHostnames": false,              // Warn if the application is being accessed using hostname other than the one specified in "hostname.value"
                    "redirectToSpecifiedHostname": false        // false (default) / true
                                                                // If the application is loaded from a URL which is not matching the property
                                                                // "hostname.value" (eg: when application is being accessed from localhost or IP address),
                                                                // then should it redirect to the specified "hostname.value"
                },
                "http": {
                    "enabled": true,                            // false (default) / true
                    "port": 8000,                               // 80 / <port-number>
                    "redirectToHttps": false                    // false (default) / true
                },
                "https": {
                    "enabled": false,                           // false (default) / true
                    "port": 9000                                // 443 / <port-number>
                },
                "www": {
                    "enabled": true,                            // false (default) / true
                    "redirectToNonWww": false                   // false (default) / true
                },
                "nonWww": {
                    "enabled": true,                            // false (default) / true
                    "iUnderstandNonWwwMayBeUnsafe": true,       // false (default) / true
                                                                // Even if "nonWww.enabled" is set to "true", "iUnderstandNonWwwMayBeUnsafe" must be set to truthy value as well, to activate nonWww feature
                                                                // References:
                                                                //     - https://stackoverflow.com/questions/1417963/php-setcookie-for-domain-but-not-subdomains/1417979#1417979
                                                                //     - http://www.yes-www.org/why-use-www/
                                                                //     - https://news.ycombinator.com/item?id=11004396
                    "redirectToWww": true                       // false (default) / true
                                                                // Note:
                                                                //     example.com should get redirected to www.example.com, but canonical hostnames,
                                                                //     like: localhost, user-laptop, 127.0.0.1, 192.168.193.10 would not get redirected
                }
            },
            "devTools": {
                // "networkDelay": {                            // Random delay in network requests
                //     "minimum": 0,                            // <undefined-or-null> / <non-negative-integer>
                //     "maximum": 0                             // <undefined-or-null> / <non-negative-integer>
                // },
                "sourceMaps": {
                    "block": true,                                              // false (default) / true
                    "overrideBlockingWithAccessCode": "ActivateSourceMapsMode"  // false (default) / <string-which-is-key>
                }
            },
            "logger": {                                         // Note: Do not use console.log() directly. Use it through the logger provided by ironplate.
                "modes": {
                    "saveToFile": {
                        "enabled": true,                        // false (default) / true
                        "file": "./temp/logs-<yyyy-mm-dd>.log"  // "*<format>*" (excluding double-quotes) to be used as file path and name
                    }
                },
                "showLogLine": {
                    "enabled": true,                            // false (default) / true - Show the file path and line number of code initiating the console log
                    "showRelativePath": true                    // false (default) / true - Show only the relative path of the file w.r.t. project root
                }
            },
            "workers": 1,                                       // 1 (default) / <number-of-workers>
            "hardCodedResponsesForDebugging": [
                {
                    "pattern": "/dummy-data/test.json",         // "<pattern>"
                                                                // If "<pattern>" is found anywhere in req.originalUrl, it would be considered a match
                                                                // "*" and "all" would match all requests, "none" or <falsy-value> would match none of the requests
                    "status": 200,                              // 200 (default) / <status-code>
                    "responseFile": "./test/data/test.json",    // The file would be read in sync and sent as the response (path w.r.t. project root)
                    "type": "json"                              // If we use this, then comments would be stripped using "cjson" before sending the response,
                                                                // to make the response a valid JSON
                }
            ],
            "webpack": {
                "useHotModuleReplacement": useHMR               // false (default) / true
            }
        }
    }
};

module.exports = config;

/*
// Old format:
{
    "app": {
        "server": {
            "https": {
                "secretsAndSettings": {                                         // https://nodejs.org/api/tls.html
                    "key": "config/local/https-keys/example.com.key",           // <https-key>
                    "cert": "config/local/https-keys/example.com.crt",          // <https-certificate>
                    "passphrase": "dummy-passphrase",                           // <https-passphrase>
                    "requestCert": false,                                       // false/true
                    "rejectUnauthorized": false                                 // false/true
                }
            }
        }
    }
}
*/
