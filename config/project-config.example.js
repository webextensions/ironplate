// This is an example config file
// In the project directory, place a configuration file like this and load it to pass the configuration to 'ironplate'

const config = {
    // Check out './default-config.js' for detailed ironplate config
    ironplate: {
        server: {
            url: {
                hostname: {
                    value: 'example.com',
                    warnOnOtherHostnames: true
                },
                http: {
                    enabled: true,
                    port: 8000
                },
                www: {
                    enabled: true
                },
                nonWww: {
                    enabled: true,
                    iUnderstandNonWwwMayBeUnsafe: true,
                    redirectToWww: true
                }
            },
            logger: {
                showLogLine: {
                    enabled: true,
                    showRelativePath: true
                }
            },
            webpack: {
                useHotModuleReplacement: true
            }
        }
    }
};

module.exports = config;
