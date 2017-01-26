import reqwest from 'reqwest'
import chartHTML from './text/chart.html!text'
import tableHTML from './text/table.html!text'
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
import iframeMessenger from 'guardian/iframe-messenger'
import * as d3 from 'd3'

var debug = false;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

window.init = function init(el, config) {

    iframeMessenger.enableAutoResize();
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

                if (params.embedType === "chart") {
                    el.innerHTML = chartHTML.replace(/%assetPath%/g, config.assetPath);
                }

                else if (params.embedType === "table") {
                    el.innerHTML = tableHTML.replace(/%assetPath%/g, config.assetPath);
                }
                
                renderResults(resp,params.embedType,params.embedID);
            }
        })
    
    }

    function renderResults(configData,embedType,embedID) {

        var docWidth = window.innerWidth;
        var mobile = false;

        if (docWidth < 740) {
            mobile = true;
        } 

        if (embedType === "chart") {
                
                reqwest({
                    url: 'https://interactive.guim.co.uk/docsdata/1-hIlthccTseJ-ri_fVoFoqcWOQAg2H4PpJPXoebuSq0.json',
                    type: 'json',
                    crossOrigin: true,
                    success: function(resp) { 
                        
                        if (embedID === "twoPP") {
                            makeTwopp(debug,resp,mobile,true); 
                        }

                        else if (embedID === "votingIntention") {
                            makeVoting(debug,resp, mobile,true);
                        }

                        else if (embedID === "preferredPM") {
                            makePreferred(debug,resp, mobile,true);
                        }

                        else if (embedID === "approvalRating") {
                            makeApproval(debug,resp, mobile,true);
                        }
                        

                    }
                })
        }

        else if (params.embedType === "table") {
            makeTables(debug, configData.sheets,embedID,true);
        }

    }
};
