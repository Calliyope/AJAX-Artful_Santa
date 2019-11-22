const key = "937mbv5bq0ahfrfo4i3d1d9z";


async function LoadGifts() {

    let maxPrice = document.getElementById("txtMaxPrice").value;

    let jsonpUrl = "https://openapi.etsy.com/v2/listings/active.js?callback=processEtsyData&limit=8&tags=secret%20santa&max_price=" + maxPrice + "&api_key=" + key;
    console.log(jsonpUrl);

    let newScriptTag = document.createElement("script");
    newScriptTag.setAttribute("src", jsonpUrl);
    document.body.appendChild(newScriptTag);

}

function processEtsyData(data) {
    console.log(data);

    const target = document.getElementById("target");

    data.results.forEach(el => {

        let title = el.title;
        let price = `${el.price} (${el.currency_code})`;

        let link = el.url;
        console.log(link);

        let newElement = document.createElement("div");
        newElement.className = "gift";
        newElement.id = `listing-${el.listing_id}`;

        let header = document.createElement("h2");
        header.innerHTML = CleanUpListingTitle(title);

        newElement.appendChild(header);

        let priceTag = document.createElement("p");
        priceTag.innerText = price;
        newElement.appendChild(priceTag);

        target.appendChild(newElement);

        let linkButton = document.createElement("a");
        linkButton.setAttribute("href", link);
        linkButton.innerText = "See this listing on Etsy";
        newElement.appendChild(linkButton)

        LoadImages(el.listing_id);

    });
}

async function LoadImages(listingId) {

    let imageURL = "https://openapi.etsy.com/v2/listings/" + listingId + "/images.js?callback=processListingImage&api_key=" + key;

    let newScriptTag = document.createElement("script");
    newScriptTag.setAttribute("src", imageURL);
    document.body.appendChild(newScriptTag);
}

function processListingImage(data) {
    console.log(data);
    console.log(`listing ${data.params.listing_id} has ${data.count} pictures`);

    if (data.count === 0)
        return;

    let imageUrl = data.results[0].url_170x135;

    let imageElement = document.createElement("img");
    imageElement.setAttribute("src", imageUrl);

    let parent = document.getElementById(`listing-${data.params.listing_id}`)

    parent.appendChild(imageElement);
}

function CleanUpListingTitle(title) {

    // Break on these characters!

    const splitCharacters = [",", " - ", "|", "."];

    splitCharacters.forEach(splitCharacter => {
        title = title.split(splitCharacter)[0];
    });

    // Only 6 words or less allowed!

    const words = title.split(" ");

    if (words.length > 6) {
        let wordsIWant = words.slice(0, 6);

        title = wordsIWant.join(" ") + " ...";
    }

    // Away with the ***** asterisks

    title = title.replace("*", "");

    return title;
}


document.getElementById("run").addEventListener("click", async function () {
    //Also remove the old gifts
    LoadGifts();
});

LoadGifts();


// Snowstorm stuff

src = "//cdnjs.cloudflare.com/ajax/libs/Snowstorm/20131208/snowstorm-min.js" >

    snowStorm.snowColor = '#6699cc'; //give the snowflakes another colour
snowStorm.flakesMaxActive = 96; //the maximum number of active snow flakes on the screen, lowering this may increase performance
snowStorm.followMouse = false; //the snow will fall in a certain direction based on the position of your mouse
snowStorm.snowCharacter = '★'; //change the flake to a specific character
snowStorm.snowStick = true; //if true, the snow will stick to the bottom of the screen