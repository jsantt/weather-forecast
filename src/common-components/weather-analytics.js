class WeatherAnalytics extends HTMLElement {
  connectedCallback() {
    /* eslint-disable */
    // galite, see https://github.com/jehna/ga-lite
    (function (e, t, n, i, s, a, c) {
      e[n] =
        e[n] ||
        function () {
          (e[n].q = e[n].q || []).push(arguments);
        };
      a = t.createElement(i);
      c = t.getElementsByTagName(i)[0];
      a.async = true;
      a.rel = 'preconnect';
      a.src = s;
      c.parentNode.insertBefore(a, c);
    })(
      window,
      document,
      'galite',
      'script',
      'https://cdn.jsdelivr.net/npm/ga-lite@2/dist/ga-lite.min.js'
    );

    galite('create', this.getAttribute('key'), 'auto');
    galite('send', 'pageview');
  }
}
window.customElements.define('weather-analytics', WeatherAnalytics);
