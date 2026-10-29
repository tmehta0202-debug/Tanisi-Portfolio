# Tanisi Mehta · Portfolio

A single-page portfolio website for **Tanisi Mehta**, a Computational Media student at
Georgia Tech and an aspiring software and product engineer with interaction design skills.
Built with plain **HTML, CSS, and JavaScript** (generated with AI assistance using **Kiro**
and **Claude**), with no build step and no dependencies, so it's ready to host on
**GitHub Pages**.

## Highlights

- Modern, tech-focused design using light blue and soft green accents on white, over a dark
  navy and slate text palette, with **Space Grotesk** for headings and **Inter** for body text
- Sticky navigation with a mobile hamburger menu and active-link scroll-spy highlighting
- Smooth scrolling, a hero with a typing animation, scroll-reveal sections, and subtle hover effects
- Fully **responsive** (desktop → tablet → phone) and **accessible** (keyboard nav, skip link,
  focus rings, reduced-motion support)
- Every project covers the situation, the task, the actions Tanisi took, and the outcome
- The **ER FastTrack** project is featured, noting it was built with **Kiro**

## Project structure

```
TanisiPortfolio/
├── index.html          # All content & sections
├── css/
│   └── styles.css       # Design system + responsive layout
├── js/
│   └── main.js          # Nav, mobile menu, scroll reveal, scroll spy
├── images/
│   └── README.txt       # Where to drop the portrait photo
└── README.md
```

## Add Tanisi's photo

1. Save the photo as **`tanisi.jpg`** inside the **`images/`** folder
   (a portrait / vertical crop looks best, roughly 4:5 ratio, e.g. 800×1000px).
2. That's it. The hero automatically uses it.
   If the file is missing, the site gracefully shows a **"TM" monogram** instead, so the page
   never looks broken.
3. To use a different filename or `.png`, update this line in `index.html`:
   ```html
   <img src="images/tanisi.jpg" alt="Portrait of Tanisi Mehta" ...>
   ```

## Preview locally

Just open `index.html` in a browser, or serve it (recommended):

```bash
cd TanisiPortfolio
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub, e.g. `tanisi-portfolio`
   (or name it `tanisi.github.io` to host at the root domain).
2. Push these files to the repository:
   ```bash
   cd TanisiPortfolio
   git init
   git add .
   git commit -m "Add portfolio site"
   git branch -M main
   git remote add origin https://github.com/<username>/tanisi-portfolio.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment**
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`  ·  **Folder:** `/ (root)`
   - Save.
4. Wait ~1 minute. The site goes live at:
   `https://<username>.github.io/tanisi-portfolio/`

> **Note:** `index.html` must be at the root of the folder you deploy (it is). If you push the
> parent folder instead, set the Pages folder accordingly or move the files to the repo root.

## Editing content

All text lives in `index.html` and is clearly grouped by section
(`Hero`, `About`, `Skills`, `Projects`, `Experience`, `Education`, `Contact`).
Colors and fonts are defined once at the top of `css/styles.css` under `:root`; change them there
to re-theme the whole site.

---

*Portfolio site prepared for Tanisi Mehta.*
