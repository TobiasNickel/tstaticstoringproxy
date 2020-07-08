# store static proxy

This proxy server is made to store static assets to your filesystem. I found compiling vscode can be a pain in the ass, it only worked on my mac, So using this service I want to record the assets info fileSystem, so i can service it later from an other server.

I and I thought this might be handy for more purposes, so I made it a module. An other use case is to download a website, but only the parts you want by simply navigating though the page. 

```sh
usage:
  tstaticcachingproxy -d=http://tnickel.de/ --dir=public -p=3000


```

