export { isSafari, isPortableApple, isWebView };

function isSafari() {
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

function isPortableApple() {
  return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
}

function isWebView() {
  return (
    window.navigator.userAgent.indexOf('FBAN') > 0 ||
    window.navigator.userAgent.indexOf('FBAV') > 0
  );
}
