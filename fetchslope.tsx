// Import fetch for Node.js if needed (uncomment if using Node.js)
// import fetch from 'node-fetch';

type RouteParams = {
  point1: string;
  point2: string;
  profile?: string;
  elevation?: boolean;
  details?: string | string[]; // allow multiple details
  points_encoded?: boolean;
};

type CorrelatedSlopeInterval = {
  maxSlope: number;
  avgSlope: number;
  startIndex: number;
  endIndex: number;
  segment: number[][]; // Each coordinate: [lon, lat, elevation]
};

/**
 * Constructs the GraphHopper route API URL with customizable parameters.
 */
async function fetchRoute(params: RouteParams): Promise<any> {
  const baseUrl = "http://localhost:8989/route";
  const urlParams = new URLSearchParams();

  // Append both point parameters
  urlParams.append("point", params.point1);
  urlParams.append("point", params.point2);

  // Append other parameters if provided
  if (params.profile) urlParams.append("profile", params.profile);
  if (params.elevation !== undefined) urlParams.append("elevation", params.elevation.toString());
  if (params.details) {
    if (Array.isArray(params.details)) {
      params.details.forEach((detail) => urlParams.append("details", detail));
    } else {
      urlParams.append("details", params.details);
    }
  }
  if (params.points_encoded !== undefined) urlParams.append("points_encoded", params.points_encoded.toString());

  const url = `${baseUrl}?${urlParams.toString()}`;
  console.log("Fetching URL:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

/**
 * Extracts correlated segments where the maximum slope is >= 25 or <= -25
 * and the average slope is >= 10 or <= -10.
 *
 * @param routeData - The JSON data returned from GraphHopper.
 * @param maxSlopeThreshold - Threshold for the max slope (default 25).
 * @param avgSlopeThreshold - Threshold for the average slope (default 10).
 * @returns An array of correlated slope intervals including the overlapping coordinate segment.
 */
function extractCorrelatedSlopeSegments(
  routeData: any,
  maxSlopeThreshold: number = 25,
  avgSlopeThreshold: number = 10
): CorrelatedSlopeInterval[] {
  const results: CorrelatedSlopeInterval[] = [];

  if (!routeData.paths || routeData.paths.length === 0) {
    console.error("No paths found in route data.");
    return results;
  }

  const path = routeData.paths[0];
  const coordinates: number[][] = path.points.coordinates;

  // Check if details exist
  if (!path.details) {
    console.error("No details found in route data.");
    return results;
  }

  // Expecting arrays of intervals of the form [startIndex, endIndex, value]
  const maxSlopeIntervals: [number, number, number][] = path.details.max_slope || [];
  const avgSlopeIntervals: [number, number, number][] = path.details.average_slope || [];

  console.log("Raw maxSlopeIntervals:", maxSlopeIntervals);
  console.log("Raw avgSlopeIntervals:", avgSlopeIntervals);

  // Filter intervals with inclusive comparisons
  const filteredMaxIntervals = maxSlopeIntervals.filter(
    ([, , slope]) => slope >= maxSlopeThreshold || slope <= -maxSlopeThreshold
  );

  const filteredAvgIntervals = avgSlopeIntervals.filter(
    ([, , slope]) => slope >= avgSlopeThreshold || slope <= -avgSlopeThreshold
  );

  console.log("Filtered maxSlopeIntervals:", filteredMaxIntervals);
  console.log("Filtered avgSlopeIntervals:", filteredAvgIntervals);

  // Compute intersections between the filtered intervals
  for (const maxInterval of filteredMaxIntervals) {
    const [maxStart, maxEnd, maxSlope] = maxInterval;
    for (const avgInterval of filteredAvgIntervals) {
      const [avgStart, avgEnd, avgSlope] = avgInterval;
      // Determine overlapping indices between the two intervals
      const intersectionStart = Math.max(maxStart, avgStart);
      const intersectionEnd = Math.min(maxEnd, avgEnd);
      if (intersectionStart <= intersectionEnd) {
        const segment = coordinates.slice(intersectionStart, intersectionEnd + 1);
        results.push({
          maxSlope,
          avgSlope,
          startIndex: intersectionStart,
          endIndex: intersectionEnd,
          segment,
        });
      }
    }
  }

  return results;
}

async function main() {
  // Customize parameters as needed.
  const params: RouteParams = {
    point1: "52.595553,13.344726",
    point2: "52.39489,13.412017",
    profile: "prosthesis",
    elevation: true,
    // Request both max_slope and average_slope details.
    details: ["max_slope", "average_slope"],
    points_encoded: false,
  };

  try {
    const routeData = await fetchRoute(params);
    const correlatedSegments = extractCorrelatedSlopeSegments(routeData, 20, 5);
    console.log("Correlated segments where max slope >= 25 or <= -25 and avg slope >= 10 or <= -10:");
    console.log(JSON.stringify(correlatedSegments, null, 2));
  } catch (error) {
    console.error("Error fetching or processing route data:", error);
  }
}

main();
