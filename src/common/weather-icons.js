import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML =
`<iron-iconset-svg name="weather-icons" size="100">
  <svg>
    <defs>

      <g id="close">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          <path d="M0 0h24v24H0z" fill="none"></path>
      </g>

      <g id="iosShare">
          <polyline class="arrow" stroke-width="3" points="40,12 50,2 60,12" fill="none"></polyline>
          <line class="arrow-line" stroke-width="3" x1="50" y1="2" x2="50" y2="45"></line>
          <polyline class="rectangle" stroke-width="3" points="45,20 27,20 27,70 73,70 73,20 55,20" fill="none"></polyline> 
      </g>

      <g id="thermometer">
        <path stroke="#000" stroke-width="1" fill="#fff" d="m19.27125,18.08333l0,-13.16322c0,-1.70222 -1.38385,-3.08056 -3.08423,-3.08056c-1.70406,0 -3.0824,1.37834 -3.0824,3.08056l0,13.05924c-1.93777,1.06182 -3.25354,3.12013 -3.25354,5.48483c0,3.45229 2.799,6.25037 6.25037,6.25037c3.4532,0 6.25036,-2.79808 6.25036,-6.25037c0.00092,-2.29385 -1.23848,-4.29511 -3.08056,-5.38085z"/>
        <rect stroke="#000" stroke-width="1" fill="#ffcdd2" height="11.5625" width="1.4375" y="8.559082" x="15.46875" />
        <ellipse stroke="#000" stroke-width="1" fill="#ffcdd2" ry="3.53125" rx="3.53125" id="svg_7" cy="23.402832" cx="16.0625"/>
      </g>
      
    </defs>
  </svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer.content);
