import fetch from 'node-fetch';

const SERVER_URL = "https://glossary-fruits-voltage-spell.trycloudflare.com/route";

async function fetchRoute() {
    const baseUrl = "https://glossary-fruits-voltage-spell.trycloudflare.com/route";
    const body = {
        points: [[13.239778, 52.497651], [13.283220709418819, 52.50790379458118]],
        profile: "prosthesis",
        elevation: true,
        // details: ["max_slope"],
        points_encoded: false
    };

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error fetching route data:", error);
    }
}

fetchRoute();

