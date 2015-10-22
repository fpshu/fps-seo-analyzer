var analyzer = {
	
	doc : null,
    url : null,
	tasks : ['checkMeta','checkHeadings','checkImages','checkLinks','checkRequests'],
	response : [],
	
    /* HELPER FUNCTIONS */
    
	/**
	* Add a response line to the output
	* l: headline
	* r: source code (if needed)
	* d: the line description, the main element
	* i: icon (info|success|warning|error)
	*/
    addResponse : function(l,r,d,i){
        this.response.push({label : l, result : r, description: d, icon : i});
    },
    
    getMetaContentByName : function(name){
        var e = this.doc.querySelector("meta[name='"+name+"']");
        if(e){
            return e.getAttribute('content');
        } else {
            return false;
        }
    },
	
	getMetaContentByProperty : function(name){
        var e = this.doc.querySelector("meta[property='"+name+"']");
        if(e){
            return e.getAttribute('content');
        } else {
            return false;
        }
    },
    
    /* SEO ANALYZE FUNCTIONS */
    
    checkMeta : function(){
        this.addResponse('Meta proterties',null,null,null);
        // check title and its length
        var title = this.doc.getElementsByTagName('title')[0] ? this.doc.getElementsByTagName('title')[0].innerText : '';
        this.addResponse(null,null,title.length ? 'meta title : ' + title.length + ' characters' : 'meta title not set!' ,(title.length > 70 ? 'warning' : title.length ? 'success' : 'error'));
        // check description
        var d = this.getMetaContentByName('description');
        var di = 'success';
        var dd = d.length ? 'meta description: ' + d.length + ' characters' : 'meta description not set!';
        if(d && d.length > 155){
            di = 'warning';
        }
        if(!d){
            di = 'error';
        }
        this.addResponse(null,null,dd,di);
        // check og meta
        var og = {
            t : this.getMetaContentByProperty('og:title'),
            d : this.getMetaContentByProperty('og:description'),
            i : this.getMetaContentByProperty('og:image'),
            u : this.getMetaContentByProperty('og:url')
        };
        this.addResponse('OpenGraph meta',null,null,null);
        this.addResponse(null,null,'og:title' + (og.t ? ' set' : ' not set'),(og.t ? 'success' : 'warning'));
        this.addResponse(null,null,'og:description' + (og.d ? ' set' : ' not set'),(og.d ? 'success' : 'warning'));
        this.addResponse(null,null,'og:image' + (og.i ? ' set' : ' not set'),(og.i ? 'success' : 'warning'));
        this.addResponse(null,null,'og:url' + (og.u ? ' set' : ' not set'),(og.u ? 'success' : 'warning'));
    },
    
    checkHeadings : function(){
        this.addResponse('Headings',null,null,null);
        var h1s = this.doc.getElementsByTagName('h1');
        var h2s = this.doc.getElementsByTagName('h2');
        var h3s = this.doc.getElementsByTagName('h3');
        var h4s = this.doc.getElementsByTagName('h4');
        var h5s = this.doc.getElementsByTagName('h5');
        this.addResponse(null,null,'number of H1\'s : <b>' + h1s.length + '</b>',(h1s.length > 1 ? 'warning' : 'info'));
        this.addResponse(null,null,'number of H2\'s : <b>' + h2s.length + '</b>','info');
        this.addResponse(null,null,'number of H3\'s : <b>' + h3s.length + '</b>','info');
        if(h4s.length) this.addResponse(null,null,'number of H4\'s : <b>' + h4s.length + '</b>','info');
        if(h5s.length) this.addResponse(null,null,'number of H5\'s : <b>' + h5s.length + '</b>','info');
    },
	
    checkImages : function(){
        this.addResponse('Images',null,null,null);
        var images = this.doc.getElementsByTagName('img');
        if(images.length){
            var noalt = 0;
            for(var i = 0; i < images.length; i++){
                var item = images[i];
                if(!item.getAttribute('alt')) noalt++;
            };
            this.addResponse(null,null,images.length + ' images found','info');
            if(noalt){
                this.addResponse(null,null,noalt + ' images without alt attribute','warning');
            } else {
                this.addResponse(null,null,'all images has alt attribute','success');
            }
        } else {
            this.addResponse(null,null,'no images found','info');
        }
    },
    
    checkLinks : function(){
        this.addResponse('Links',null,null,null);
        var links = this.doc.getElementsByTagName('a');
        var regExp = new RegExp("//" + location.host + "($|/)");
        if(links.length){
            var nofollows = 0;
            var external = 0;
            var notitles = 0;
            for(var i = 0; i < links.length; i++){
                var href = links[i].href;
                var isLocal = (href.substring(0,4) === "http") ? regExp.test(href) : true;
                if(links[i].getAttribute('rel') && links[i].getAttribute('rel') == 'nofollow'){
                    nofollows++;
                }
                if(!links[i].getAttribute('title')){
                    notitles++;
                }
                if(!isLocal){
                    external++;
                }
            }
            if(external){
                this.addResponse(null,null,links.length + ' links found','info');
                this.addResponse(null,null,(links.length - external) + ' internal links','info');
                this.addResponse(null,null,external + ' external links' + (nofollows ? ' with ' + nofollows + ' nofollow attribute' : ''),'info');
            } else {
                this.addResponse(null,null,links.length + ' links found, internal only','info');
            }
            if(notitles){
                this.addResponse(null,null,notitles + ' links has no title attribute!','warning');
            } else {
                this.addResponse(null,null,'all link has title attribute','success');
            }
        } else {
            this.addResponse(null,null,'no links found','info');
        }
    },
    
    checkAnalytics : function(){
        this.addResponse('Analytics',null,null,null);
        var patterns = {
            'Webaudit' : [/median_webaudit/i , /Medián/i, /WebAudit/i],
            'Google Analytics' : [/ga.js/i, /google-analytics/i],
            'Gemius' : [/gemius/i]
        };
        var scripts = this.doc.getElementsByTagName('script');
        var found = {};
        for(var i in patterns){
            var this_script = scripts[i];
            var this_href = this_script.getAttribute('href');
            
            for(var j in this.patterns){
                console.log(patterns[j]);
                if(this_href){
                    if(this_script.getAttribute('href').search()){
                        //foo
                    }
                } 
            }
            
        }
        
    },
    
    checkRequests : function(){
        this.addResponse('Performance',null,null,null);
        
		var scriptArray = this.doc.getElementsByTagName('script');
		var scriptCount = 0;
		var styleCount = this.doc.querySelectorAll("link[rel='stylesheet']").length;
		
		for(var i = 0; i < scriptArray.length; i++){
			if(scriptArray[i].src) {
				scriptCount++;
			}
		}
		
		if(scriptCount) this.addResponse(null,null,scriptCount + ' scripts loaded','info');
		if(styleCount) this.addResponse(null,null,styleCount + ' css file loaded','info');
        this.addResponse(null,null,'<a href="https://developers.google.com/speed/pagespeed/insights/?url=' + encodeURIComponent(this.url) + '" target="_blank"><span class="icon external regular"></span>Google PageSpeed</a>',null);
        
    },
	
	/* SEO ANALYZE FUNCTIONS END */
    
	process : function(source,lnk){
		this.doc = source;
        this.url = lnk;
		for(var i = 0; i< this.tasks.length; i++){
			this[this.tasks[i]]();
		}
		return this.response;
	}
	
}

chrome.extension.sendMessage({
    action: "analyzePage",
    source: analyzer.process(document,location.href)
});