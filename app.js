(() => {
  const config = window.DEXJOCO_PROJECT;
  const setLink = (id, url, available, label) => {
    const link = document.getElementById(id);
    if (!available || !url) return;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.removeAttribute("aria-disabled");
    link.querySelector(".soon")?.remove();
    if (label) link.textContent = label;
  };
  setLink("arxiv-link", config.arxivUrl, Boolean(config.arxivUrl));
  if (!config.arxivUrl && config.arxivStatus === "submitted") {
    const link = document.getElementById("arxiv-link");
    link.querySelector(".soon").textContent = "submitted";
    link.setAttribute("aria-label", "arXiv preprint submitted; public link pending");
  }
  setLink("code-link", config.codeUrl, config.codePublic);
  setLink("data-link", config.datasetUrl, config.datasetPublic);
  setLink("code-resource", config.codeUrl, config.codePublic, "Explore code ↗");
  setLink("data-resource", config.datasetUrl, config.datasetPublic, "Download data ↗");

  if (config.authors.length) {
    const authors = document.getElementById("authors");
    authors.hidden = false;
    for (const author of config.authors) {
      const element = document.createElement(author.url ? "a" : "span");
      element.className = "author";
      element.textContent = author.name;
      if (author.url) { element.href = author.url; element.rel = "noopener"; }
      if (author.mark) {
        const mark = document.createElement("sup");
        mark.textContent = author.mark;
        element.append(mark);
      }
      authors.append(element);
    }
    if (config.affiliations.length) {
      const affiliations = document.createElement("p");
      affiliations.className = "affiliations";
      affiliations.textContent = config.affiliations.join(" · ");
      authors.append(affiliations);
    }
    if (config.authorNote) {
      const note = document.createElement("p");
      note.className = "affiliations";
      note.textContent = config.authorNote;
      authors.append(note);
    }
  }

  if (config.citation) {
    document.getElementById("citation-card").hidden = false;
    document.getElementById("citation").textContent = config.citation;
    document.getElementById("copy-citation").addEventListener("click", async () => {
      const status = document.getElementById("copy-status");
      try {
        await navigator.clipboard.writeText(config.citation);
        status.textContent = "Citation copied.";
        document.getElementById("copy-citation").textContent = "Copied";
      } catch {
        status.textContent = "Select the citation text and copy it.";
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(document.getElementById("citation"));
        selection.removeAllRanges(); selection.addRange(range);
      }
    });
  }

  const dialog = document.getElementById("figure-dialog");
  const content = dialog.querySelector(".dialog-content");
  const zoom = document.getElementById("figure-zoom");
  for (const button of document.querySelectorAll("[data-figure]")) {
    button.addEventListener("click", () => {
      const image = document.getElementById("dialog-image");
      image.src = button.dataset.figure;
      image.alt = button.dataset.title;
      document.getElementById("dialog-title").textContent = button.dataset.title;
      content.classList.remove("original");
      zoom.textContent = "Original size";
      dialog.showModal();
      document.body.style.overflow = "hidden";
    });
  }
  zoom.addEventListener("click", () => {
    const original = content.classList.toggle("original");
    zoom.textContent = original ? "Fit to window" : "Original size";
  });
  document.getElementById("figure-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { document.body.style.overflow = ""; });
})();
