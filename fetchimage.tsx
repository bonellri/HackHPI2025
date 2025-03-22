import axios from 'axios';

const API_KEY = 'AIzaSyA7giHYseCHwawM_8DptkIOGVdOilXso70';  // Replace with your Google API key
const waypoints: [number, number, number][] = [
    [
      13.352508,
      52.524189,
      36.12
    ],
    [
      13.35592,
      52.457433,
      46.25
    ]
  ];

const getClosestStreetViewImage = async (lat: number, lng: number): Promise<string> => {
    const radius = 10; // Increase the radius to 50 meters
    const url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lng},${lat}&radius=${radius}&key=${API_KEY}`;
    
    try {
        const response = await axios.get(url);
        const metadata = response.data;

        if (metadata.status === 'OK' && metadata.pano_id) {
            const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=1000x500&location=${lng},${lat}&key=${API_KEY}`;
            return imageUrl;
        } else {
            throw new Error('No Street View found at this location.');
        }
    } catch (error) {
        console.error('Error fetching Street View image:', error);
        return '';
    }
};

const getClosestImagesForWaypoints = async (waypoints: [number, number, number][]) => {
    const imageUrls: string[] = [];
    
    for (const waypoint of waypoints) {
        const [lat, lng, _] = waypoint;
        const imageUrl = await getClosestStreetViewImage(lat, lng);
        imageUrls.push(imageUrl);
    }

    console.log('Closest 360° Street View Images:', imageUrls);
    return imageUrls;
};

// Call the function and get the results
getClosestImagesForWaypoints(waypoints).then((imageUrls) => {
    // You can use or display the image URLs here
    imageUrls.forEach((url, index) => {
        console.log(`Image for waypoint ${index + 1}: ${url}`);
    });
});
