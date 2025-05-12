function getByAttributeValue(collection, attribute, attrValue) {
  for (const item of collection) {
    if (item.getAttribute(attribute) === attrValue) {
      return item;
    }
  }
  return undefined;
}

function getTime(item: Element): Date {
  const time = value(item.children[0]);
  return new Date(time)
}

function getTimeAndValuePairs(sourceXml: any, attributeName:string) {
  const measurementTVPs = getByAttributeValue(
    sourceXml,
    'gml:id',
    attributeName
  ).getElementsByTagName('wml2:MeasurementTVP');

  return measurementTVPs;
}

function getValue(item: Element) {
  if (item?.children[1] === undefined) {
    return Number.NaN;
  }
  return parseFloat(value(item.children[1]));
}

function parseLocationName(response: Document | Element) {
  const locations = response.getElementsByTagName('gml:name');
  const locationRow = getByAttributeValue(
    locations,
    'codeSpace',
    'http://xml.fmi.fi/namespace/locationcode/name'
  );

  const location = value(locationRow);

  return location;
}

/**
 * Parse region value from the following tag
 * <target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Helsinki</target:region>
 */
function parseRegion(response) {
  const regions = response.getElementsByTagName('target:region');
  const regionRow = getByAttributeValue(
    regions,
    'codeSpace',
    'http://xml.fmi.fi/namespace/location/region'
  );

  const region = value(regionRow);

  return region;
}

function raiseEvent(context, name, payload) {
  let message = payload;

  if (!navigator.onLine) {
    message = `${payload.detail}. Verkkoon ei saatu yhteyttä`;
  }

  const event = new CustomEvent(name, {
    detail: message,
    bubbles: true,
    composed: true,
  });
  context.dispatchEvent(event);
}

function value(xmlElement) {
  return xmlElement?.childNodes[0]?.nodeValue;
}

export {
  getByAttributeValue,
  getTime,
  getTimeAndValuePairs,
  getValue,
  parseLocationName,
  parseRegion,
  raiseEvent,
  value,
};
