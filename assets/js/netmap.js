// Network map: renders <div class="netmap" data-src="network.json"> as layers stacked top to bottom
// (devices, network, server, storage). Each group is a card whose "major" node is its title and whose
// other nodes are chips; a "panel" zone is one wide card with its groups as sections. Lines between the
// layers are always drawn; the rest appear when a node is hovered or selected, and a click opens details.
// No dependencies. Used by the docs site (full data) and the portfolio (public, sanitised data).
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    for (var k in attrs || {}) {
      if (attrs[k] == null) continue;
      if (k === "text") el.textContent = attrs[k];
      else if (k === "style") el.style.cssText = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) el.appendChild(c); });
    return el;
  }

  function svgEl(tag, cls) {
    var el = document.createElementNS(SVGNS, tag);
    if (cls) el.setAttribute("class", cls);
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
    var groups = {}, nodes = {}, els = {}, anchors = {};
    (data.groups || []).forEach(function (g) { groups[g.id] = g; });
    data.nodes.forEach(function (n) { nodes[n.id] = n; });

    var adj = {};
    data.edges.forEach(function (e) {
      (adj[e.a] = adj[e.a] || []).push(e);
      (adj[e.b] = adj[e.b] || []).push(e);
    });
    function edgesOf(id) {
      var n = nodes[id];
      return (adj[id] || []).concat(n ? adj[n.group] || [] : []);
    }
    function nameOf(id) { return (nodes[id] || groups[id] || {}).label || id; }
    function colorOf(id) {
      var g = groups[nodes[id] ? nodes[id].group : id];
      return (g && g.color) || "var(--nm-accent)";
    }

    // ---- toolbar
    var search = h("input", { type: "search", class: "nm-search", placeholder: "Find a device or service…", "aria-label": "Find a device or service" });
    var legend = h("div", { class: "nm-legend", role: "group", "aria-label": "Line types" });
    var hiddenTypes = {};
    Object.keys(types).forEach(function (t) {
      var b = h("button", { type: "button", class: "nm-key", "aria-pressed": "true", title: types[t].about || "" }, [
        h("span", { class: "nm-swatch nm-t-" + t }),
        h("span", { text: types[t].label }),
      ]);
      b.addEventListener("click", function () {
        hiddenTypes[t] = !hiddenTypes[t];
        b.setAttribute("aria-pressed", hiddenTypes[t] ? "false" : "true");
        draw();
      });
      legend.appendChild(b);
    });

    // ---- nodes
    function avatar(n) {
      if (n.icon) return h("img", { class: "nm-avatar", src: base + n.icon, alt: "" });
      return h("span", { class: "nm-avatar nm-mono", "aria-hidden": "true", text: n.label.charAt(0) });
    }

    function hookup(el, n) {
      el.addEventListener("mouseenter", function () { hover = n.id; draw(); });
      el.addEventListener("mouseleave", function () { hover = null; draw(); });
      el.addEventListener("focus", function () { hover = n.id; draw(); });
      el.addEventListener("blur", function () { hover = null; draw(); });
      el.addEventListener("click", function (ev) { ev.stopPropagation(); select(selected === n.id ? null : n.id); });
      els[n.id] = el;
    }

    function titleRow(n) {
      var meter = typeof n.meter === "number"
        ? h("span", { class: "nm-meter", title: Math.round(n.meter * 100) + "% used" }, [
            h("span", { style: "width:" + Math.max(3, Math.round(n.meter * 100)) + "%" }),
          ])
        : null;
      var btn = h("button", { type: "button", class: "nm-title", "data-id": n.id }, [
        avatar(n),
        h("span", { class: "nm-title-text" }, [
          h("span", { class: "nm-name", text: n.label }),
          n.sub ? h("span", { class: "nm-sub", text: n.sub }) : null,
          meter,
        ]),
      ]);
      hookup(btn, n);
      return btn;
    }

    function chip(n) {
      var btn = h("button", { type: "button", class: "nm-chip", "data-id": n.id, title: n.sub || null }, [
        h("span", { class: "nm-dot" }),
        h("span", { text: n.label }),
      ]);
      hookup(btn, n);
      anchors[n.id] = btn;
      return btn;
    }

    function chipsOf(g) {
      var list = data.nodes.filter(function (n) { return n.group === g.id && !n.major; });
      if (!list.length) return null;
      var wrap = h("div", { class: "nm-chips" });
      list.forEach(function (n) { wrap.appendChild(chip(n)); });
      return wrap;
    }

    function card(g) {
      var majors = data.nodes.filter(function (n) { return n.group === g.id && n.major; });
      var el = h("div", { class: "nm-card", "data-id": g.id, style: "--c:" + (g.color || "var(--nm-accent)") });
      el.appendChild(h("p", { class: "nm-card-kicker", text: g.label }));
      majors.forEach(function (n) { el.appendChild(titleRow(n)); anchors[n.id] = el; });
      var chips = chipsOf(g);
      if (chips) { el.appendChild(chips); el.classList.add("has-chips"); }
      if (majors.length === 0 && !chips) return null;
      anchors[g.id] = el;
      return el;
    }

    // ---- layers
    var board = h("div", { class: "nm-board" });
    var under = svgEl("svg", "nm-lines");
    var over = svgEl("svg", "nm-lines nm-lines-over");
    under.setAttribute("aria-hidden", "true");
    over.setAttribute("aria-hidden", "true");
    var layers = h("div", { class: "nm-layers" });
    board.appendChild(under);
    board.appendChild(layers);
    board.appendChild(over);

    data.zones.forEach(function (z) {
      var zg = (data.groups || []).filter(function (g) { return g.zone === z.id; });
      var lane = h("section", { class: "nm-lane", "data-zone": z.id }, [
        h("header", { class: "nm-lane-head" }, [
          h("h3", { text: z.label }),
          z.note ? h("p", { text: z.note }) : null,
        ]),
      ]);
      var body;
      if (z.layout === "panel") {
        // One wide card: the major nodes form its header, each group is a section of chips.
        body = h("div", { class: "nm-card nm-panel-card", style: "--c:" + ((zg[0] && zg[0].color) || "var(--nm-accent)") });
        var head = h("div", { class: "nm-panel-head" });
        var sections = h("div", { class: "nm-sections" });
        zg.forEach(function (g) {
          data.nodes.filter(function (n) { return n.group === g.id && n.major; }).forEach(function (n) {
            head.appendChild(titleRow(n));
            anchors[n.id] = body;
          });
          var chips = chipsOf(g);
          if (!chips) return;
          var sec = h("div", { class: "nm-section", "data-id": g.id, style: "--c:" + (g.color || "var(--nm-accent)") }, [
            h("p", { class: "nm-section-title" }, [h("span", { class: "nm-dot" }), h("span", { text: g.label })]),
            chips,
          ]);
          anchors[g.id] = sec;
          els[g.id] = sec;
          sections.appendChild(sec);
        });
        body.appendChild(head);
        body.appendChild(sections);
      } else {
        body = h("div", { class: "nm-row" });
        zg.forEach(function (g) {
          var c = card(g);
          if (c) { els[g.id] = c; body.appendChild(c); }
        });
      }
      lane.appendChild(body);
      layers.appendChild(lane);
    });

    // ---- details panel (on <body>: an animated, transformed ancestor would break position: fixed)
    var panel = h("aside", { class: "nm-panel", hidden: "", "aria-live": "polite" });
    panel.nmOwner = root;

    root.innerHTML = "";
    root.appendChild(h("div", { class: "nm-toolbar" }, [search, legend]));
    root.appendChild(board);
    if (data.caption) root.appendChild(h("p", { class: "nm-caption", text: data.caption }));
    document.body.appendChild(panel);

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
      var seen = {};
      edgesOf(id).forEach(function (e) {
        var mine = e.a === id || e.a === n.group;
        var other = mine ? e.b : e.a;
        if (other === id || seen[other + e.type]) return;
        seen[other + e.type] = true;
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

      var overview = h("div", { class: "nm-tabpanel", role: "tabpanel" });
      [
        n.about ? h("p", { class: "nm-about", text: n.about }) : null,
        (n.facts || []).length ? facts : null,
        links.children.length ? h("p", { class: "nm-kicker", text: "Connects to" }) : null,
        links.children.length ? links : null,
        n.link ? h("a", { class: "nm-more", href: n.link.href, text: n.link.text || "Read the guide →" }) : null,
      ].forEach(function (c) { if (c) overview.appendChild(c); });

      // Overview / Specs tabs, only when there are specs to show.
      var tabs = null, specsPanel = null;
      if ((n.specs || []).length) {
        specsPanel = h("div", { class: "nm-tabpanel", role: "tabpanel", hidden: "" });
        var specs = h("dl", { class: "nm-facts nm-specs" });
        n.specs.forEach(function (f) {
          specs.appendChild(h("dt", { text: f[0] }));
          specs.appendChild(h("dd", { text: f[1] }));
        });
        specsPanel.appendChild(specs);
        tabs = h("div", { class: "nm-tabs", role: "tablist" });
        [["Overview", overview], ["Specs", specsPanel]].forEach(function (t, i) {
          var b = h("button", { type: "button", class: "nm-tab", role: "tab", "aria-selected": i === 0 ? "true" : "false", text: t[0] });
          b.addEventListener("click", function () {
            tabs.querySelectorAll(".nm-tab").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
            overview.hidden = t[1] !== overview;
            specsPanel.hidden = t[1] !== specsPanel;
          });
          tabs.appendChild(b);
        });
      }

      panel.innerHTML = "";
      panel.style.setProperty("--c", colorOf(id));
      [
        close,
        h("p", { class: "nm-kicker", text: [g.label, n.kind].filter(Boolean).join(" · ") }),
        h("h3", { text: n.label }),
        n.sub ? h("p", { class: "nm-panel-sub", text: n.sub }) : null,
        tabs,
        overview,
        specsPanel,
      ].forEach(function (c) { if (c) panel.appendChild(c); });
      panel.hidden = false;
      draw();
    }

    // ---- lines
    function rectIn(el, box) {
      var r = el.getBoundingClientRect();
      return { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top,
               cx: r.left + r.width / 2 - box.left, cy: r.top + r.height / 2 - box.top };
    }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    function pathBetween(A, B) {
      // Different heights: leave the bottom of the upper box and enter the top of the lower one, each
      // point slid toward the other box so lines fan out instead of meeting in one spot.
      if (A.b <= B.t || B.b <= A.t) {
        var up = A.b <= B.t ? A : B, low = up === A ? B : A;
        var x1 = clamp(low.cx, up.l + 14, up.r - 14), y1 = up.b;
        var x2 = clamp(up.cx, low.l + 14, low.r - 14), y2 = low.t;
        var dy = Math.max(24, (y2 - y1) / 2);
        return "M" + x1 + "," + y1 + " C" + x1 + "," + (y1 + dy) + " " + x2 + "," + (y2 - dy) + " " + x2 + "," + y2;
      }
      // Side by side.
      var left = A.cx < B.cx ? A : B, right = left === A ? B : A;
      var sx = left.r, sy = left.cy, ex = right.l, ey = right.cy;
      var dx = Math.max(24, (ex - sx) / 2);
      return "M" + sx + "," + sy + " C" + (sx + dx) + "," + sy + " " + (ex - dx) + "," + ey + " " + ex + "," + ey;
    }

    function draw() {
      [under, over].forEach(function (s) { while (s.firstChild) s.removeChild(s.firstChild); });
      var focus = hover || selected;
      var box = board.getBoundingClientRect();
      [under, over].forEach(function (s) {
        s.setAttribute("viewBox", "0 0 " + box.width + " " + box.height);
        s.setAttribute("width", box.width);
        s.setAttribute("height", box.height);
      });

      var related = {};
      if (focus) {
        related[focus] = true;
        edgesOf(focus).forEach(function (e) { related[e.a] = related[e.b] = true; });
      }
      root.classList.toggle("has-focus", !!focus);
      Object.keys(els).forEach(function (k) {
        var n = nodes[k];
        els[k].classList.toggle("is-related", !!(related[k] || (n && related[n.group])));
      });

      data.edges.forEach(function (e) {
        if (hiddenTypes[e.type]) return;
        var fg = focus && nodes[focus] && nodes[focus].group;
        var lit = !!focus && (e.a === focus || e.b === focus || e.a === fg || e.b === fg);
        if (!e.base && !lit) return;
        var A = anchors[e.a], B = anchors[e.b];
        if (!A || !B || A === B || !A.offsetParent || !B.offsetParent) return;
        var path = svgEl("path", "nm-edge nm-t-" + e.type + (lit ? " is-lit" : "") + (focus && !lit ? " is-dim" : ""));
        path.setAttribute("d", pathBetween(rectIn(A, box), rectIn(B, box)));
        (lit ? over : under).appendChild(path);
      });
    }

    // ---- search: fades everything that doesn't match
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
