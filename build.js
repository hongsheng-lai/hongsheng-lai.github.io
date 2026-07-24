#!/usr/bin/env node
const fs = require("fs");

const md = fs.readFileSync("publications.md", "utf-8");
const entries = [];
const sections = md.split(/^### \d+$/m).slice(1);

for (const section of sections) {
  const entry = {};
  const lines = section.trim().split("\n");
  for (const line of lines) {
    const match = line.match(/^- (\w+(?:_\w+)?): (.+)$/);
    if (match) entry[match[1]] = match[2];
  }
  if (entry.title) entries.push(entry);
}

function renderAuthors(authorsStr) {
  const authors = authorsStr.split(", ");
  const MAX_VISIBLE = 3;

  const formatName = (name) =>
    name.startsWith("**") && name.endsWith("**")
      ? `<strong>${name.slice(2, -2)}</strong>`
      : name;

  if (authors.length <= MAX_VISIBLE) {
    return authors.map(formatName).join(", ");
  }

  const visible = authors.slice(0, MAX_VISIBLE).map(formatName).join(", ");
  const hidden = authors.slice(MAX_VISIBLE).map(formatName).join(", ");

  return `${visible}<span class="authors-ellipsis">...</span><span class="authors-hidden">, ${hidden} <span class="authors-collapse">[-]</span></span>`;
}

const pubItems = entries
  .map((e) => {
    const badgeClass = e.type === "conference" ? "conference" : "preprint";
    const badgeText =
      e.type === "conference" ? "Conference Paper" : "Preprint";
    return `        <li class="pub-item">
          <span class="pub-badge ${badgeClass}">${badgeText}</span>
          <span class="pub-title">${e.title}</span>
          <span class="pub-authors">${renderAuthors(e.authors)}</span>
          <span class="pub-venue">${e.venue} <a href="${e.link_url}" target="_blank">${e.link_text}</a></span>
        </li>`;
  })
  .join("\n\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Publications - Hong-Sheng Lai</title>
    <meta
      name="description"
      content="Publications by Hong-Sheng Lai in computational genomics, bioinformatics, and AI."
    />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <script src="nav.js"></script>

    <main>
      <h1 class="page-title">Publications</h1>

      <ul class="pub-list">
${pubItems}
      </ul>
    </main>

    <footer>
      <p>&copy; 2025 Hong-Sheng Lai</p>
    </footer>
    <script>
      document.querySelectorAll(".authors-ellipsis").forEach(function (el) {
        el.addEventListener("click", function () {
          var parent = this.closest(".pub-authors");
          parent.classList.add("expanded");
          parent.querySelector(".authors-hidden").classList.add("show");
        });
      });
      document.querySelectorAll(".authors-collapse").forEach(function (el) {
        el.addEventListener("click", function () {
          var parent = this.closest(".pub-authors");
          parent.classList.remove("expanded");
          parent.querySelector(".authors-hidden").classList.remove("show");
        });
      });
    </script>
  </body>
</html>
`;

fs.writeFileSync("publications.html", html);
console.log(`Built publications.html with ${entries.length} entries.`);
