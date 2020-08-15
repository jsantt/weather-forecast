function getByAttributeValue(collection, attribute, value) {
  
  for (let item of collection) {
    if(item.getAttribute(attribute) === value){
      return item;
    }
  }
}

function getTime(item) {
  return value(item.children[0]) 
}


function getTimeAndValuePairs(sourceXml, attributeName, name) {
  const measurementTVPs = getByAttributeValue(sourceXml, 'gml:id', attributeName)
    .getElementsByTagName('wml2:MeasurementTVP')

  return measurementTVPs;
}

function getValue(item) {
  return parseFloat(value(item.children[1])); 
}

function parseLocationName(response){
  const locations = response.getElementsByTagName('gml:name');
  const locationRow = getByAttributeValue(locations, 'codeSpace', 'http://xml.fmi.fi/namespace/locationcode/name');

  const location = value(locationRow);

  return location;
}

/** 
 * Parse region value from the following tag
 * <target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Helsinki</target:region> 
 */
function parseRegion(response) {
  const regions = response.getElementsByTagName('target:region');
  const regionRow = getByAttributeValue(regions, 'codeSpace', 'http://xml.fmi.fi/namespace/location/region');

  const region = value(regionRow);

  return region;
}

/** 
 * Parse latitude and longitude from gml:pos tag. All of them have the same value and we take the first
 * <gml:pos>61.92411 25.74815 </gml:pos> 
 */
function parseLatLon(response) {
  const latLon = response.getElementsByTagName('gml:pos')[0];
  const value = latLon.innerHTML;

  return value;
}

function raiseEvent(context, name, payload) {
  let message = payload;

  if(!navigator.onLine) {
    message = payload.detail + '. ' + 'Verkkoon ei saatu yhteyttä'; 
  }

  const event = new CustomEvent(name, {detail: message, bubbles: true, composed: true});
  context.dispatchEvent(event);
}


function value(xmlElement) {
  return xmlElement.childNodes[0].nodeValue;
}


export { getByAttributeValue, getTime, getTimeAndValuePairs, getValue, parseLatLon, parseLocationName, parseRegion, raiseEvent, value };

