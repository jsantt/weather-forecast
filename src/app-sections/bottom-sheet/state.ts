const KEY = 'new-customer';

const STATE = {
  SHOW_INTRO: 'show-intro',
  SHOW_INSTALL_BADGE: 'show-install-badge',
  INSTALL_BADGE_DISMISSED: 'install-badge-dismissed',
};

function getState(): string | null {
  return localStorage.getItem(KEY);
}

function setState(value: string) {
  localStorage.setItem(KEY, value);
}

function isState(value: string | null) {
  return getState() === value;
}

export { isState, setState, STATE };
