// This is the default configuration file

// See ./config.example.js for further details

let config = {
    "ironplate": {
        "server": {
            "publicDirectory": null,
            "url": {
                "hostname": {
                    "value": null,
                    "warnOnOtherHostnames": false,
                    "redirectToSpecifiedHostname": false
                },
                "http": {
                    "enabled": false,
                    "port": 80,
                    "redirectToHttps": false
                },
                "https": {
                    "enabled": false,
                    "port": 443
                },
                "www": {
                    "enabled": false,
                    "redirectToNonWww": false
                },
                "nonWww": {
                    "enabled": false,
                    "iUnderstandNonWwwMayBeUnsafe": false,
                    "redirectToWww": false
                }
            },
            "devTools": {
                "networkDelay": {},
                "sourceMaps": {
                    "block": false,
                    "overrideBlockingWithAccessCode": false
                }
            },
            "logger": {
                "modes": {
                    "saveToFile": {
                        "enabled": false,
                        "file": null
                    }
                },
                "showLogLine": {
                    "enabled": false,
                    "showRelativePath": false
                }
            },
            "workers": 1,
            "hardCodedResponsesForDebugging": [],
            "webpack": {
                "useHotModuleReplacement": false
            }
        }
    }
};

module.exports = config;
