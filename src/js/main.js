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
import makeTables from './makeTables'
import makeArticles from './makeArticles'
import makeFurniture from './makeFurniture'
import Sticky from 'sticky-js'
import * as d3 from 'd3'

var debug = false;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);    

    var params = parseURL(el);
    if(params.key){
        //load data if key is found
        loadConfig(params);
    } else {
        //error if key is not found
        document.body.innerHTML = '<h1>Please enter a key in the alt text of the embed or as a param on the url in the format "key=""</h1>';
    }

    function loadConfig(params) {
        reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/' + params.key + '.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
                // (debug) ? console.log(resp) : null;
                renderResults(resp)
            }
        })
    
    }

    function renderResults(configData) {

        //Make the header

        makeHeader(debug);

        //Add various bits of

        makeFurniture(debug,configData.sheets.furniture);

        //Make the results charts - this spreadsheet reference is always the same

        reqwest({
            url: 'https://interactive.guim.co.uk/docsdata/1-hIlthccTseJ-ri_fVoFoqcWOQAg2H4PpJPXoebuSq0.json',
            type: 'json',
            crossOrigin: true,
            success: function(resp) { 
                // (debug) ? console.log(resp) : null;
                makeTwopp(debug,resp);
                makeVoting(debug,resp);
                makeApproval(debug,resp);
                makePreferred(debug,resp);

            }
        })

        // Make tables and news blocks
        // console.log("configData", configData);
        makeArticles(debug, configData.sheets.config);
        makeTables(debug, configData.sheets.config);
        //Sticky nav

        var sticky = new Sticky('.sticky');
       

    }

}
