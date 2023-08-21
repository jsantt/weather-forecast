const trackOnLocalhost = false;

// track events

const INTRO_DISMISSED = 'p5nirl8rdrq2i0dl';

const INSTALL_SHOWED = '3rdogewr2718p5oq';
const INSTALL_CLICKED = 'fm7lkebupw5alsgv';
const INSTALL_CANCELLED = 'hdqefli8otliem8v';
const INSTALLED = 'kfrdzx2lmeao9kej';

const GEOLOCATE = 'gm8rsv8jpobrgkrs';

// public functions

function track(eventId) {
  if (
    window.location.href.includes('localhost') === true &&
    trackOnLocalhost === false
  ) {
    return;
  }

  if (window.tinyanalytics === undefined) {
    return;
  }

  window.tinyanalytics.goal(eventId);
}

export {
  track,
  GEOLOCATE,
  INTRO_DISMISSED,
  INSTALL_SHOWED,
  INSTALL_CLICKED,
  INSTALL_CANCELLED,
  INSTALLED,
};
