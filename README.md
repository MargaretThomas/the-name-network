# 🕸️ The Name Network

> *Discover the people, places, and things that share your name — and feel the thread that connects you to the world.*

## What is this?

The Name Network is an AI-powered interactive experience that helps you feel connected to the wider world through the names you carry. Enter your first name, your city, and any other name meaningful to you — and the app surfaces real people, places, and things that share those names, each told as a small, human story.

The idea is simple: your name is not just yours. It belongs to rivers, saints, storms, scientists, streets, and strangers. This tool finds them for you.

---

## Features

- **Multi-name search** — search by first name, city, and an additional name (surname, nickname, middle name) all at once
- **Three connection categories** — People, Places, and Things
- **AI-generated stories** — each result includes a warm 2–3 sentence narrative and a short poetic connection line
- **Clean, shareable UI** — colour-coded cards designed to be read, shared, and felt

---

## How it works

1. The user enters up to three names
2. A prompt is sent to the Claude API (`claude-sonnet-4-20250514`) asking it to find real namesake connections across categories
3. The model returns structured JSON — each entry includes a name, category, era, story, and connection line
4. Results are rendered as a card feed, one connection per card

---

## Tech stack

- **React** (via Claude Artifacts)
- **Anthropic Claude API** — `POST /v1/messages`
- No external dependencies or build tools required

---

## Getting started

This project runs inside [Claude Artifacts](https://claude.ai). To run it locally or embed it elsewhere:

1. Copy the component code into a React project
2. Add your Anthropic API key to the fetch headers:
   ```js
   headers: {
     "Content-Type": "application/json",
     "x-api-key": "YOUR_API_KEY",
     "anthropic-version": "2023-06-01"
   }
   ```
3. Run your React app as normal

> **Note:** Never expose your API key in a public-facing client app. Use a backend proxy in production.

---

## Prompt design

The core prompt instructs Claude to act as a warm, humanistic guide — not a search engine. It's asked to:

- Find real entities (not fictional)
- Favour lesser-known gems alongside famous ones
- Write stories that create a sense of kinship and wonder
- Return clean JSON only, with no preamble

Tweaking the prompt is the easiest way to change the tone, depth, or focus of results.

---

## Project origin

The Name Network was conceived as a creative tool to help people feel less alone — to look up from their own lives and find unexpected kinship in shared names across time and geography. Built with [Claude](https://claude.ai).

---

## License

MIT — free to use, adapt, and share.
