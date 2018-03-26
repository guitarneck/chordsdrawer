#!/usr/bin/env node

"use strict";

const fs          = require('fs'),
      uglifycss   = require('uglifycss');
/*
 * Config
 */
const config = require(__dirname+'/builders-config.json');

var normalizecss    = require.resolve('normalize.css/normalize.css');

console.time('normalize.css');
fs.writeFile(config.options.destCSS+'/normalize.css' ,uglifycss.processFiles([normalizecss]) ,function(err)
{
    if (err)
    {
        console.error("normalize.css failed !");
    } else {
        console.log("normalize.css created"); console.timeEnd('normalize.css');
    }
});
    
