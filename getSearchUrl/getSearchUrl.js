"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    let keywords = ['consumer spending on food', 'food industry competition', 'food industry players', 'public health crises impact on food industry'];
    const combinedKeywords = keywords.join(" OR ");
    const sources = ["https://www.euromonitor.com/*", "https://www.foodsafetynews.com/*", 'https://www.innovamarketinsights.com/*'];
    let results = [];
    const CSE_ID = "70f55c012579b4867";
    const API_KEY = 'AIzaSyBDsxJwdVAVMhNqHEZINgvRENj0gz-oC3o';
    // Restrict date by :  dateRestrict=d1 (do not get enough data)  
    for (let i = 0; i < sources.length; i++) {
        const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${combinedKeywords}&siteSearchFilter=i&key=${API_KEY}&cx=${CSE_ID}&siteSearch=${sources[i]}&num=2&sort=Date`;
        const response = yield fetch(googleSearchUrl, {
            method: "Get",
        });
        const json = yield response.json();
        if (json.items !== undefined) {
            const data = json.items.map((e) => ({ url: e.link, source: sources[i], keyword: [keywords], status: 'IN QUEUE' }));
            results.push(...data);
        }
    }
    console.log(results);
    // const postResponse = await fetch(postUrl, {
    //   method: 'POST',
    //   body: results,
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // if (postResponse.ok) {
    //   console.log('Data successfully posted ');
    // } else {
    //   console.error('Error');
    // }
});
exports.handler = handler;
(0, exports.handler)();
