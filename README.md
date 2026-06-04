# Will You Go On A Date With Me? 💖

A playful, mobile-friendly little web app that asks someone out — complete with a
heart that beats, a **"No" button that runs away from the cursor** (so the only
answer is yes 😏), party-popper confetti, a custom pink calendar, and a final
recap of the plan.

Built as a single static frontend — **no database, no build step, no accounts.**
Just open it in a browser, or host it anywhere and share the link.

---

## ✨ Features

- **The big question** with a beating *Yes 💖* button and a *No* that dodges every
  cursor move (desktop) and every tap (mobile).
- A surprised reaction + **confetti burst** when she says yes.
- **"When are you free?"** — a custom pink calendar (past dates locked) and time
  slots (6–10 PM), each with a flirty one-liner.
- **"What would you like to have?"** — cuisine picker with emoji clip-art.
- **"It's a Date!!"** recap screen showing the chosen day, time, and food.
- A 💖 **progress bar** along the top — hearts colour in as you advance.
- Fully responsive (phones + computers), hand-coded confetti, zero external
  JS libraries.

---

## 📁 Project structure

```
date-with-me/
├── index.html          ← the page (open this)
├── css/
│   └── styles.css      ← all the styling
├── js/
│   └── script.js       ← all the interactivity
├── server/             ← OPTIONAL backend (only if you want to collect her answer)
│   ├── server.js
│   ├── package.json
│   └── README.md
├── README.md
├── LICENSE
└── .gitignore
```

The frontend is everything in the root (`index.html`, `css/`, `js/`). The
`server/` folder is optional — see [its README](server/README.md).

---

## ▶️ Run it locally

**The simple way:** double-click `index.html`. It opens in your browser and
works completely.

**The "with the backend" way** (lets you record her answer):

```bash
cd server
npm install
npm start
# then open http://localhost:3000
```

---

## 🚀 Put it online (get a shareable link)

Pick whichever is easiest for you. The first two take about a minute.

### Option A — tiiny.host (easiest)
1. Go to **https://tiiny.host**
2. Drag your `index.html` onto the page (a single HTML file is fine), or zip the
   `css`, `js`, and `index.html` together and drop the zip.
3. Choose a link name, click **Publish**, and share the link.
4. Make a free account so the link stays live.

### Option B — Netlify Drop
1. Go to **https://app.netlify.com/drop**
2. Drag the whole project folder (the one containing `index.html`) onto the page.
3. You get a live link instantly. Click **Claim this site** / sign up free so it
   isn't auto-deleted.

### Option C — GitHub Pages (free + permanent, uses this repo)
1. Push this repo to GitHub (steps below).
2. On GitHub, open the repo → **Settings → Pages**.
3. Under **Build and deployment**, set **Source = Deploy from a branch**,
   branch = `main`, folder = `/ (root)`, then **Save**.
4. Wait ~1 minute and refresh — your live URL appears at the top of that page.

> Tip for a date invite: use a method where you've signed in / claimed the site
> so the link doesn't quietly expire before she opens it.

---

## 🐙 Push this to GitHub

### The no-typing way — GitHub Desktop
1. Install **GitHub Desktop** from https://desktop.github.com
2. *File → Add Local Repository* → choose this `date-with-me` folder.
3. Click **Publish repository**. Done.

### The command-line way
First create a new, **empty** repository on https://github.com/new
(don't add a README — this folder already has one). Then:

```bash
cd date-with-me

git init
git add .
git commit -m "Will you go on a date with me 💖"
git branch -M main

# replace YOUR-USERNAME with your GitHub username:
git remote add origin https://github.com/YOUR-USERNAME/date-with-me.git
git push -u origin main
```

After that, any future change is just:

```bash
git add .
git commit -m "your message"
git push
```

---

## 🛠️ Tech

Plain **HTML + CSS + JavaScript** — no frameworks, no dependencies for the
frontend. The optional backend uses **Node.js + Express**. Fonts load from
Google Fonts (with graceful fallbacks if offline).

## 📄 License

MIT — see [LICENSE](LICENSE). Open the file and pop your name in the copyright line.

---

Made with 💖. Good luck — go get that yes.
