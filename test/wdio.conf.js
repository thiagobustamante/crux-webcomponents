'use strict'

exports.config = {
    specs: [
        './test/**/*.spec.ts'
    ],
    capabilities: [
        {
            browserName: 'chrome'
        }
    ],
    //------- SauceLabs Configuration -----
    services: ['sauce'],
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    sauceConnect: true,
    //------------------------------------
    exclude: [],
    maxInstances: 5, // it depends on the plan of the cloud servvice
    sync: true,
    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'error',
    coloredLogs: true,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './errorShots/',
    waitforTimeout: 60000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        compilers: ['ts:ts-node/register'],
        requires: ['source-map-support/register'],
        timeout: 60000
    },
    onPrepare: function (config, capabilities) {
        console.log('Registering typescript')
        require('ts-node/register');
    }
};
