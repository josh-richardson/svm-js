#!/usr/bin/env node
const os = require("os");
const path = require("path");
const exec = require('child_process').exec;

if (process.env.npm_config_global) {
    if (os.type() === 'Windows_NT') {
        console.log("CLI is not yet supported on Windows with svm-js. Please use https://github.com/josh-richardson/svm instead.")
    } else {
        exec("bash " + path.join(__dirname, 'source_svm.sh')).stdout.on('data', console.log);
    }
};