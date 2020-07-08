const express = require('express');
const fs = require('fs').promises;
const fetch = require('node-fetch');

module.exports.tstaticstoringproxy = function({destination, dir}){
    const app = express.Router();


    app.use(express.static(dir))

    app.get('*', async (req, res) => {
        console.log(destination + req.url)
        const r = await fetch(destination + req.url);
        const data = await r.buffer();
        try{
            await save(req.url, data)
        }catch(err){
            console.log(err)
        }
        res.setHeader('content-type', r.headers.get('content-type'))
        res.send(data)
    })

    var extensions = ['jpg','jpeg','png','ico','bmp','js','css','html','htm','woff','mp4','mp4','ogg','wav']

    /**
     * 
     * @param {string} fileName 
     */
    function isFileName(fileName){
        if(typeof fileName !== 'string') throw new Error('filename need to be a string, not '+typeof fileName);
        if(!fileName.includes('.'))return false;
        if(fileName.includes('?')) {
            fileName = fileName.split('?')[0]
        }
        var extension = fileName.substr(fileName.lastIndexOf('.')+1);
        console.log(extension)
        return extensions.includes(extension.toLowerCase());
    }

    /**
     * 
     * @param {string} url 
     * @param {Buffer | string} data 
     */
    async function save(url, data) {
        if(url.includes('#')){
            url = url.split('#')[0];
        }
        const [_, ...path] = url.split('/');
        var fileName = path.pop();
        console.log({path,fileName,url});

        if (!isFileName(fileName)) {
            console.log('not a fileName', fileName)
            path.push(fileName);
            fileName = 'index.html';
        }

        if(fileName.includes('?')){
            fileName = fileName.substr(0,fileName.indexOf('?'))
        }

        var chunk=''
        for(var i = 0; i < path.length; i++) {
            chunk+='/'+path[i];
            var stat;
            try{
                stat = await fs.stat(dir + chunk);
            }catch(err){}

            //console.log(stat)
            if(!stat){
                await fs.mkdir(dir+chunk);
                continue;
            }

            if(stat.isDirectory()){
                continue;
            } else if(stat.isFile()) {
                throw new Error('should be a directory')
            }

            throw new Error('some other issue')
        }



        
        await fs.writeFile(dir + '/' + path.join('/')+'/'+fileName, data, (err) => console.log(err));

    }

    return app;
}