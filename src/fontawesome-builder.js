#!/usr/bin/env node

"use strict";

const handlebars  = require('handlebars'),
      through     = require('through2'),
      fs          = require('fs'),
    
      toSource    = require('tosource'),
    
      fontawesome = require('@fortawesome/fontawesome');

const uglifyjs    = require('uglify-js'),
      uglifycss   = require('uglifycss');
/*
 * The font to be added
 */
const config = require(__dirname+'/builders-config.json');

/*
 * Context
 */
let context = {
    'fontawesome-icon-fab'    :[/*{iconName:"" ,icon:""}*/],
    'fontawesome-icon-far'    :[/*{iconName:"" ,icon:""}*/],
    'fontawesome-icon-fas'    :[/*{iconName:"" ,icon:""}*/]
};

for ( let all in config )
{
    if ( all === "options" ) continue;

    const prefix = config[all].prefix;

    for ( let icons in config[all].icons )
    {
        const icon = config[all].icons[icons];
        const Ø = require('@fortawesome/fontawesome-' + all + '/' + icon);

        context['fontawesome-icon-'+prefix].push({
            iconName:Ø.iconName,
            icon:Ø.icon.map(function(v){return toSource(v,null,'')})
        });

    }
}

/*
 * Helpers
 */

handlebars.registerHelper('fontawesome-css' ,function() {
    return new handlebars.SafeString(fontawesome.dom.css());
});

function
fontawesomeIcon (items ,options)
{
    let out = '';
    for ( let i=0 ,l=items.length ; i<l ; i++ )
    {
        out += options.fn(items[i]) + ',';
    }
    return new handlebars.SafeString(out);
}

handlebars.registerHelper('fontawesome-icon-fab' ,fontawesomeIcon);
handlebars.registerHelper('fontawesome-icon-far' ,fontawesomeIcon);
handlebars.registerHelper('fontawesome-icon-fas' ,fontawesomeIcon);

/*
 * CSS
 */

    console.time('fontawesome.css');
    fs.createReadStream(__dirname+'/fontawesome/fontawesome-template.css')
    .pipe(
        through.obj(function ( buffer ,enc ,callback ) {
            const template = handlebars.compile(buffer.toString(enc),{noEscape:true});
            callback( null ,Buffer.from(template({}) ,enc) );
        })
    )
    .pipe(
        through.obj(function ( buffer ,enc ,callback ) {
            callback( null ,Buffer.from(uglifycss.processString(buffer.toString(enc)) ,enc) );
        })
    )
    .pipe(fs.createWriteStream(config.options.destCSS+'/fontawesome.css'))
    .on( 'close', function () { console.log("fontawesome.css created"); console.timeEnd('fontawesome.css'); } )
    .on( 'error', function () { console.error("fontawesome.css failed !"); } );

/*
 * JS
 */

    console.time('fontawesome-svg.js');
    fs.createReadStream(__dirname+'/fontawesome/fontawesome-template.js')
    .pipe(
        through.obj(function ( buffer ,enc ,callback ) {
            const template = handlebars.compile(buffer.toString(enc),{noEscape:true});
            callback( null ,Buffer.from(template(context) ,enc) );
        })
    )
    .pipe(
        through.obj(function ( buffer ,enc ,callback ) {
            callback( null ,Buffer.from(uglifyjs.minify(buffer.toString(enc)).code ,enc) );
        })
    )
    .pipe(fs.createWriteStream(config.options.destJS+'/fontawesome-svg.js'))
    .on( 'close', function () { console.log("fontawesome-svg.js created"); console.timeEnd('fontawesome-svg.js'); } )
    .on( 'error', function () { console.error("fontawesome-svg.js failed !"); } );

  console.time('fontawesome.js');
  fs.createReadStream(__dirname+'/fontawesome/fontawesome.js')
    .pipe(
        through.obj(function ( buffer ,enc ,callback ) {
            callback( null ,Buffer.from(uglifyjs.minify(buffer.toString(enc)).code ,enc) );
        })
    )
    .pipe(fs.createWriteStream(config.options.destJS+'/fontawesome.js'))
    .on( 'close', function () { console.log("fontawesome.js copied"); console.timeEnd('fontawesome.js'); } )
    .on( 'error', function () { console.error("fontawesome.js failed !"); } );
