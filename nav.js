(function () {
  const pages = [
    { label: 'About', href: 'index.html' },
    { label: 'Experience', href: 'experience.html' },
    { label: 'Publications', href: 'publications.html' },
    { label: 'Resume', href: 'HongShengLai_Resume.pdf', blank: true },
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';

  const linksHTML = pages.map(function (p) {
    const active = p.href === current ? ' class="active"' : '';
    const target = p.blank ? ' target="_blank"' : '';
    return '<a href="' + p.href + '"' + active + target + '>' + p.label + '</a>';
  }).join('');

  const nav = document.createElement('nav');
  nav.innerHTML =
    '<div class="nav-container">' +
      '<a href="index.html" class="nav-name">Hong-Sheng Lai</a>' +
      '<div class="nav-links">' + linksHTML + '</div>' +
    '</div>';

  document.currentScript.insertAdjacentElement('afterend', nav);
})();
