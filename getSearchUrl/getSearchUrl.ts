
// Define some sources and keywords and fetch the related results for later scraper
export const handler = async () => {
  
  let keywords:string[]=['consumer spending on food','food industry competition','food industry players','public health crises impact on food industry'];
  const combinedKeywords: string = keywords.join(" OR ");

  const sources: string[] = ["https://www.euromonitor.com/*","https://www.foodsafetynews.com/*",'https://www.innovamarketinsights.com/*'];
  let results:string[]=[];
  const CSE_ID = "70f55c012579b4867";
  // Restrict date by :  dateRestrict=d1 (do not get enough data)  

  for (let i: number = 0; i < sources.length; i++) {
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${combinedKeywords}&siteSearchFilter=i&key=${API_KEY}&cx=${CSE_ID}&siteSearch=${sources[i]}&num=2&sort=Date`;

    const response = await fetch(googleSearchUrl, {
      method: "Get",
    });
    const json = await response.json();
    if (json.items!==undefined){
     const data = json.items.map((e:any) => ({ url: e.link,source:sources[i],keyword:[keywords],status:'IN QUEUE' }));
      results.push(...data)
    }
  }
  console.log(results)

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
};

handler()