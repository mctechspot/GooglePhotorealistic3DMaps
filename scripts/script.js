// Run initialising functions and variables for the locator page
const runLocatorInitialisers = async () => {
    setFooterContent();
    fetchLatestContent();
}

// Run initialising functions and variables for the about page
const runAboutInitialisers = async () => {
    setFooterContent();
}

// Set footer content such as current year
const setFooterContent = () => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const footerTextElement = document.getElementById("footer-text");
    footerTextElement.innerHTML = startYear === currentYear ? `© ${currentYear} Ecocité` : `© ${startYear} - ${currentYear} Ecocité`;
}

// Set latitude and longitude of map
const initMap = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const latitude = urlParams.get('latitude') ? urlParams.get('latitude') : 37.841157;
    const longitude = urlParams.get('longitude') ? urlParams.get('longitude') : -122.551679;
    const map = document.getElementById("map");
    map.setAttribute("center", `${latitude}, ${longitude}`);
}

// Fetch location for given use prompr
const fetchLocation = async (event) => {
    event.preventDefault();
    const contentGrandContainerElement = document.getElementById("content-grand-container");
    try {
        const promptInputElement = document.getElementById("prompt-input");
        const promptValue = promptInputElement?.value;
        if (promptValue && promptValue.trim() !== "" && promptValue.trim().length > 0) {
            clearContentFromScreen();
            contentGrandContainerElement.innerHTML = "";
            contentGrandContainerElement.innerHTML = `
            <div>
            <div class="loader"></div><br>
            <p class="text-green-main text-center">Hang tight while we generate sustainability insights!<p>
            </div>
            `;
            const locationRes = await fetch(`http://127.0.0.1:3000/api/locate`, {
                body: JSON.stringify({ "prompt": promptValue.trim() }),
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (!locationRes.status > 199 && !locationRes.status < 300) {
                contentGrandContainerElement.innerHTML = "";
                contentGrandContainerElement.classList.remove("loader");
                contentGrandContainerElement.innerHTML = `<span class="text-center">An error occured. Try again.</span>`;
            } else {
                const locationJson = await locationRes.json();

                if ((locationJson.prompt && locationJson.prompt !== locationJson.undefined && locationJson.prompt !== "") &&
                    (locationJson.latitude || locationJson.latitude !== undefined && locationJson.latitude !== "") &&
                    (locationJson.longitude || locationJson.longitude !== undefined && locationJson.longitude !== "") &&
                    (locationJson.city || locationJson.city !== undefined && locationJson.city !== "") &&
                    (locationJson.country || locationJson.country !== undefined && locationJson.country !== "") &&
                    (locationJson.description || description !== undefined && description !== "") &&
                    (locationJson.sites || locationJson.sites !== undefined && locationJson.sites !== "")) {
                    renderContentOnScreen(locationJson, false);
                    saveContentToLocalStorage(locationJson);
                }
            }
        }
    } catch (error) {
        console.log(`Error generating location: ${error}`);
        contentGrandContainerElement.innerHTML = "";
        contentGrandContainerElement.classList.remove("loader");
        contentGrandContainerElement.innerHTML = `<span class="text-center">An error occured. Try again.</span>`
    }
}

// Display load spinner
const showLoadSpinner = () => {
    const spinnerElement = document.createElement("div");
    spinnerElement.className.add("spinner-element");
}


// Save generated content to local storage
const saveContentToLocalStorage = (locationJson) => {
    localStorage.setItem("id", locationJson.id);
    localStorage.setItem("prompt", locationJson.prompt);
    localStorage.setItem("latitude", locationJson.latitude);
    localStorage.setItem("longitude", locationJson.longitude);
    localStorage.setItem("city", locationJson.city);
    localStorage.setItem("country", locationJson.country);
    localStorage.setItem("description", locationJson.description);
    localStorage.setItem("sites", locationJson.sites);
    localStorage.setItem("recommendations", locationJson.recommendations);
    localStorage.setItem("generated_at", locationJson.generated_at);
}


// Render generated content on screen
const renderContentOnScreen = (locationJson, previouslyGenerated) => {
    const contentGrandContainerElement = document.getElementById("content-grand-container");
    contentGrandContainerElement.innerHTML = "";
    contentGrandContainerElement.classList.remove("loader");
    const id = locationJson.id;
    const prompt = locationJson.prompt;
    const latitude = locationJson.latitude;
    const longitude = locationJson.longitude;
    const city = locationJson.city;
    const country = locationJson.country;
    const description = locationJson.description;
    const sites = locationJson.sites;
    const recommendations = locationJson.recommendations;
    const generated_at = locationJson.generated_at;


    // Format latitude and longitude as texts with W/E and N/S and degree symbols
    let latitudeText = "";
    let longitudeText = "";

    if (latitude < 0) {
        latitudeText = `${Math.abs(latitude)}&deg; S`;
    } else {
        latitudeText = `${Math.abs(latitude)}&deg; N`;
    }

    if (longitude < 0) {
        longitudeText = `${Math.abs(longitude)}&deg; W`;
    } else {
        longitudeText = `${Math.abs(longitude)}&deg; E`;
    }

    // Update generated content tags
    const generatedContentContainerElement = document.getElementById("generated-content-container");
    generatedContentContainerElement.classList.remove("hidden");
    const initialTextElement = document.getElementById("initial-text-tag");
    const cityCountryElement = document.getElementById("city-country-tag");
    const mapLinkElement = document.getElementById("map-link");
    const coordinatesElement = document.getElementById("coordinates-tag");
    const descriptionElement = document.getElementById("description-tag");
    const sitesElement = document.getElementById("sites-tag");
    const recommendationsElement = document.getElementById("recommendations-tag");

    contentGrandContainerElement.innerHTML = "";
    contentGrandContainerElement.classList.remove("loader");
    initialTextElement.innerHTML = `<div><span class="text-center">Here are your generated insights for the prompt \"${prompt}\" on ${prettyDateFormatter(generated_at)}</span></div><br>`;
    cityCountryElement.innerHTML = `<div><span class="location-tag text-center">${city}, ${country}</span></div><br>`;
    mapLinkElement.setAttribute("href", `./location.html?city=${city}&country=${country}&latitude=${latitude}&longitude=${longitude}`);
    coordinatesElement.innerHTML = `<div class="text-center">${latitudeText}, ${longitudeText}</div><br>`;
    mapLinkElement.innerHTML = `<span class="heading-2">View 3D map of the location here! &#127757;</span>`;
    descriptionElement.innerHTML = `<div>${formatMarkdownAsHTML(description)}</div>`;
    descriptionElement.classList.add("description-tag-decorator");
    sitesElement.innerHTML = `<span class="heading-1">Cool Sites to Explore in ${city}, ${country}</span><br><div>${formatMarkdownAsHTML(sites)}</div>`;
    recommendationsElement.innerHTML = `<span class="heading-1">Sustainability-Oriented Actions to Improve the Natural and Built Environment of ${city}, ${country}</span><br><div>${formatMarkdownAsHTML(recommendations)}</div>`;
}


// Remove rendered generated content from screen
const clearContentFromScreen = () => {

    // Update generated content tags
    const contentGrandContainerElement = document.getElementById("content-grand-container");
    contentGrandContainerElement.innerHTML = "";
    contentGrandContainerElement.classList.remove("loader");

    const generatedContentContainerElement = document.getElementById(`generated-content-container`);
    const cityCountryElement = document.getElementById(`city-country-tag`);
    const mapLinkElement = document.getElementById(`map-link`);
    const coordinatesElement = document.getElementById(`coordinates-tag`);
    const descriptionElement = document.getElementById(`description-tag`);
    const sitesElement = document.getElementById(`sites-tag`);
    const recommendationsElement = document.getElementById(`recommendations-tag`);


    cityCountryElement.innerHTML = ``;
    mapLinkElement.setAttribute("href", `./locator.html`);
    mapLinkElement.innerHTML = ``;
    coordinatesElement.innerHTML = ``;
    descriptionElement.innerHTML = ``;
    descriptionElement.classList.remove("description-tag-decorator");
    sitesElement.innerHTML = ``;
    recommendationsElement.innerHTML = ``;
    generatedContentContainerElement.classList.add(`hidden`);

}

// Remove generated content from local storage
const clearContentFromLocalStorage = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("prompt");
    localStorage.removeItem("latitude");
    localStorage.removeItem("longitude");
    localStorage.removeItem("city");
    localStorage.removeItem("country");
    localStorage.removeItem("description");
    localStorage.removeItem("sites");
    localStorage.removeItem("recommendations");
    localStorage.removeItem("generated_at");
}

// Fetch most recent generated content from local storage
const fetchLatestContent = () => {
    const id = localStorage.getItem("id");
    const prompt = localStorage.getItem("prompt");
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");
    const city = localStorage.getItem("city");
    const country = localStorage.getItem("country");
    const description = localStorage.getItem("description");
    const sites = localStorage.getItem("sites");
    const recommendations = localStorage.getItem("recommendations");
    const generated_at = localStorage.getItem("generated_at");

    // Clear content from local storage and clear HTML content rendering if any location variable contain null or empty values
    if (
        (!id || id === "") ||
        (!prompt || prompt === "") ||
        (!latitude || latitude === "") ||
        (!longitude || longitude === "") ||
        (!city || city === "") ||
        (!country || country === "") ||
        (!description || description === "") ||
        (!sites || sites === "") ||
        (!recommendations || recommendations === "") ||
        (!generated_at || generated_at === "")
    ) {
        clearContentFromScreen();
        clearContentFromLocalStorage();
        renderGeneratorIcon();
    } else { // Else build location dictionary to render content on screen
        const locationJson = {
            "prompt": prompt,
            "latitude": latitude,
            "longitude": longitude,
            "city": city,
            "country": country,
            "description": description,
            "sites": sites,
            "recommendations": recommendations,
            "generated_at": generated_at
        }
        renderContentOnScreen(locationJson, true);
    }

};

const renderGeneratorIcon = () => {
    const contentGrandContainerElement = document.getElementById("content-grand-container");
    contentGrandContainerElement.innerHTML = "";
    contentGrandContainerElement.innerHTML = `
    <div id="generator-prompt-image-container">
    <div id="generator-icon-container">
    <img id="generator-icon" src="./static/media/generator-icon.png" height="200" width="200" alt="Generator Icon"/>
    </div><br>
    <p id="generator-icon-label" class="text-center">We remain at your disposal to offer key insights!</p>
    </div>`;
}

// Use regex expressions to format markdown of generated content as HTML
const formatMarkdownAsHTML = (markdown) => {
    let finalHTML = markdown.replace(/\n/g, "<br>");
    finalHTML = finalHTML.replace(/\*\*(.*?)\*\*/g, `<span class='heading-2'>$1</span>`);
    finalHTML = finalHTML.replace(/\#\#(.*?)\#\#/g, `<span class='heading-2'>$1</span>`);
    finalHTML = finalHTML.replace(/\#\#(.*?)/g, `<span class='heading-2'>$1</span>`);
    finalHTML = finalHTML.replace(/\*\*\*(.*?)\*\*\*/g, `<span class='heading-3'>$1</span>`);
    finalHTML = finalHTML.replace(/\#\#\#(.*?)\#\#\#/g, `<span class='heading-3'>$1</span>`);
    finalHTML = finalHTML.replace(/\*\s(.*?)/g, `$1`);

    return finalHTML;
}

// Format date nicely
const prettyDateFormatter = (dateString) => {
    const date = new Date(`${dateString}`);
    const options = { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" };
    const formattedDate = date.toLocaleString("en-US", options).replace("GMT", "UTC");
    return formattedDate;
}