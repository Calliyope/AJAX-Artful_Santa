const key = "937mbv5bq0ahfrfo4i3d1d9z";


async function LoadGifts() {

    let maxPrice = document.getElementById("txtMaxPrice").value;

    let tags = "secret santa," + getGenderTagName();

    let jsonpUrl = getListingsURL(tags, maxPrice);

    console.log(jsonpUrl);

    let newScriptTag = document.createElement("script");
    newScriptTag.setAttribute("src", jsonpUrl);
    document.body.appendChild(newScriptTag);    
}

let pageNumber = 0;
let prev_tags = "";
let prev_maxprice = "";

function getListingsURL(tags, maxPrice) {

    let isNewQuery = (prev_tags !== tags) || (prev_maxPrice !== maxPrice);

    if(isNewQuery) {
        pageNumber = 1;
    } else {
        pageNumber++;
    }

    prev_tags = tags;
    prev_maxPrice = maxPrice;

    return "https://openapi.etsy.com/v2/listings/active.js"
                + "?callback="  + "processEtsyData"
                + "&limit="     + 8
                + "&tags="      + encodeURI(tags)
                + "&max_price=" + maxPrice 
                + "&api_key="   + key
                + "&page="      + pageNumber ;
}

function getGenderTagName() {

    let gender = document.querySelector("input[name='gender']:checked").value;

    switch(gender) {
        case "men":
            return "for him";
        case "women":
            return "for her";
        default:
            return "for him,for her";
    }
}

function getPriceWithCurrencySymbol(price, currencyCode) {

    switch (currencyCode) {
        case "USD":
            return "$" + price + " (USD)";
        case "AUD":
            return "$" + price + " (AUD)";
        case "NZD":
            return "$" + price + " (NZD)";
        case "CAD":
            return "$" + price + " (CAD)";
        case "GBP":
            return "£" + price;
        case "EUR":
            return "€" + price;
        case "JPY":
            return "¥" + price;
        default:
            return `${price} (${currencyCode})`;
    }
}

function processEtsyData(data) {
    console.log(data);

    const target = document.getElementById("target");

    target.innerHTML = "";

    data.results.forEach(el => {

        let title = el.title;
        let price = getPriceWithCurrencySymbol(el.price, el.currency_code);

        let link = el.url;
        //console.log(link);

        let newElement = document.createElement("div");
        newElement.className = "gift";
        newElement.id = `listing-${el.listing_id}`;

        let header = document.createElement("h2");
        header.innerHTML = CleanUpListingTitle(title);

        newElement.appendChild(header);

        let priceTag = document.createElement("p");
        priceTag.innerText = price;
        newElement.appendChild(priceTag);

        let linkButton = document.createElement("a");
        linkButton.setAttribute("href", link);
        linkButton.innerText = "See this listing on Etsy";

        newElement.appendChild(linkButton);

        target.appendChild(newElement);

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
    //console.log(data);
    //console.log(`listing ${data.params.listing_id} has ${data.count} pictures`);

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

//document.getElementsByClassName("red-text").forEach(button => button.addEventListener(...)));

document.getElementById("run").addEventListener("click", async function () {
    LoadGifts();
});

document.getElementById("refresh").addEventListener("click", async function () {
    LoadGifts();
});

LoadGifts();

//snowStorm.flakesMaxActive = 56; //the maximum number of active snow flakes on the screen, lowering this may increase performance
snowStorm.followMouse = false; //the snow will fall in a certain direction based on the position of your mouse
snowStorm.snowCharacter = '★'; //change the flake to a specific character
snowStorm.snowStick = true; //if true, the snow will stick to the bottom of the screen



