import OpenAI from "openai";
const openai = new OpenAI();

// In production, this could be your backend API or an external API
function getExternalFactor(externalFactors,factor,reason,keywords,percentage) {
    
    console.log(externalFactors)
    console.log("this is just input")

    const prompt11= `I am a restaurant business located in Bauamtsgasse 7, 69117 Heidelberg, 
    Germany  and this is the description of my business. Please tell me which are the 
    Top 5 key forecastable /predictable external influencing factors for my sales 
    forecast with a probability percentage in parenthesis:
     
    The "Schnitzelbank", a very special place we think...
    It has its own unique atmosphere. The name goes back to the times when it was 
    a coopers workshop, that made barrels for the local vintners.
    Around 1900, the proprietors realized that selling wine instead of barrels was 
    much more profitable, and certainly more fun. 
    And the food is a perfect match for the old-world atmosphere - good plain country
    cooking, tasty regional dishes and traditional German specialities.
    Everything is freshly prepared, of course - and we also serve Schnitzels, by the 
    way... not to mention our excellent local wines !`


    const factorInfo = externalFactors.map((e) => ({
        "factor": e.factor,
        "reason": e.reason,
        "keywords": e.keywords,
        "percentage": e.percentage
    }));
    return JSON.stringify(factorInfo);
}

async function runConversation() {
    // Step 1: send the conversation and available functions to GPT
    const messages = [{"role": "user", "content": `I am a restaurant business located in Bauamtsgasse 7, 69117 Heidelberg, 
    Germany  and this is the description of my business. Please tell me which are the 
    Top 5 key forecastable /predictable external influencing factors for my sales 
    forecast with a probability percentage in parenthesis:
     
    The "Schnitzelbank", a very special place we think...
    It has its own unique atmosphere. The name goes back to the times when it was 
    a coopers workshop, that made barrels for the local vintners.
    Around 1900, the proprietors realized that selling wine instead of barrels was 
    much more profitable, and certainly more fun. 
    And the food is a perfect match for the old-world atmosphere - good plain country
    cooking, tasty regional dishes and traditional German specialities.
    Everything is freshly prepared, of course - and we also serve Schnitzels, by the 
    way... not to mention our excellent local wines !`}];
    const functions = [
        {
            "name": "write_external",
            "description": "write it into database",
            "parameters": {
                "type": "object",
                "properties": {
                    "externalFactors":{
                        "description": "a array which include five top factors and its reason,percentage and keywords ",
                        "type":"array",
                        "items": {
                        "factor": {
                            "type": "string",
                            "description": "key factor, such as weather, covid",
                        },
                        "percentage": {
                            "type": "number",
                            "description": "a probability percentage showing why it is important, how it gonna impact sales",
                        },
                        "reason": {
                          "type": "string",
                          "description": "professionally explain why it is a important factors",
                      },
                      "keywords": {
                        "items": {
                          "type": "string",
                          "description": "generate some keywords to search the current trend regarding this factor",
                      },
                    },
                    } }
                },
                "required": ["factor","reason","keywords","externalFactors","percentage"],
            },
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        functions: functions,
        function_call: {"name": "write_external"},  // auto is default, but we'll be explicit
    });
    const responseMessage = response.choices[0].message;
    // Step 2: check if GPT wanted to call a function

    console.log(responseMessage.function_call)
    console.log(response.choices[0].message)
    if (responseMessage.function_call) {
        // Step 3: call the function
        // Note: the JSON response may not always be valid; be sure to handle errors
        const availableFunctions = {
          write_external: getExternalFactor,
        };  // only one function in this example, but you can have multiple
        const functionName = responseMessage.function_call.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(responseMessage.function_call.arguments);
        const functionResponse = functionToCall(
            functionArgs.externalFactors,
            functionArgs.factor,
            functionArgs.keywords,
            functionArgs.reason,
            functionArgs.percentage,
        );
        console.log(functionResponse)


}}

runConversation();