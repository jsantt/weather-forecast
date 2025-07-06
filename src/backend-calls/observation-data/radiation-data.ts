import { LocationCoordinates } from '../../app-sections/forecast-header/station-map.ts';
import { parseLocationName } from '../xml-parser.ts';
import { splitLatLon } from './distance.ts';
import { distanceBetween } from './vector-math.ts';

type Radiation = {
  uvi: number;
  place: string;
  latlon: { lat: number; lon: number };
  distance: number;
};

/**
 * See https://en.ilmatieteenlaitos.fi/open-data-manual-fmi-wfs-services
 * @returns
 */
async function getRadiationData(
  location: LocationCoordinates
): Promise<Radiation | undefined> {
  const response = await fetch(
    `https://opendata.fmi.fi/wfs?request=getFeature&storedquery_id=fmi::observations::radiation::timevaluepair&maxlocations=1&parameters=UVB_U`,
    {
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );

  const text = await response.text();
  const document = new window.DOMParser().parseFromString(text, 'text/xml');

  const stationElements = document.getElementsByTagName('wfs:member');

  let stationJson: Radiation[] = [];
  for (const station of stationElements) {
    const name = parseLocationName(station);

    const uviElements = station.getElementsByTagName('wml2:value');
    const uvi = uviElements[uviElements.length - 1].textContent;

    const latlonString =
      station.getElementsByTagName('gml:pos')[0].textContent ?? '';
    const latlon = splitLatLon(latlonString);

    const distance = distanceBetween(
      latlon.lat,
      latlon.lon,
      location.lat,
      location.lon
    );

    stationJson.push({ place: name, uvi: Number(uvi), latlon, distance });
  }
  const orderedStations = stationJson.sort((a, b) => a.distance - b.distance);

  return orderedStations.at(0);
}

export { getRadiationData };
export type { Radiation };
