# Portfolio Website: Arshdeep Singh Sahota

A dual-experience personal portfolio that bridges the gap between professional presentation and immersive artistic expression. This project showcases my academic journey, technical skills, and creative interests through two distinct, fully-realized visual themes.

**[View Live Demo](https://eagle10021.github.io/Portfolio-Website/)**

---

## 🌟 Key Features

### 🌗 Dual Theme System
The website features a seamless toggle between two completely unique worlds:
*   **Standard Mode**: A clean, high-contrast, professional interface using modern CSS Flexbox and Grid layouts. Optimized for readability and accessibility.
*   **Sunset Mirai Mode (Cyber Theme)**: An immersive, anime-inspired alternative experience featuring:
    *   **Dynamic Atmospherics**: Floating spirit/petal particles and subtle lighting effects.
    *   **Premium Glassmorphism**: Frosted glass UI elements for controls and navigation.
    *   **GSAP Animations**: Smooth scroll-triggered reveals and entry animations.

### 🎧 Advanced Audio Engine
A fully custom Javascript audio engine designed for a continuous, non-intrusive auditory experience:
*   **Context-Aware Playback**:
    *   *Standard Mode*: Plays **"Origami"** by Scott Buckley (Professional & Crisp).
    *   *Sunset Mode*: Plays **"Snowfall"** by Scott Buckley (Calm & Ambient).
*   **Smart Transitions**: Audio seamlessly cross-fades when switching themes or reloading pages (Fades in on load, fades out/in on loops).
*   **State Persistence**: The system remembers your **Volume**, **Playback Position**, and **Mute Status** across all page navigations.
*   **Custom UI**: A vertically oriented glass-morphism volume slider with dynamic glow effects and a "Spirit Thumb".

### 💻 Tech Stack
*   **Core**: HTML5, CSS3, JavaScript (ES6+)
*   **Animation**: [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform) & ScrollTrigger
*   **Design**: CSS Variables for theming, Flexbox/Grid for layout, SVG for iconography.

---

## 📂 Project Structure

*   `*.html`: Standard professional pages.
*   `cyber-*.html`: Counterpart pages for the Sunset Mirai theme.
*   `styles.css`: Core styles for the standard theme.
*   `cyber.css`: Overrides and unique styles for the Cyber theme.
*   `cyber.js`: Logic for the audio engine, particle effects, and state management.
*   `audio/`: High-quality audio assets (Optimized MP3s).

---

## 📜 Credits & Attribution

This project is built with respect for creators. Full attribution for all audio tracks and visual assets can be found in **[CREDITS.md](CREDITS.md)**.

*   **Audio**: Music by [Scott Buckley](https://www.scottbuckley.com.au) (CC-BY 4.0).
*   **Photography**: All gallery images captured by Arshdeep Singh Sahota.

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Eagle10021/Portfolio-Website.git
    ```
2.  **Navigate to Directory**:
    ```bash
    cd Portfolio-Website
    ```
3.  **Launch**:
    Simply open `index.html` in any modern web browser. No build step or local server is strictly required, though a live server is recommended for the best audio behavior.

---

## 📫 Contact

*   **Email**: eagle.sahota@gmail.com
*   **LinkedIn**: [Arshdeep Sahota](https://www.linkedin.com/in/arshdeep-sahota-864135242/)

&copy; 2025 Arshdeep Singh Sahota. All Rights Reserved.
