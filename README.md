# Portfolio Website: Arshdeep Singh Sahota

My personal portfolio: IT support experience, the home server and voice assistant I run, open-source projects, education and photography, all on one page.

**[View the site](https://manifest.01blue.org)**

---

## Features

* **One page, seven sections:** About, Experience, Projects, Skills, Education, Photography and Contact, with a sticky nav that highlights where you are.
* **Two themes**, switched with the button at the top right and remembered between visits:
  * **Standard:** light, clean and easy to read.
  * **Sunset Mirai:** dark dusk gradient, glass panels, the red spider lily and drifting sparks.
* **Animations with [anime.js](https://animejs.com) v4:** split-letter hero title, scroll reveals, count-up numbers, the Sunset Mirai sparks and the music fades. Everything respects *reduce motion* and the page works without JavaScript.
* **Music, off by default:** the ♪ button plays "Origami" (Standard) or "Snowfall" (Sunset Mirai) by Scott Buckley, and cross-fades when you switch themes.
* **Photo gallery** with a lightbox. Photos are served as WebP thumbnails plus full-size WebP; the originals stay in `images/`.
* **Resume PDF** built from `resume/resume.html`.
* **Coursework:** the original Algonquin lab pages (Flexbox, Grid, Bootstrap, JavaScript) are kept in `legacy/` and linked from the Projects section.

## Project Structure

| Path | What it is |
| :--- | :--- |
| `index.html` | The whole site |
| `assets/css/site.css` | Styles; both themes are CSS variables under `[data-theme="standard"]` and `[data-theme="mirai"]` |
| `assets/js/site.js` | Animations, theme toggle, music, menu, lightbox (ES module, loads anime.js from jsDelivr) |
| `assets/favicon.svg` | Site icon |
| `assets/Arshdeep-Sahota-Resume.pdf` | The resume linked from the site (generated, see below) |
| `resume/resume.html` | Source of the resume PDF |
| `images/web/` | Web-sized WebP images used by the site |
| `images/` | Original photos |
| `audio/` | Theme music |
| `legacy/` | The original course-lab version of the site |

## Editing

* **Text and projects:** all in `index.html`; each section is marked with a comment.
* **Colours and fonts:** the variables at the top of `assets/css/site.css`.
* **Music tracks:** `TRACKS` near the middle of `assets/js/site.js`.
* **Resume:** edit `resume/resume.html`, then rebuild the PDF with any Chromium browser:
  ```bash
  microsoft-edge-stable --headless=new --no-pdf-header-footer --virtual-time-budget=5000 \
    --print-to-pdf=assets/Arshdeep-Sahota-Resume.pdf "file://$PWD/resume/resume.html"
  ```
  (`chromium` or `google-chrome` take the same flags.) Keep it to one page.

## Credits

Music by [Scott Buckley](https://www.scottbuckley.com.au) (CC BY 4.0). Animations by [anime.js](https://animejs.com) (MIT). Photos are my own. Full details in **[CREDITS.md](CREDITS.md)**.

## Contact

* **Email:** [eagle.sahota@gmail.com](mailto:eagle.sahota@gmail.com)
* **GitHub:** [Eagle10021](https://github.com/Eagle10021)

&copy; 2026 Arshdeep Singh Sahota. All Rights Reserved.
