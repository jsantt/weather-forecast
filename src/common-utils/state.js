const KEY = 'new-customer';

const STATE = {
  SHOW_INTRO: 'show-intro',
  SHOW_INSTALL_BADGE: 'show-install-badge',
  INSTALL_BADGE_DISMISSED: 'install-badge-dismissed',
};

function getState() {
  return localStorage.getItem(KEY);
}

function setState(value) {
  localStorage.setItem(KEY, value);
  // console.log(`state changed to ${value}`);
}

function isState(value) {
  return getState() === value;
}

export { getState, isState, setState, STATE };
