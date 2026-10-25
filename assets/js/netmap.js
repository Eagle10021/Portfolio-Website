// Network map: renders <div class="netmap" data-src="network.json"> as zones of clickable nodes with
// connection lines. Hover or click a node to light up its links; click opens a details panel.
// No dependencies. Used by the docs site (full data) and the portfolio (public, sanitised data).
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") el.textContent = attrs[k];
      else if (k === "style") el.style.cssText = attrs[k];
      else if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) el.appendChild(c); });
    return el;
  }

  function mount(root) {
    if (root.dataset.mounted) return;
    root.dataset.mounted = "1";
    fetch(root.dataset.src)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { render(root, data); })
      .catch(function () { root.textContent = "The network map couldn't be loaded."; });
  }

  function render(root, data) {
    var base = root.dataset.src.replace(/[^/]*$/, "");   // icons are relative to the data file
    var types = data.edgeTypes || {};
    var groups = {}, nodes = {}, els = {};
    (data.groups || []).forEach(function (g) { groups[g.id] = g; });
    data.nodes.forEach(function (n) { nodes[n.id] = n; });

    // Links per node (a link to a group counts for every node in it).
    var adj = {};
    function link(id, e) { (adj[id] = adj[id] || []).push(e); }
    data.edges.forEach(function (e) { link(e.a, e); link(e.b, e); });

    function nameOf(id) { return (nodes[id] || groups[id] || {}).label || id; }
    function colorOf(id) {
      var n = nodes[id], g = groups[n ? n.group : id];
      return (g && g.color) || "var(--nm-accent)";
    }

    // ---- toolbar: search + legend (click a line type to show only those lines)
    var search = h("input", { type: "search", class: "nm-search", placeholder: "Find a device or service…", "aria-label": "Find a device or service" });
    var legend = h("div", { class: "nm-legend" });
    var hiddenTypes = {};
    Object.keys(types).forEach(function (t) {
      var b = h("button", { type: "button", class: "nm-key", "data-type": t, "aria-pressed": "true", title: types[t].about || "" }, [
        h("span", { class: "nm-swatch nm-t-" + t }),
        document.createTextNode(types[t].label),
      ]);
      b.addEventListener("click", function () {
        hiddenTypes[t] = !hiddenTypes[t];
        b.setAttribute("aria-pressed", hiddenTypes[t] ? "false" : "true");
        draw();
      });
      legend.appendChild(b);
    });

    // ---- board: zones > groups > nodes
    var board = h("div", { class: "nm-board" });
    var svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "nm-lines");
    svg.setAttribute("aria-hidden", "true");
    board.appendChild(svg);
    var grid = h("div", { class: "nm-zones" });
    board.appendChild(grid);

    data.zones.forEach(function (z) {
      var zone = h("section", { class: "nm-zone", "data-zone": z.id, style: z.span ? "--span:" + z.span : null }, [
        h("header", { class: "nm-zone-head" }, [
          h("h3", { text: z.label }),
          z.note ? h("p", { text: z.note }) : null,
        ]),
      ]);
      var inner = h("div", { class: "nm-zone-body" + (z.cols ? " nm-cols-" + z.cols : "") });
      zone.appendChild(inner);
      (data.groups || []).filter(function (g) { return g.zone === z.id; }).forEach(function (g) {
        var box = h("div", { class: "nm-group", "data-id": g.id, style: "--c:" + (g.color || "var(--nm-accent)") });
        if (g.label) box.appendChild(h("h4", { text: g.label }));
        var list = h("div", { class: "nm-nodes" });
        data.nodes.filter(function (n) { return n.group === g.id; }).forEach(function (n) {
          var icon = n.icon
            ? h("img", { class: "nm-icon", src: base + n.icon, alt: "" })
            : h("span", { class: "nm-dot" });
          var btn = h("button", { type: "button", class: "nm-node" + (n.major ? " nm-major" : ""), "data-id": n.id }, [
            icon,
            h("span", { class: "nm-text" }, [
              h("span", { class: "nm-label", text: n.label }),
              n.sub ? h("span", { class: "nm-sub", text: n.sub }) : null,
            ]),
          ]);
          btn.addEventListener("mouseenter", function () { hover = n.id; draw(); });
          btn.addEventListener("mouseleave", function () { hover = null; draw(); });
          btn.addEventListener("focus", function () { hover = n.id; draw(); });
          btn.addEventListener("blur", function () { hover = null; draw(); });
          btn.addEventListener("click", function () { select(selected === n.id ? null : n.id); });
          els[n.id] = btn;
          list.appendChild(btn);
        });
        box.appendChild(list);
        els[g.id] = box;
        inner.appendChild(box);
      });
      grid.appendChild(zone);
    });

    // ---- details panel
    // Lives on <body>: an animated (transformed) ancestor would break position: fixed.
    var panel = h("aside", { class: "nm-panel", hidden: "", "aria-live": "polite" });
    panel.nmOwner = root;

    root.innerHTML = "";
    root.appendChild(h("div", { class: "nm-toolbar" }, [search, legend]));
    root.appendChild(board);
    document.body.appendChild(panel);
    if (data.caption) root.appendChild(h("p", { class: "nm-caption", text: data.caption }));

    var hover = null, selected = null;

    function select(id) {
      selected = id;
      Object.keys(els).forEach(function (k) { els[k].classList.toggle("is-selected", k === id); });
      if (!id) { panel.hidden = true; draw(); return; }
      var n = nodes[id], g = groups[n.group] || {};
      var facts = h("dl", { class: "nm-facts" });
      (n.facts || []).forEach(function (f) {
        facts.appendChild(h("dt", { text: f[0] }));
        facts.appendChild(h("dd", { text: f[1] }));
      });
      var links = h("ul", { class: "nm-links" });
      (adj[id] || []).concat(adj[n.group] || []).forEach(function (e) {
        var other = e.a === id || e.a === n.group ? e.b : e.a;
        var target = nodes[other] ? other : null;
        var item = h(target ? "button" : "span", { type: target ? "button" : null, class: "nm-link" }, [
          h("span", { class: "nm-swatch nm-t-" + e.type }),
          h("span", { text: nameOf(other) + (e.label ? " · " + e.label : "") }),
        ]);
        if (target) item.addEventListener("click", function () { select(target); els[target].focus({ preventScroll: true }); });
        links.appendChild(h("li", {}, [item]));
      });
      var close = h("button", { type: "button", class: "nm-close", "aria-label": "Close details", text: "×" });
      close.addEventListener("click", function () { select(null); });
      panel.innerHTML = "";
      panel.style.setProperty("--c", colorOf(id));
      [
        close,
        h("p", { class: "nm-kicker", text: [g.label, n.kind].filter(Boolean).join(" · ") }),
        h("h3", { text: n.label }),
        n.about ? h("p", { class: "nm-about", text: n.about }) : null,
        (n.facts || []).length ? facts : null,
        links.children.length ? h("p", { class: "nm-kicker", text: "Connects to" }) : null,
        links.children.length ? links : null,
        n.link ? h("a", { class: "nm-more", href: n.link.href, text: n.link.text || "Read the guide →" }) : null,
      ].forEach(function (c) { if (c) panel.appendChild(c); });
      panel.hidden = false;
      draw();
    }

    // ---- lines
    function anchor(el, toward, box) {
      var r = el.getBoundingClientRect();
      var x = toward > r.left + r.width / 2 ? r.right : r.left;
      return { x: x - box.left, y: r.top + r.height / 2 - box.top, side: x === r.right ? 1 : -1 };
    }

    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var focus = hover || selected;
      var box = board.getBoundingClientRect();
      svg.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
      svg.setAttribute("width", box.width);
      svg.setAttribute("height", box.height);

      var related = {};
      if (focus) {
        related[focus] = true;
        var fg = nodes[focus] && nodes[focus].group;
        (adj[focus] || []).concat(adj[fg] || []).forEach(function (e) { related[e.a] = related[e.b] = true; });
      }
      root.classList.toggle("has-focus", !!focus);
      Object.keys(els).forEach(function (k) {
        var inGroup = nodes[k] && related[nodes[k].group];
        els[k].classList.toggle("is-related", !!(related[k] || inGroup));
      });

      data.edges.forEach(function (e) {
        if (hiddenTypes[e.type]) return;
        var fg = focus && nodes[focus] && nodes[focus].group;
        var lit = focus && (e.a === focus || e.b === focus || e.a === fg || e.b === fg);
        if (!e.base && !lit) return;
        var A = els[e.a], B = els[e.b];
        if (!A || !B || !A.offsetParent || !B.offsetParent) return;
        var ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect();
        var p = anchor(A, rb.left + rb.width / 2, box), q = anchor(B, ra.left + ra.width / 2, box);
        var dx = Math.max(40, Math.abs(q.x - p.x) / 2);
        var d = "M" + p.x + "," + p.y + " C" + (p.x + p.side * dx) + "," + p.y + " " + (q.x + q.side * dx) + "," + q.y + " " + q.x + "," + q.y;
        var path = document.createElementNS(SVGNS, "path");
        path.setAttribute("d", d);
        path.setAttribute("class", "nm-edge nm-t-" + e.type + (lit ? " is-lit" : "") + (focus && !lit ? " is-dim" : ""));
        svg.appendChild(path);
      });
    }

    // ---- search: dims everything that doesn't match
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      data.nodes.forEach(function (n) {
        var hay = [n.label, n.sub, n.kind, n.about, (groups[n.group] || {}).label].join(" ").toLowerCase();
        els[n.id].classList.toggle("is-miss", !!q && hay.indexOf(q) === -1);
      });
    });

    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && selected) select(null); });
    if (window.ResizeObserver) new ResizeObserver(draw).observe(board);
    window.addEventListener("resize", draw);
    draw();
  }

  function mountAll() {
    // After an instant page change, drop panels whose map is gone.
    document.querySelectorAll("body > .nm-panel").forEach(function (p) {
      if (!document.contains(p.nmOwner)) p.remove();
    });
    document.querySelectorAll(".netmap[data-src]").forEach(mount);
  }

  // The docs site swaps pages without reloading (document$ fires on each); the portfolio is a plain page.
  if (window.document$ && window.document$.subscribe) window.document$.subscribe(mountAll);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll);
  else mountAll();
})();
