#!/usr/bin/env node
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

var localIpAddresses = require('local-ip-addresses');

var hardCodedResponse = require('express-hard-coded-response'),
    networkDelay = require('express-network-delay'),
    redirectToWww = require('express-redirect-to-www'),
    redirectToHttps = require('express-redirect-to-https');

var ironplate = {};

ironplate.dependencies = {
    express: express,
    logger: logger
};

ironplate.start = function (projectRootFullPath, dependencies, receivedConfig, callbacks) {
    dependencies = dependencies || {};
    var express = dependencies.express || ironplate.dependencies.express,
        logger = dependencies.logger || ironplate.dependencies.logger;

    var defaultConfig = require('./config/default-config.js');

    receivedConfig = receivedConfig || {};

    if (!Object.keys(receivedConfig).length) {
        logger.warnHeading('Warning: No configuration was passed. Running the application with default configuration.');
    }

    var config = extend(true, {}, defaultConfig, receivedConfig);

    var _ironplateConfig = config.ironplate || {},
        _serverConfig = _ironplateConfig.server || {},
        _serverUrlConfig = _serverConfig.url || {},
        _httpServerConfig = _serverUrlConfig.http || {},
        _httpsServerConfig = _serverUrlConfig.https || {},
        _httpsSecretsAndSettings = _httpsServerConfig.secretsAndSettings || {};

    var staticDir = _serverConfig.publicDirectory;

    var emptyFn = function () {};
    var beforeSetup = callbacks.beforeSetup || emptyFn,
        afterSetup = callbacks.afterSetup || emptyFn;

    var exp = express();

    beforeSetup(config, exp);

    var _loggerConfig = _serverConfig.logger;
    if (_loggerConfig && (_loggerConfig.showLogLine || {}).enabled) {
        global._noteDown_showLogLine = true;
        if (!_loggerConfig.showLogLine.showRelativePath) {
            global._noteDown_basePath = projectRootFullPath;
        }
    }

    var networkDelayRange = _serverConfig.networkDelay || {};
    exp.use(networkDelay(networkDelayRange.minimum, networkDelayRange.maximum));

    if (_httpServerConfig.redirectToHttps) {
        exp.use(redirectToHttps({
            httpsPort: _httpsServerConfig.port,
            httpPort: _httpServerConfig.port
        }));
    }

    var _nonWwwConfig = _serverUrlConfig.nonWww || {};
    if (_nonWwwConfig.enabled && _nonWwwConfig.iUnderstandNonWwwMayBeUnsafe && _nonWwwConfig.redirectToWww) {
        exp.use(redirectToWww());
    }

    exp.use(helmet());

    if (staticDir) {
        exp.use(favicon(Path.join(staticDir, 'favicon.ico')));
    }

    var hardCodedResponsesForDebugging = _serverConfig.hardCodedResponsesForDebugging;
    if (hardCodedResponsesForDebugging) {
        exp.use(hardCodedResponse({ verbose: true, conditions: hardCodedResponsesForDebugging, baseDir: projectRootFullPath, console: logger }));
    }

    afterSetup(config, exp);

    if (staticDir) {
        // Setting static server
        exp.use(express.static(staticDir, {
            dotfiles: 'ignore',                 // "." folders should be not be accessible directly
            maxAge: 365 * 24 * 60 * 60 * 1000   // 1 year
        }));
    }

    var registerServer = function(protocol, portNumber, httpsConfig) {
        var server;
        if (protocol === 'http') {
            server = http.createServer(exp);
        } else {
            server = https.createServer(httpsConfig, exp);
        }

        server.listen(portNumber, function() {
            var host = os.hostname();
            var localhostPaths = [].concat(['localhost', _serverConfig.url.hostname.value, host]).concat(localIpAddresses);
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

    var useHttp = _httpServerConfig.enabled,
        useHttpPortNumber = _httpServerConfig.port,
        useHttps = _httpsServerConfig.enabled,
        useHttpsPortNumber = _httpsServerConfig.port;
    if (useHttps && useHttp && useHttpsPortNumber === useHttpPortNumber) {
        useHttp = false;
        logger.warn('Running in HTTPS mode only and not starting the HTTP mode (because both, HTTP and HTTPS are enabled, but have same port number in configuration)');
    }
    if (useHttps || useHttp) {
        if (useHttps) {
            // http://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node/21398485#21398485
            var httpsConfig = {
                key: fs.readFileSync(Path.join(projectRootFullPath, _httpsSecretsAndSettings.key)),
                cert: fs.readFileSync(Path.join(projectRootFullPath, _httpsSecretsAndSettings.cert)),
                passphrase: _httpsSecretsAndSettings.passphrase,    /* http://stackoverflow.com/questions/30957793/nodejs-apn-bad-password-read/33291482#33291482
                                                                       Also see: http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/ */
                requestCert: _httpsSecretsAndSettings.requestCert,
                rejectUnauthorized: _httpsSecretsAndSettings.rejectUnauthorized
            };
            registerServer('https', useHttpsPortNumber, httpsConfig);
        }
        if (useHttp) {
            registerServer('http', useHttpPortNumber);
        }
    } else {
        logger.warnHeading('Warning: HTTPS & HTTP, both the modes are disabled in the configuration');
    }
};

module.exports = ironplate;
