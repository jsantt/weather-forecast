import { html, LitElement } from 'lit';

class JsonLd extends LitElement {
  static get is() {
    return 'json-ld';
  }

  render() {
    return html`<script type="application/ld+json">
      ${JSON.stringify(JsonLd.data())}
    </script>`;
  }

  static data() {
    return {
      '@id': 'https://sääennuste.fi/',
      '@context': 'https://schema.org',
      '@type': 'WeatherForecast',
      address: {
        addressCountry: 'Finland',
        addressLocality: 'Espoo',
      },
      dataProvider: 'Ilmatieteen laitos',
      dateIssued: '2016-12-01T10:40:01.00Z',
      validFrom: '2016-12-01T17:00:00.00Z',
      validTo: '2016-12-01T23:00:00.00Z',
    };
  }
}

window.customElements.define(JsonLd.is, JsonLd);
