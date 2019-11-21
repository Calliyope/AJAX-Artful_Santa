let key = "937mbv5bq0ahfrfo4i3d1d9z";


async function LoadGifts() {

    var maxPrice = document.getElementById("txtMaxPrice").value;

    let jsonpUrl = "https://openapi.etsy.com/v2/listings/active.js?callback=processEtsyData&limit=8&tags=secret%20santa&max_price="+ maxPrice +"&api_key=" + key;
    console.log(jsonpUrl);

    var newScriptTag = document.createElement("script");
    newScriptTag.setAttribute("src", jsonpUrl);
    document.body.appendChild(newScriptTag);

}

function processEtsyData(data) {
    console.log(data);

    var target = document.getElementById("target");

    data.results.forEach(el => {

        var title = el.title;
        var price = `${el.price} (${el.currency_code})`;

        var newElement = document.createElement("div");
        newElement.className = "gift";
        newElement.id = `listing-${el.listing_id}`;

        var header = document.createElement("h2");
        header.innerHTML = CleanUpListingTitle(title);

        newElement.appendChild(header);

        var priceTag = document.createElement("p");
        priceTag.innerText = price;
        newElement.appendChild(priceTag);

        target.appendChild(newElement);

        LoadImages(el.listing_id);

    });
}

async function LoadImages(listingId) {

    var imageURL = "https://openapi.etsy.com/v2/listings/" + listingId + "/images.js?callback=processListingImage&api_key=" + key;

    var newScriptTag = document.createElement("script");
    newScriptTag.setAttribute("src", imageURL);
    document.body.appendChild(newScriptTag);
}

function processListingImage(data) {
    console.log(data);
    console.log(`listing ${data.params.listing_id} has ${data.count} pictures`);
    
    if(data.count ===0)
        return;
    
    var imageUrl = data.results[0].url_170x135;

    var imageElement = document.createElement("img");
    imageElement.setAttribute("src", imageUrl);   
    
    var parent  = document.getElementById(`listing-${data.params.listing_id}`)
    
    parent.appendChild(imageElement);
}

function CleanUpListingTitle(title) {

    // title = title.split("-")[0];
    // title = title.split(",")[0];
    // title = title.split("|")[0];

    // Break on these characters!

    var splitCharacters = [ ",", " - ", "|", "." ];

    splitCharacters.forEach(splitCharacter => {
        title = title.split(splitCharacter)[0];
    });

    // Only 6 words or less allowed!

    var words = title.split(" ");

    if(words.length > 6)
    {
        var wordsWeWant = words.slice(0,6);

        title = wordsWeWant.join(" ") + " ...";
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




