#!/usr/bin/env node
const os = require("os");
const path = require("path");
const exec = require('child_process').exec;

if (process.env.npm_config_global) {
    if (os.type() === 'Windows_NT') {
        // not yet supported
    } else {
        exec("bash " + path.join(__dirname, 'source_svm.sh')).stdout.on('data', console.log);
    }
};