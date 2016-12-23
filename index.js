#!/usr/bin/env node

var ironplate = {};

/*eslint-env node*/
'use strict';

var logger = require('note-down');

var Path = require('path'),
    os = require('os'),
    https = require('https'),
    http = require('http'),
    fs = require('fs');

var extend = require('extend'),
    _ = require('lodash'),
    express = require('express'),
    helmet = require('helmet'),
    favicon = require('serve-favicon');

var localIpAddresses = require('local-ip-addresses'),
    cascaded = require('cascaded');

var avoidWww = require('express-avoid-www'),
    networkDelay = require('express-network-delay'),
    redirectToHttps = require('express-redirect-to-https');

var ironplate = {};

(function () {
    ironplate.frequentDependencies = {
        express: express
    };

    ironplate.start = function (projectRootFullPath, optionsOrOptionsFilePath, callbacks) {
        var defaultOptions = cascaded(Path.join(__dirname, 'config', 'default-config.cjson')) || {};

        var receivedOptions;
        if (typeof optionsOrOptionsFilePath === 'string') {
            receivedOptions = cascaded(Path.join(projectRootFullPath, optionsOrOptionsFilePath));
        } else {
            receivedOptions = optionsOrOptionsFilePath;
        }
        receivedOptions = receivedOptions || {};

        if (!Object.keys(receivedOptions).length) {
            logger.warnHeading('Warning: No configuration was passed. Running the application with default configuration.');
        }

        var options = extend(true, {}, defaultOptions, receivedOptions);

        var _appOptions = options.app || {},
            _serverOptions = _appOptions.server || {},
            _httpServerOptions = _serverOptions.http || {},
            _httpsServerOptions = _serverOptions.https || {},
            _httpsSecretsAndSettings = _httpsServerOptions.secretsAndSettings || {};

        var staticDir = _appOptions.publicDirectory;

        var emptyFn = function () {};
        var beforeSetup = callbacks.beforeSetup || emptyFn,
            afterSetup = callbacks.afterSetup || emptyFn;

        var exp = express();

        beforeSetup(options, exp);

        if (options.logger && options.logger.showLogLine) {
            global._noteDown_showLogLine = true;
            if (!options.logger.showLogLineAbsolutePath) {
                global._noteDown_basePath = projectRootFullPath;
            }
        }

        var networkDelayRange = _serverOptions.networkDelay || {};
        exp.use(networkDelay(networkDelayRange.minimum, networkDelayRange.maximum));

        if (_httpServerOptions.redirectToHttps) {
            exp.use(redirectToHttps({
                httpsPort: _httpsServerOptions.port,
                httpPort: _httpServerOptions.port
            }));
        }

        if (!_serverOptions.allowWww) {
            exp.use(avoidWww());
        }

        exp.use(helmet());

        if (staticDir) {
            exp.use(favicon(Path.join(staticDir, 'favicon.ico')));
        }

        afterSetup(options, exp);

        if (staticDir) {
            // Setting static server
            exp.use(express.static(staticDir, {
                dotfiles: 'ignore',                 // "." folders should be not be accessible directly
                maxAge: 365 * 24 * 60 * 60 * 1000   // 1 year
            }));
        }

        var registerServer = function(protocol, portNumber, httpsOptions) {
            var server;
            if (protocol === 'http') {
                server = http.createServer(exp);
            } else {
                server = https.createServer(httpsOptions, exp);
            }

            server.listen(portNumber, function() {
                var host = os.hostname();
                var localhostPaths = [].concat(['localhost', _serverOptions.host, host]).concat(localIpAddresses);
                localhostPaths = _.uniq(localhostPaths);

                if (localhostPaths.length > 1) {
                    logger.verbose('This app can be accessed from any of the following paths:' + ' (' + protocol + ' protocol)');
                } else {
                    logger.verbose('This app can be accessed from the following path:' + ' (' + protocol + ' protocol)');
                }
                localhostPaths.forEach(function (localhostPath) {
                    logger.verbose('\t' + protocol + '://' + localhostPath + ':' + portNumber);
                });
            });
            return server;
        };

        var useHttp = _httpServerOptions.enabled,
            useHttpPortNumber = _httpServerOptions.port,
            useHttps = _httpsServerOptions.enabled,
            useHttpsPortNumber = _httpsServerOptions.port;
        if (useHttps && useHttp && useHttpsPortNumber === useHttpPortNumber) {
            useHttp = false;
            logger.warn('Running in HTTPS mode only and not starting the HTTP mode (because both, HTTP and HTTPS are enabled, but have same port number in configuration)');
        }
        if (useHttps || useHttp) {
            if (useHttps) {
                // http://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node/21398485#21398485
                var httpsOptions = {
                    key: fs.readFileSync(Path.join(projectRootFullPath, _httpsSecretsAndSettings.key)),
                    cert: fs.readFileSync(Path.join(projectRootFullPath, _httpsSecretsAndSettings.cert)),
                    passphrase: _httpsSecretsAndSettings.passphrase,    // http://stackoverflow.com/questions/30957793/nodejs-apn-bad-password-read/33291482#33291482
                                                                        // Also see: http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
                    requestCert: _httpsSecretsAndSettings.requestCert,
                    rejectUnauthorized: _httpsSecretsAndSettings.rejectUnauthorized
                };
                registerServer('https', useHttpsPortNumber, httpsOptions);
            }
            if (useHttp) {
                registerServer('http', useHttpPortNumber);
            }
        } else {
            logger.warnHeading('Warning: HTTPS & HTTP, both the modes are disabled in the configuration');
        }
    };
}());

module.exports = ironplate;
