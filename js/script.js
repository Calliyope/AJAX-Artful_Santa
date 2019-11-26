// The API key given to me by Etsy
const key = "937mbv5bq0ahfrfo4i3d1d9z";



// This function sets the search preferences by which the gifts will be retrieved from Etsy
async function LoadGifts() {

    let maxPrice = document.getElementById("txtMaxPrice").value;

    let tags = "secret santa," + getGenderTagName();

    let jsonpUrl = getListingsURL(tags, maxPrice);

    console.log(jsonpUrl);

    let newScriptTag = document.createElement("script");
    newScriptTag.setAttribute("src", jsonpUrl);
    document.body.appendChild(newScriptTag);
}


// Variables to use with the next function. Defines the current page number of items being viewed and compares if the search parametrs have changed (meaning a new query or if the user simply wants to view more of the same query)
let pageNumber = 0;
let prev_tags = "";
let prev_maxprice = "";


// This function creates the url to use with the API key. The url has to contain a max price and some tags (the gender tags). The callback must be used because the Etsy API is old and doesnt allow JSON. 
function getListingsURL(tags, maxPrice) {

    let isNewQuery = (prev_tags !== tags) || (prev_maxPrice !== maxPrice);

    if (isNewQuery) {
        pageNumber = 1;
    } else {
        pageNumber++;
    }

    prev_tags = tags;
    prev_maxPrice = maxPrice;

    return "https://openapi.etsy.com/v2/listings/active.js" +
        "?callback=" + "processEtsyData" +
        "&limit=" + 8 +
        "&tags=" + encodeURI(tags) +
        "&max_price=" + maxPrice +
        "&api_key=" + key +
        "&page=" + pageNumber;
}

// This function takes the value of the radio buttons under gender and assigns some tags we will search by
function getGenderTagName() {

    let gender = document.querySelector("input[name='gender']:checked").value;

    switch (gender) {
        case "men":
            return "for him";
        case "women":
            return "for her";
        default:
            return "for him,for her";
    }
}

// This function checks the currency that the listing is given in and assigns a symbol to go before the value. In the case of $, many different types exisited so I have added the code at the end.
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

// This is the big API function. Here I search the information given to me by the API and take the values that I am interested in. There are 2 pieces of info here: the price of an item and the title of the listing. 
function processEtsyData(data) {
    console.log(data);

    const target = document.getElementById("target");

    target.innerHTML = "";

    data.results.forEach(el => {

        let title = el.title;
        let price = getPriceWithCurrencySymbol(el.price, el.currency_code);

        let link = el.url;


        // Below I do the DOM manipulation. I still feel confused here...

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

// This async function loads the images that go along with a listing. With the Etsy API this is a seperate call than the date call done above. 

async function LoadImages(listingId) {

    let imageURL = "https://openapi.etsy.com/v2/listings/" + listingId + "/images.js?callback=processListingImage&api_key=" + key;

    let newScriptTag = document.createElement("script");
    newScriptTag.setAttribute("src", imageURL);
    document.body.appendChild(newScriptTag);
}

// This function searches the listings retrieved to see if they have any images. If they do it takes the url of the image and creates a new img element inside the parent divs. 
function processListingImage(data) {

    if (data.count === 0)
        return;

    let imageUrl = data.results[0].url_170x135;

    let imageElement = document.createElement("img");
    imageElement.setAttribute("src", imageUrl);

    let parent = document.getElementById(`listing-${data.params.listing_id}`)

    parent.appendChild(imageElement);
}

// Some of the listing titles were long and full of crazy punctuation. Here I cut titles when they gave a weird symbol, were more than 6 words or had *** in them. 
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
    LoadGifts(),
        document.getElementById("target").scrollIntoView();
});



document.getElementById("refresh").addEventListener("click", async function () {
    LoadGifts();
});



// Here are the snowstorm options!

//snowStorm.flakesMaxActive = 56; //the maximum number of active snow flakes on the screen, lowering this may increase performance
snowStorm.followMouse = false; //the snow will fall in a certain direction based on the position of your mouse
snowStorm.snowCharacter = '★'; //change the flake to a specific character
snowStorm.snowStick = true; //if true, the snow will stick to the bottom of the screen