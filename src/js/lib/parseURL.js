export default function parseURL(el){
    var urlParams; 
    var params = {};

    if(el.getAttribute('data-alt')){
        //pull params from alt tag of bootjs
        urlParams = el.getAttribute('data-alt').split('&');
        params.liveLoad = false;
    } else if(urlParams === undefined){
        //if doesn't exist, pull from url param
        urlParams = window.location.search.substring(1).split('&');
        //set live load so that data loads directly from google spreadsheets for speedy editing
        params.liveLoad = true;
    }
    
    urlParams.forEach(function(param){
     
        if (param.indexOf('=') === -1) {
            params[param.trim()] = true;
        } else {
            var pair = param.split('=');
            params[ pair[0] ] = pair[1];
        }
        
    });
    
    return params;
}