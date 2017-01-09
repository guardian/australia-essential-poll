import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import share from './lib/share'
import parseURL from './lib/parseURL'
import fetchJSON from './lib/fetch'
import makeHeader from './makeHeader'
import makeTwopp from './makeTwopp'
import makeVoting from './makeVoting'
import makeApproval from './makeApproval'
import makePreferred from './makePreferredPM'
import * as d3 from 'd3'

var debug = true;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);    

    var params = parseURL(el);
    if(params.key){
        //load data if key is found
        loadConfig(params);
    } else {
        //error if key is not found
        dom.innerHTML = '<h1>Please enter a key in the alt text of the embed or as a param on the url in the format "key=""</h1>';
    }

    function loadConfig(params) {
        reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/' + params.key + '.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
                (debug) ? console.log(resp) : null;
                renderResults(resp)
            }
        })
    
    }

    function renderResults(configData) {

        //Make the header

        makeHeader(debug);

        //Make the results charts 

        reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/1-hIlthccTseJ-ri_fVoFoqcWOQAg2H4PpJPXoebuSq0.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
                (debug) ? console.log(resp) : null;
                makeTwopp(debug,resp);
                makeVoting(debug,resp);
                makeApproval(debug,resp);
                makePreferred(debug,resp);
            }
        })


    }

}
