import { html } from 'lit-html';
import '../src/weather-forecast.js';

export default {
  title: 'weather-forecast',
};

export const App = () =>
  html`
    <weather-forecast></weather-forecast>
  `;
