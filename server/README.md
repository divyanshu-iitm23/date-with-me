# Optional backend 🛎️

**You do not need this folder to send the app to your girlfriend.**

The frontend (in the project root) is a complete, self-contained static site. If you just want to share the link, ignore this folder and deploy the root folder to Netlify / tiiny.host / GitHub Pages (see the main README).

## What this adds

If you run this little server, you actually get to **see what she picked**. When she reaches the final *"It's a Date!!"* screen, the app quietly sends her answer here, and the server:

- saves it to `responses.json`, and
- prints it in your terminal.

## Run it

You'll need [Node.js](https://nodejs.org) installed (version 18 or newer).

```bash
cd server
npm install
npm start
```

Then open **http://localhost:3000** in your browser. The whole app runs from here, and any answer gets recorded to `server/responses.json`.

## Want it emailed to you instead?

This stays deliberately simple (it just saves to a file). To get an email when she says yes, you can add a service like [Nodemailer](https://nodemailer.com) or [Resend](https://resend.com) inside the `/api/response` handler in `server.js`. Happy to help you wire that up.

## Note

`responses.json` is listed in `.gitignore`, so her answer stays on your machine and is never committed to GitHub.
