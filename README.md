# ONƎ Restaurant | Lounge website

Website and brand guide for **One Restaurant and Lounge**, 70 Alan Paton Rd, Glenwood, Durban
([@onerestaurantandlounge](https://www.instagram.com/onerestaurantandlounge/)).
The layout system is inspired by Brickclay's [ENZO Dribbble shot](https://dribbble.com/shots/27587971-ENZO-Restaurant-Branding-Identity-and-Web-Design)
([notes](docs/reference-notes.md)). Colours, type, photos and copy come from One's own Instagram ([brand notes](docs/brand-notes.md)).

- `index.html`: one-page site with hero, welcome + ring collage, Social Brunch, specials, tabbed menu, the lounge, celebrations, WhatsApp booking and footer
- `style-guide.html`: brand guide covering logo, colour, type, motifs, components and photography

Plain HTML, CSS and JavaScript: no build step and no dependencies.

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

## Before going live: things to confirm with One
1. **Opening hours** are placeholders (Tue–Thu 12–22, Fri–Sat 12–late, Sun 12–20, Mon closed). Update both:
   - the "Opening hours" list in the footer of `index.html`
   - `CONFIG.HOURS` in `js/main.js` (this drives the booking time slots)
2. **Photos** are low-resolution crops from Instagram. Replace each `assets/img/one-*.jpg` with the original
   under the same filename (portrait 4:5 works everywhere; the platter crop is landscape).
3. **Logo**: the ONƎ mark is redrawn as SVG (`<symbol id="one-mark">` at the top of each page and
   `assets/logo/one-logo.svg`). Swap in the official file if it differs.
4. **Menu**: only prices advertised on Instagram are shown; other items say "Ask us". Edit the `menu-panel`
   lists in `index.html`.

## How bookings work
One takes reservations on WhatsApp, so the form doesn't need a server. Guests choose a date, time, party size
and occasion. The form checks that the date isn't past, isn't a closed day and has open slots. It then writes the
message and shows an **Open WhatsApp** button (`https://wa.me/27650793825?text=…`) plus **Copy message**.
The number is set in `CONFIG.WHATSAPP_NUMBER`. Buttons such as "Book brunch" pre-select the occasion.

## Customise
| What | Where |
|---|---|
| Colours, fonts, sizes | `css/tokens.css` |
| Copy, specials, celebrations | `index.html` |
| Booking rules (max guests, days ahead, slot length) | `CONFIG` in `js/main.js` |
| Brand guide styles | `css/style-guide.css` |

## Motion & accessibility
Scroll reveals, ring-collage assembly, parallax and header hide/show are all vanilla JS. They switch off for
*reduce motion*, and content stays visible without JavaScript. Menu tabs, carousel and mobile menu work from the
keyboard, and focus styles are visible.

## Deploy
**GitHub Pages:** Settings → Pages → deploy from this branch, root folder.
**Netlify:** drag the folder onto app.netlify.com/drop (no build command, publish directory `.`).
