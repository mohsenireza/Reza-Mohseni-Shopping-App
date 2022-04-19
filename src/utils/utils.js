export const rgbTohex = (rgb) =>
  `#${rgb
    .match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    .slice(1)
    .map((n) => parseInt(n, 10).toString(16).padStart(2, '0'))
    .join('')}`;

export const rgbaTohex = (rgba) =>
  `#${rgba
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
    .slice(1)
    .map((n, i) =>
      (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
        .toString(16)
        .padStart(2, '0')
        .replace('NaN', '')
    )
    .join('')}`;

export const jsonDeepClone = (json) => JSON.parse(JSON.stringify(json));

export const getSearchParam = (name) => {
  var match = RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(
    window.location.search
  );
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

export const isInternetExplerer = () => {
  // Check the userAgent property of the window.navigator object
  const { userAgent } = window.navigator;
  // IE 10 or older
  const msieIndex = userAgent.indexOf('MSIE ');
  // IE 11
  const tridentIndex = userAgent.indexOf('Trident/');

  return msieIndex > 0 || tridentIndex > 0;
};
