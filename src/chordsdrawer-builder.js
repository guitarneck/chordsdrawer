#!/usr/bin/env node

"use strict";

const uglifyjs  = require('uglify-js'),
      uglifycss = require('uglifycss'),
      fs        = require('fs'),
      path      = require('path');

const handlebars  = require('handlebars'),
      through     = require('through2');

const config    = require(__dirname+'/builders-config.json');

let entries = {}, ugli;

const options = {
    warnings    : false,//'verbose',
    compress    : true,
    mangle      : true,
    keep_fnames : true,
    output:{
        beautify:false
    }
};

const cacheFileName = 'src/chordsdrawer-builder-cache.json',
      enc = {encoding:'utf8'};

function
create_entries ( files )
{
    let entries = {};
    for ( let file in files )
    {
        file = files[file];
        entries[path.basename(file)] = fs.readFileSync( file ,enc );
    }
    return entries;
}

/**
 * HTML-Builders
 */

const killCache = (new Date()).getTime();

handlebars.registerHelper('kill-cache' ,function() {
    return new handlebars.SafeString(killCache);
});

console.time('HTML-Builder');
fs.createReadStream(__dirname+'/chordsdrawer/chordsdrawer-template.html')
  .pipe(
    through.obj(function ( buffer ,enc ,callback ) {
        const template = handlebars.compile(buffer.toString(enc),{noEscape:true});
        callback( null ,Buffer.from(template({}) ,enc) );
    })
  )
  .pipe(fs.createWriteStream('chordsdrawer.html'))
  .on( 'close', function () { console.log("chordsdrawer.html created"); console.timeEnd('HTML-Builder'); } )
  .on( 'error', function () { console.error("chordsdrawer.html failed !"); } );

/**
 * DOM-Builders
 */
console.time('DOM-Helpers.js');
const dbpath = 'src/DOM-Helpers/';
entries = create_entries([
    dbpath+'DOM-Helpers.js'
]);

try
{
    ugli = uglifyjs.minify( entries ,options );
    if ( typeof ugli.error != 'undefined') console.log(ugli.error.message+' at '+ugli.error.filename, ugli.error.line+':'+ugli.error.col);
    else
    if ( typeof ugli.warnings != 'undefined') console.log(ugli.warnings);
    else
    fs.writeFile(config.options.destJS+'DOM-Helpers.js' ,ugli.code ,enc ,function(err){
        if (err) {
            console.error("DOM-Helpers.js failed !");
        } else {
            console.log("DOM-Helpers.js created");
            console.timeEnd('DOM-Helpers.js');
        }
    });
}
catch (e)
{
  console.error(e.message, e.filename, e.line,':',e.col,' ',e.pos);
}


/**
 * ChordsMaker
 */
console.time('ChordsDrawer.cls.js');
const cdpath = 'src/chordsdrawer/';
entries = create_entries([
    cdpath+'utils.lib.js',
    cdpath+'StringsSet.cls.js',
    cdpath+'Chord.cls.js',
    cdpath+'Song.cls.js',
    cdpath+'Editor.cls.js',
    cdpath+'Composer.cls.js',
    cdpath+'CDFile.cls.js',
    cdpath+'ChordsDrawer.cls.js'
]);

try
{
    ugli = uglifyjs.minify( entries ,options );
    if ( typeof ugli.error != 'undefined') console.log(ugli.error.message+' at '+ugli.error.filename, ugli.error.line+':'+ugli.error.col);
    else
    if ( typeof ugli.warnings != 'undefined') console.log(ugli.warnings);
    else
    fs.writeFile(config.options.destJS+'ChordsDrawer.cls.js' ,ugli.code ,enc ,function(err){
        if (err) {
            console.error("ChordsDrawer.cls.js failed !");
        } else {
            console.log("ChordsDrawer.cls.js created");
            console.timeEnd('ChordsDrawer.cls.js');
        }
    });
}
catch (e)
{
  console.error(e.message, e.filename, e.line,':',e.col,' ',e.pos);
}

/**
 * ui
 */
console.time('ChordsDrawerUI.js');
const uipath = 'src/interface/';
entries = create_entries([
    uipath+'ui.js',
    uipath+'song-ui.js',
    uipath+'edition-buttons-ui.js',
    uipath+'edition-actions-ui.js',
    uipath+'edition-ui.js'
]);

try
{
    ugli = uglifyjs.minify( entries ,options );
    if ( typeof ugli.error != 'undefined') console.log(ugli.error.message+' at '+ugli.error.filename, ugli.error.line+':'+ugli.error.col);
    else
    if ( typeof ugli.warnings != 'undefined') console.log(ugli.warnings);
    else
    fs.writeFile(config.options.destJS+'ChordsDrawerUI.js' ,ugli.code ,enc ,function(err){
        if (err) {
            console.error("ChordsDrawerUI.js failed !");
        } else {
            console.log("ChordsDrawerUI.js created");
            console.timeEnd('ChordsDrawerUI.js');
        }
    });
}
catch (e)
{
  console.error(e.message, e.filename, e.line,':',e.col,' ',e.pos);
}

/**
 * css
 */
console.time('chordsdrawer.css');
entries = [
    cdpath+'chordsdrawer.css'
];

try
{
    ugli = uglifycss.processFiles(entries);
    if ( ugli != '' )
    {
        fs.writeFile(config.options.destCSS+'chordsdrawer.css' ,ugli ,enc ,function(err){
            if (err) {
                console.error("chordsdrawer.css failed !");
            } else {
                console.log("chordsdrawer.css created");
                console.timeEnd('chordsdrawer.css');
            }
        });
    }
}
catch (e)
{
  console.error(e.message, e.filename, e.line,':',e.col,' ',e.pos);
}

console.time('chordsdrawerui.css');
entries = [
    uipath+'chordsdrawerui.css'
];

try
{
    ugli = uglifycss.processFiles(entries);
    if ( ugli != '' )
    {
        fs.writeFile(config.options.destCSS+'chordsdrawerui.css' ,ugli ,enc ,function(err){
            if (err) {
                console.error("chordsdrawerui.css failed !");
            } else {
                console.log("chordsdrawerui.css created");
                console.timeEnd('chordsdrawerui.css');
            }
        });
    }
}
catch (e)
{
  console.error(e.message, e.filename, e.line,':',e.col,' ',e.pos);
}