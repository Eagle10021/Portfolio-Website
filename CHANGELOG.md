# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-10-23

### Added
- **New single-page portfolio** (`index.html`): About, Experience, Projects, Skills, Education, Photography and Contact, with a sticky nav that highlights the current section and a mobile menu.
- **Experience** from my latest resumes: IT Support Specialist co-op at Prysmian Group, freelance IT support, Thousand Islands Toyota co-op, BarBurrito, and volunteer photography.
- **Projects**: featured write-ups of my Phrolova home server and the Fairy voice assistant, plus cards for Legion Control, Custom Cursors for Linux, BeamNG Livery Maker, Arona SDDM Login, Algonquin Printing on Linux, Lumen New Tab, Offline Wikipedia "Ask" and the Music Genre Tagger.
- **anime.js v4 animations**: split-letter hero, scroll reveals, count-ups, Sunset Mirai sparks and music fades, all disabled under *reduce motion*.
- **Photo lightbox** and web-sized WebP copies of the gallery (`images/web/`).
- **Resume PDF** (`assets/Arshdeep-Sahota-Resume.pdf`) generated from `resume/resume.html`.
- **Favicon** (`assets/favicon.svg`).

### Changed
- **Both themes redesigned** and merged into one page: Standard and Sunset Mirai are now CSS variable sets, switched in place and remembered between visits.
- **Music is off until the ♪ button is clicked**, then cross-fades between the two tracks when the theme changes.
- **Contact** shows only email, GitHub and the resume.
- Replaced GSAP with anime.js.

### Moved
- The original course-lab pages, `styles.css`, `cyber.css`, `cyber.js` and friends are now in `legacy/` (paths fixed) and linked from a Coursework section.

## [2.0.0] - 2025-12-29

### Added
- **Sunset Mirai Theme (Cyber Mode)**: A complete alternative visual experience available via the toggle button.
  - New dedicated pages: `cyber-index.html`, `cyber-projects.html`, `cyber-gallery.html`, `cyber-resume.html`, `cyber-interactive.html`.
  - Custom Styles (`cyber.css`): Features premium glassmorphism, floating particular animations, and dynamic lighting effects.
  - Interactive Logic (`cyber.js`): Controls atmospheric effects (spirit orbs, falling petals) and state management.
- **Advanced Audio Engine**:
  - **Dual Track Support**:
    - Standard Mode: Plays *"Origami"* by Scott Buckley.
    - Cyber Mode: Plays *"Snowfall"* by Scott Buckley.
  - **Smart Fading System**: Implemented seamless fade-in on page load and continuous looping with cross-fades (fades out 4s before end, fades in 4s on restart).
  - **State Persistence**: Audio playback position, mute status, and volume preference are preserved across all page navigations.
  - **Premium UI Controls**: Added a vertical glassmorphism volume slider with a "Spirit Thumb" and rising glow fill, alongside a unified control dock for muting and theme toggling.
- **Documentation**:
  - `CREDITS.md`: Added detailed attribution for all audio tracks and photography assets.

### Changed
- **Footer Updates**: Synchronized footers across all Standard and Cyber pages to include accurate music attribution and copyright info.
- **Audio Assets**: Replaced placeholder Lo-Fi tracks with high-quality compositions by Scott Buckley.
