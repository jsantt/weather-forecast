const HIT_TYPE_EVENT = 'event';

const GATEGORY_APP = 'app';
const GATEGORY_INTRO = 'intro';
const GATEGORY_INSTALL = 'install';

const ACTION_CLICK = 'click';
const ACTION_VIEW = 'view';
const ACTION_SHOWED = 'showed';

// track events

const INSTALLED_VERSION_VIEW = [
  GATEGORY_APP,
  ACTION_VIEW,
  'installed version viewed',
];
const WEB_VERSION_VIEW = [GATEGORY_APP, ACTION_VIEW, 'web version viewed'];

const INTRO_DISMISSED = [GATEGORY_INTRO, ACTION_CLICK, 'intro dismissed'];

const INSTALL_SHOWED = [GATEGORY_INSTALL, ACTION_SHOWED, 'install showed'];
const INSTALL_CLICKED = [GATEGORY_INSTALL, ACTION_CLICK, 'install clicked'];
const INSTALL_CANCELLED = [GATEGORY_INSTALL, ACTION_CLICK, 'install cancelled'];
const INSTALLED = [GATEGORY_INSTALL, ACTION_CLICK, 'installed'];

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

export {
  track,
  INSTALLED_VERSION_VIEW,
  WEB_VERSION_VIEW,
  INTRO_DISMISSED,
  INSTALL_SHOWED,
  INSTALL_CLICKED,
  INSTALL_CANCELLED,
  INSTALLED,
};
