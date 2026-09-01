(function () {
  const root = document.getElementById('tool-root');
  if (!root) return;
  const slug = root.dataset.tool;
  const tool = window.BZ_TOOL_DETAILS && window.BZ_TOOL_DETAILS[slug];
  if (!tool) {
    root.innerHTML = '<section class="panel"><h3>Tool details unavailable</h3><p>This tool entry could not be loaded.</p></section>';
    return;
  }

  const repoUrl = `https://github.com/GrizzlyOne95/${tool.repo}`;
  const releasesUrl = `${repoUrl}/releases`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = (items) => `<ul class="tool-list">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const steps = (items) => `<ol class="tool-steps">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;

  // Runtime UI captures are intentionally kept as local site assets so the
  // details pages do not depend on repository README images or external CDNs.
  const screenshotMap = {
    'world-builder': [
      {src: './assets/toolshots/world-builder.png', alt: 'Redux World Builder desktop interface', caption: 'Redux World Builder — runtime UI'}
    ],
    'heightmap-generator': [
      {src: './assets/toolshots/heightmap-generator.png', alt: 'BZR Heightmap Generator desktop interface', caption: 'Heightmap Generator — runtime UI'}
    ],
    'texture-manager': [
      {src: './assets/toolshots/texture-manager.png', alt: 'BZR Texture Manager desktop interface', caption: 'BZR Texture Manager — runtime UI'}
    ],
    'bzradio': [
      {src: './assets/toolshots/bzradio.png', alt: 'BZRadio Audio Architect desktop interface', caption: 'BZRadio — runtime UI'}
    ],
    'localization-tool': [
      {src: './assets/toolshots/localization-tool.png', alt: 'Battlezone Localization Tool desktop interface', caption: 'Localization Tool & ODF Scanner — runtime UI'}
    ],
    'font-generator': [
      {src: './assets/toolshots/font-generator.png', alt: 'BZ Font Sheet Generator desktop interface', caption: 'BZ Font Sheet Generator — runtime UI'}
    ],
    'holotextgen': [
      {src: './assets/toolshots/holotextgen.png', alt: 'HoloTextGen desktop interface', caption: 'HoloTextGen — runtime UI'}
    ],
    'workshop-uploader': [
      {src: './assets/toolshots/workshop-uploader.png', alt: 'Battlezone Workshop Uploader desktop interface', caption: 'Workshop Uploader — runtime UI'}
    ],
    'mod-engine': [
      {src: './assets/toolshots/mod-engine.png', alt: 'Battlezone Mod Engine desktop interface', caption: 'Battlezone Mod Engine — runtime UI'}
    ],
    'lobby-monitor': [
      {src: './assets/toolshots/lobby-monitor.png', alt: 'Battlezone Lobby Monitor desktop interface', caption: 'Battlezone Lobby Monitor — runtime UI'}
    ],
    'bzn-scanner': [
      {src: './assets/toolshots/bzn-scanner.png', alt: 'BZN Scanner desktop interface', caption: 'BZN Scanner — runtime UI'}
    ],
    'zfs-specialist': [
      {src: './assets/toolshots/zfs-specialist.png', alt: 'ZFS Specialist archive explorer interface', caption: 'ZFS Specialist — runtime UI'}
    ],
    'psp-extractor': [
      {src: './assets/toolshots/psp-extractor.png', alt: 'Battlezone PSP Extractor desktop interface', caption: 'BZ PSP Extractor — runtime UI'}
    ],
    'gold-extractor': [
      {src: './assets/toolshots/gold-extractor.png', alt: 'Battlezone Gold Extractor desktop interface', caption: 'Battlezone Gold Extractor — runtime UI'}
    ]
  };

  const screenshots = screenshotMap[slug] || [];
  const screenshotGallery = screenshots.length ? `
    <div class="section-rule"><h2>Interface</h2><span class="code">// RUNTIME CAPTURE</span></div>
    <section class="tool-screenshot-panel panel" aria-label="${esc(tool.name)} interface screenshots">
      <div class="tool-screenshot-grid ${screenshots.length === 1 ? 'single' : ''}">
        ${screenshots.map((shot) => `
          <figure class="tool-screenshot">
            <a href="${esc(shot.src)}" target="_blank" rel="noopener" aria-label="Open full-size ${esc(tool.name)} screenshot">
              <img src="${esc(shot.src)}" alt="${esc(shot.alt)}" loading="eager" decoding="async">
            </a>
            <figcaption>${esc(shot.caption)}</figcaption>
          </figure>`).join('')}
      </div>
    </section>` : '';

  document.title = `GrizzlyOne95 // ${tool.name}`;
  const h1 = document.querySelector('.page-titlebar h1');
  const subtitle = document.querySelector('.page-titlebar p:last-child');
  const eyebrow = document.querySelector('.page-titlebar .eyebrow');
  if (h1) h1.textContent = tool.name;
  if (subtitle) subtitle.textContent = tool.tagline;
  if (eyebrow) eyebrow.textContent = `BATTLEZONE // TOOL // ${tool.category.toUpperCase()}`;

  root.innerHTML = `
    <section class="tool-intro panel">
      <span class="label">${esc(tool.category)}</span>
      <p class="tool-summary">${esc(tool.overview)}</p>
      <div class="tool-actions">
        <a class="tool-download" href="${releasesUrl}" target="_blank" rel="noopener">Download / Releases ↗</a>
        <a class="small-button" href="${repoUrl}" target="_blank" rel="noopener">Repository ↗</a>
        <a class="small-button" href="./battlezone-tools.html">← All Tools</a>
      </div>
    </section>

    ${screenshotGallery}

    <div class="tool-grid">
      <section class="tool-section">
        <div class="section-rule"><h2>Capabilities</h2><span class="code">// FEATURES</span></div>
        ${list(tool.features)}
      </section>
      <section class="tool-section">
        <div class="section-rule"><h2>Requirements</h2><span class="code">// SETUP</span></div>
        ${list(tool.requirements)}
      </section>
    </div>

    <div class="section-rule"><h2>Run From Source</h2><span class="code">// DEVELOPERS</span></div>
    <section class="panel tool-code-panel">
      <p>For users, the easiest path is the <a href="${releasesUrl}" target="_blank" rel="noopener">GitHub Releases page</a>. To run the current source version:</p>
      <pre><code>${esc(tool.sourceRun)}</code></pre>
    </section>

    <div class="section-rule"><h2>Usage</h2><span class="code">// WORKFLOWS</span></div>
    <div class="tool-workflows">
      ${tool.workflows.map((flow, i) => `
        <section class="panel tool-workflow">
          <span class="label">Workflow ${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(flow.title)}</h3>
          ${steps(flow.steps)}
        </section>`).join('')}
    </div>

    <div class="section-rule"><h2>Notes</h2><span class="code">// READ BEFORE USE</span></div>
    <section class="panel">${list(tool.notes)}</section>

    <div class="tool-footer-actions">
      <a class="tool-download" href="${releasesUrl}" target="_blank" rel="noopener">Download / Releases ↗</a>
      <a class="small-button" href="${repoUrl}" target="_blank" rel="noopener">View Source ↗</a>
    </div>
    <div class="status-line"><span>BATTLEZONE // TOOL DETAILS</span><span>${esc(tool.name.toUpperCase())}</span></div>
  `;
})();