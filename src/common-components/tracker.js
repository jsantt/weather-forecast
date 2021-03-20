export { track };

const HIT_TYPE_EVENT = 'event';
const GATEGORY_INSTALL = 'install';
const ACTION_CLICK = 'click';

// track events

export const INSTALL_CLICKED = [
  GATEGORY_INSTALL,
  ACTION_CLICK,
  'install clicked',
];

export const INSTALL_CANCELLED = [
  GATEGORY_INSTALL,
  ACTION_CLICK,
  'install cancelled',
];

export const INSTALLED = [GATEGORY_INSTALL, ACTION_CLICK, 'installed'];

export const INSTALL_INSTRUCTIONS_CLOSED = [
  GATEGORY_INSTALL,
  ACTION_CLICK,
  'ios install instructions closed',
];

// public functions

function track(event) {
  if (window.location.href.indexOf('localhost') > -1) {
    // eslint-disable-next-line no-console
    console.dir(event);
  } else {
    window.ga('send', {
      hitType: HIT_TYPE_EVENT,
      eventCategory: event[0],
      eventAction: event[1],
      eventLabel: event[2],
    });
  }
}
