#!/usr/bin/env node

const express = require('express');
const optjs = require('optjs');
const { tstaticstoringproxy } = require('../index.js');

const options = optjs();
const destination = (options.opt.dest || options.opt.destination || options.opt.d) + '';
const dir = (options.opt.dir || options.opt.directory) + '';
if (!destination || !destination.startsWith('http://')) {
    console.log('missing parameter --destination=http://destination.de');
    return;
}
if (!dir) {
    console.log('missing parameter --directory=.');
    return;
}

if(options.opt.h || options.opt.help){
    console.log('usage:\n\ttstaticstoringproxy --port=3000 --destination=http://tnickel.de/ --dir=public');
}

const port = options.opt.port || options.opt.p || process.env.PORT || 3000;

const app = express();
app.listen(port, (err)=>{
    if(err) {
        console.log(err);
        return;
    }
    console.log({port, destination, dir})
});

app.use(tstaticstoringproxy({
    destination,
    dir
}));