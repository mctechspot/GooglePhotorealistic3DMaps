# Ecocité

![Ecocité Logo](./static/media/logo-light.png)

Ecocité is an intelligent web application that strives to educate the public on the state of our cities and towns with a strong focus on the areas of environmental health, urban planning and the built economy. Ecocité uses Generative Aritificial Intelligence (GenAI) to accept a user prompt from that indicates which location is to be explored. The prompt could be a specific place, such as Oslo, Norway, for which the application will return this specified location. The prompt could also be a more vague but descriptive phrase such as "Vast fjords" for which the application will generate a suitable place such as a city in Norway, Sweden, Finland or Iceland. Intelligent recommendations are generated to inform the public of sustainability-oriented actions that may be taken to improve their cities. More specifi cally, the generated content includes the city, country, latitude, longitude, description, sites and recommendations. The latitude and longitude positions are used in tandem with Google's 3D Photorealistic Maps API to open a page with a full view of the city. This feature is particularly exciting as this API has an open-world feeling which allows the user to move around not just the specified location but also the entire city, its continent and the rest of the entire globe.

Below is the structure of the POST Request that generates the contents.
url: 127.0.0.1:3000/api/visit
content-type: application/json
method: "POST",
payload body: {
    "prompt": string
};

The response body should appear as follows.
Content-type: application/json
body: {
    "id": UUID,
    "city": string,
    "country": string,
    "latitude": number,
    "longitude": number,
    "description": string,
    "sites": string,
    "recommendations": string,
    "generated_at": Datetime
}

## Preinstallations
1. It is important to first establish a Google Cloud project in the Google Cloud Console. Create an API key for Google Maps SDK as well as one for Google Gemini. Save these API key values to be mentioned in later steps. 
2. Ensure that [git](https://git-scm.com/) is installed on your device.
3. Ensure that [node](https://nodejs.org/en/download/package-manager) version 20 or higher is installed on your device. It is very important to use version 20 of node or a higher version or else some features of the server will not work. Check that the correct version of node has been installed with the command ```node --version or node -v```
5. Ensure that [docker](https://docs.docker.com/get-started/get-docker/) is installed on your device. 
5. Open a safe folder on your computer and clone this repository with the command ```git clone https://github.com/mctechspot/GooglePhotorealistic3DMaps```
5. Enter the repository root directory with the command ```cd GooglePhotorealistic3DMaps ```
6. In the root directory, create a .env file and create two environment variables called GOOGLE_MAPS_SDK_API_KEY and GEMINI_API_KEY. Using the keys you obtained from step 1, set the GOOGLE_MAPS_SDK_API_KEY variable to the Google Maps SDK API key that you obtained and set the GEMINI_API_KEY to the Gemini API Key that you obtained.
7. Go to the file at path /templates/location.html and search for <GOOGLE_MAPS_SDK_API_KEY>. Replace this placeholder value with the actual Google Maps SDK API key.
8. Install node packages with the command ```npm install```
9. Run the application with the environment variables loaded with the command ```--env-file=.env server.mjs```. The application should be running at http://127.0.0.1:3000 if port 3000 is free. You can change the port in the server.mjs file if you would like to do so.
10. Visit http://127.0.0.1:3000 to see the app running.

## Running the App with Node
1. In the root of the project directory, run the application with environment variables loaded with the command ```node --env-file=.env server.mjs```. It should be running at http://localhost:3000 if port 3000 is free. You can also change the port in the server.mjs file.
2. Visit http://localhost:3000 to see the app running.

## Run the App with Docker
1. Build the image witht the command, build the docker image with the command ```docker build --no-cache -t ecocite:latest .```.
2. Confirm that the image has been correctly built with the command ```docker image list```. The image ecocite:latest should be listed.
3. Run the built image of the application with the command ```docker run -p 3000:3000 ecocite:latest```.

