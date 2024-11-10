function isSafari(): boolean {
  const { userAgent } = window.navigator;
  return (
    !/CriOS/.test(userAgent) &&
    !/FxiOS/.test(userAgent) &&
    !/OPiOS/.test(userAgent) &&
    !/mercury/.test(userAgent) &&
    userAgent.indexOf('FBAN') < 0 &&
    userAgent.indexOf('FBAV') < 0
  );
}

function isPortableApple(): boolean {
  return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
}

function isWebView(): boolean {
  return (
    window.navigator.userAgent.indexOf('FBAN') > 0 ||
    window.navigator.userAgent.indexOf('FBAV') > 0
  );
}

export { isSafari, isPortableApple, isWebView };
