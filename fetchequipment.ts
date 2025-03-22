import fetch from 'node-fetch';

// Function to fetch data from the API and output relevant details
async function fetchEquipmentData(appToken: string): Promise<void> {
  const url = `https://accessibility-cloud-v2.freetls.fastly.net/equipment-infos.json?&x=8798&y=5374&z=14&appToken=${appToken}&includePlacesWithoutAccessibility=1`;

  try {
    const response = await fetch(url);
    const data: { features?: any[] } = await response.json();

    if (data.features) {
      const equipmentList: any[] = [];

      data.features?.forEach((feature: any) => {
        const coordinates = feature.geometry.coordinates;
        const equipmentType = feature.properties.category;
        const isWorking = feature.properties.isWorking ? 'Working' : 'Not Working';

        // Store equipment details in a list
        equipmentList.push({
          coordinates: {
            latitude: coordinates[1],
            longitude: coordinates[0],
          },
          type: equipmentType,
          status: isWorking,
        });
      });

      // Output the list of equipment points
      console.log(equipmentList);
    } else {
      console.error('No equipment data found.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Replace 'your-app-token' with your actual app token when calling the function
const appToken = '27be4b5216aced82122d7cf8f69e4a07';
fetchEquipmentData(appToken);
