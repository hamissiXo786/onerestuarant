# Fiamma · Cucina & Bar

A restaurant website and brand guide for **Fiamma**, a placeholder wood-fire Italian restaurant. The design is inspired by
Brickclay's ["ENZO" Dribbble shot](https://dribbble.com/shots/27587971-ENZO-Restaurant-Branding-Identity-and-Web-Design):
deep reds, serif capitals, Italian word stacks and photo collages. All content here (name, logo, copy, images) is original.
See [`docs/reference-notes.md`](docs/reference-notes.md) for the full study of the reference.

- `index.html`: one-page site (hero, story + ring collage, manifesto, chef, tabbed menu, letter grid, private events carousel, experiences, reservation form, footer)
- `style-guide.html`: brand guide (logo, colour, type, motifs, components, applications, photography)

Plain HTML, CSS and JavaScript: no build step and no dependencies.

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 (or any static server, or just double-click `index.html`).

## Make it yours
| What | Where |
|---|---|
| Name, copy, address, phone, emails | `index.html` (search for `Fiamma`, `Ember Lane`, `555-0142`, `fiamma.example`) |
| Colours, fonts, type sizes, spacing | `css/tokens.css` |
| Logo | Wordmark is live text (`.wordmark` in `css/main.css`); monogram is the `<symbol id="monogram">` near the top of each page and `assets/logo/*.svg` |
| Menu dishes and prices | The `menu-panel` lists in `index.html` |
| Events and experiences | The `event-card` / `exp-card` blocks in `index.html` |
| Opening hours | **Both** the footer in `index.html` and `CONFIG.HOURS` in `js/main.js` (drives the booking time slots) |
| Booking rules | `CONFIG` at the top of `js/main.js` (max guests, days ahead, slot length, last seating) |

### Reservations
Set `CONFIG.FORM_ENDPOINT` in `js/main.js` to a form service URL (e.g. [Formspree](https://formspree.io),
Getform, or Netlify Forms) to receive bookings by email. With no endpoint, the form opens the guest's email app with
the request filled in, addressed to `CONFIG.RESERVATION_EMAIL`. Validation covers past dates, closed days
(Mondays), dates too far ahead, opening-hour time slots and large parties.

The newsletter form only shows a confirmation for now. Connect it to Mailchimp, Buttondown or similar when ready.

### Photos
Every image in `assets/img/` is a **generated placeholder** (moody bokeh with a small "PLACEHOLDER" label). Replace each
file with real photography under the same filename:

| File | Use | Suggested size |
|---|---|---|
| `hero-interior.jpg` | Hero: dining room at night | 2000×1200 |
| `story-chef.jpg` | Chef card | 1200×1400 |
| `manifesto-guests.jpg` | Word-stack section: guests | 1200×1400 |
| `menu-bg.jpg` | Menu background: signature dish | 2000×1200 |
| `reserve-bg.jpg` | Reservation background: bar | 2000×1200 |
| `tile-01…12.jpg` | Ring collage (food, guests, wine, room) | 520×520 |
| `events-*.jpg` | Private events cards | 1000×1100 |
| `exp-*.jpg` | Experience cards | 1000×1000 |
| `gusto-dish.png` | Cut-out dish over the letter grid (**transparent PNG**) | 900×900 |

Shoot in low, warm light. Dark backgrounds suit the red palette best.

## Motion & accessibility
- Scroll reveals, line-by-line headline reveals, ring collage assembly, parallax, header hide/show: all vanilla JS.
- Fully disabled for visitors with *reduce motion* turned on; content stays visible if JavaScript fails.
- Keyboard-operable menu tabs (arrow keys), carousel and mobile menu (Esc closes); visible focus styles; skip link.
- Cream on Fiamma Red is about 8:1 contrast.

## Deploy
**GitHub Pages:** Settings → Pages → *Deploy from a branch* → pick the branch and `/ (root)`.
**Netlify:** drag the folder onto app.netlify.com/drop, or connect the repo (no build command, publish directory `.`).
