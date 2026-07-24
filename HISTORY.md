# HISTORY.md

MUSIC WEAGHK site work history and handoff notes

Last updated: 2026-07-23
Root directory used in the latest work: `D:\shunoiwa.github.io`

This file records the practical history of the site migration and the song list tool so another PC or another editor can continue the project without needing the full chat history.

## Current Site Layout

The site is now intended to run directly from the repository root for GitHub Pages.

Root files:

- `index.html`
  - Formerly `musicweaghk/home.html`.
  - Main home page.
  - Uses `site.css`.
  - Reads `songlist/songdatas.json` to choose a random YouTube video for the hero iframe.
  - Has an embedded fallback list of YouTube videos for local `file://` viewing or JSON fetch failure.
- `scores.html`
  - Score sales / difficulty explanation page.
  - Uses `site.css`.
- `information.html`
  - General information / rules / Q&A page.
  - Uses `site.css`.
- `contact.html`
  - Contact form page.
  - Uses `site.css`.
  - Posts to a Google Apps Script web app URL configured in `CONTACT_ENDPOINT`.
  - The receiver script is kept locally under `scripts/`, which is intentionally ignored by Git.
- `bgm.html`
  - Embeds a Google Apps Script app in an iframe.
  - Uses `site.css`.
- `site.css`
  - Shared CSS for root-level pages.
- `cpi.jpg`
  - Site icon / logo image.
  - Used for navbar icon and favicon / apple-touch-icon.
- `description.json`
  - Help tooltip descriptions for song detail fields.
  - Loaded by `songlist/songlist4.html` via `../description.json`.

Song list folder:

- `songlist/songlist4.html`
  - Main searchable song list page.
  - Uses its own internal CSS and JavaScript.
  - Title is `楽曲リスト | MUSIC WEAGHK`.
  - Navbar links point back to root pages with `../index.html`, `../scores.html`, etc.
- `songlist/songdatas.json`
  - Main song database.
- `songlist/hyp.json`
  - Form code display names, such as `PER`, `BRA`, `WOD`, etc.
- `songlist/inst.json`
  - Instrument classification tree used for filtering and automatic ensemble naming.
- `songlist/maps/*.svg`
  - Optional map SVGs for song details.
  - A map file is displayed when a file named `(SongID).svg` exists, for example `MIX0003-5.svg`.

## Root Migration Notes

The original project had files under `musicweaghk/`. The files were moved to repository root, and `home.html` became `index.html`.

After the move, these references were updated:

- Root nav links changed from `home.html` to `index.html`.
- `songlist/songlist4.html` nav links changed from `../home.html` to `../index.html`.
- Static link check after this update found `0` local broken links.
- Remaining old `musicweaghk` references in HTML were checked and none were found.

Important Git note:

- `git status` currently shows the old `musicweaghk/` files as deleted and the new root files as untracked.
- This is expected if the move was done manually outside Git.
- Before committing, review the status carefully and stage the new root files plus deletions only if the migration is intentional.
- Old unrelated content such as `gnu/`, `res.html`, `style.css`, and `README.md` also appears deleted in the current status. Confirm those deletions are intentional before committing.

## Shared Navigation

The root pages share a common navbar style from `site.css`.

Current main nav targets:

- `index.html` - Home
- `scores.html` - 楽譜販売
- `information.html` - 情報
- `contact.html` - お問い合わせ
- `songlist/songlist4.html` - 楽曲リスト
- `bgm.html` - BGM

`songlist/songlist4.html` uses equivalent relative paths:

- `../index.html`
- `../scores.html`
- `../information.html`
- `../contact.html`
- `songlist4.html`
- `../bgm.html`

## Home Page Details

`index.html` includes:

- Favicon and apple touch icon using `cpi.jpg`.
- Random YouTube hero video.
- Refresh button for changing the video.
- JSON loading from `songlist/songdatas.json`.
- YouTube URL parsing for regular watch URLs, short URLs, and embed URLs.
- Embedded fallback data in `youtube-fallback`.

If the hero video does not update on GitHub Pages, check:

- `songlist/songdatas.json` exists at the expected path.
- Song entries have `sells.youtube` values.
- Browser console for fetch errors.

## BGM Page Details

`bgm.html` embeds this Google Apps Script app:

`https://script.google.com/macros/s/AKfycbyTd47ADWmA7iUEk7Prc8g5b-BK8kWFf5Swd3cdVXyn7iDYuXyHa6HdnbsIa5Xy10OD-kA/exec`

Earlier in the project, a different GAS URL was discussed. The current file should be treated as the source of truth.

## Contact Form Details

`contact.html` provides a visitor-facing contact form.

The page does not expose the recipient email address. It posts JSON to the Google Apps Script web app URL stored in `CONTACT_ENDPOINT` inside `contact.html`.

The receiver script is kept locally under `scripts/`, which is intentionally ignored by Git so the script body is not published.

Song field behavior:

- The song field appears for `楽曲についての質問`, `リクエスト`, and `その他`.
- The song field is required only for `楽曲についての質問`.
- Song options are loaded from `songlist/songdatas.json`, `songlist/hyp.json`, and `songlist/inst.json`.
- The visitor can filter options by partial song ID or title.
- The selected song is posted as `songId` and `songLabel`.

Setup summary:

- Create a Google Apps Script project.
- Paste the local receiver script from `scripts/`.
- Set Script property `CONTACT_TO` to the recipient email address.
- Deploy as a web app with access set to Anyone.
- Paste the deployed web app URL into `CONTACT_ENDPOINT` in `contact.html`.

## Song Data Format

Each song in `songlist/songdatas.json` generally has this shape:

```json
{
  "id": {
    "form": "PER",
    "number": 4,
    "mov": null
  },
  "title": {
    "ja": "...",
    "en": "..."
  },
  "party": [
    "Instrument 1",
    "Instrument 2"
  ],
  "duration": 180,
  "difficulty": 4,
  "sells": {
    "youtube": null,
    "booth": null,
    "instagram": null,
    "price": null
  },
  "comment": {
    "ja": null,
    "en": null
  }
}
```

Song ID formatting:

- `form` is the 3-letter form code.
- `number` is zero-padded to 4 digits.
- `mov` is appended as `-N` only when not null.
- Example: `{ form: "PER", number: 4, mov: 1 }` becomes `PER0004-1`.
- Example: `{ form: "STR", number: 3, mov: null }` becomes `STR0003`.

Important comment migration:

- Comments were changed from a single shared string/null into language-specific objects.
- Empty comments should be written as:

```json
"comment": {
  "ja": null,
  "en": null
}
```

## Song List Page Major Features

`songlist/songlist4.html` currently supports:

- JA / EN language switch.
- SOLO & DUO and ENSEMBLE sections.
- Song detail cards.
- Song ID display.
- Duration formatting.
- Difficulty letter formatting.
- Detailed instrumentation list.
- YouTube / Instagram / Booth buttons.
- Price display.
- Optional comments.
- Optional map SVG display.
- Field help tooltips from `description.json`.
- High difficulty purchase warning on link buttons for difficulty F/G.
- Local embedded fallback JSON for offline or `file://` viewing.

The page loads:

- `songdatas.json`
- `hyp.json`
- `inst.json`
- `../description.json`

If any fetch fails locally, embedded fallback JSON blocks are used where available.

## Search And Filter Features

The song list search supports:

- Title search.
- ID search.
- Difficulty range search.
- Part count search.
- Duration category search.
- On-sale-only checkbox.
- Instrument filtering.

Difficulty range:

- There are two select boxes: min and max.
- Labels are like `A (Grade 1相当)` through `G (Grade 7相当)`.
- If min and max are reversed, the code automatically treats them as a valid range.

Duration categories:

- Short: `duration <= 180` seconds.
- Medium: `180 < duration < 360` seconds.
- Long: `duration >= 360` seconds.

On-sale filter:

- A song is considered on sale when `sells.price` is not null, undefined, or empty string.

Instrument filter modes:

- OR: show songs containing at least one selected instrument.
- AND: show songs containing every selected instrument.
- Exclude: hide songs containing any selected instrument.

Instrument filter UI:

- The whole instrument filter panel is closed by default.
- Each category is also closed by default.
- Closing a panel does not clear checked instruments.
- Selected instruments are shown as text in the collapsed instrument panel header.
- The instrument panel expands vertically and no longer uses an internal scroll area.

## Instrument Classification And Naming

`inst.json` is now a tree, not just a flat category list.

Supported shape:

```json
[
  {
    "CategoryKey": {
      "name": "日本語表示名",
      "canname": true,
      "insts": {
        "English Instrument Name": "日本語楽器名"
      },
      "groups": {
        "SubGroupKey": {
          "name": "日本語派生元名",
          "canname": true,
          "insts": {
            "Derived Instrument": "日本語楽器名"
          }
        }
      }
    }
  }
]
```

`groups` is optional.

Current examples:

- `Double-Reed`
  - `Oboe`
    - `Oboe Musette`
    - `Oboe`
    - `Oboe d'amore`
    - `English Horn`
  - `Bassoon`
    - `Tenor Bassoon`
    - `Bassoon`
    - `Contrabassoon`
- `Tromba`
  - `Trumpet`
    - `Piccolo Trumpet`
    - `B♭ Trumpet`
  - `Trombone`
    - `Trombone`
    - `Bass Trombone`
    - `Contrabass Trombone`
    - `Cimbasso`

Naming priority in `songlist4.html`:

1. If all counted parts are the exact same instrument, use the instrument name.
   - Example: `Bassoon 1`, `Bassoon 2`, `Bassoon 3` -> `バスーン3重奏` / `Bassoon Trio`.
2. If they are not the exact same instrument but share the deepest common nameable group, use that group.
   - Example: `Tenor Bassoon`, `Bassoon`, `Contrabassoon` -> `バスーンN重奏` / `Bassoon ...`.
   - Example: `Piccolo Trumpet`, `B♭ Trumpet` -> `トランペットN重奏` / `Trumpet ...`.
3. If only the top category matches and `canname` is not false, use the category name.
4. Otherwise, fall back to `hyp.json` form code naming.

Accompaniment handling:

- Parts containing `(accomp.)` are not counted for the ensemble size.
- If counted parts become empty, the code falls back to raw party length.

Normalization for matching instruments:

- Removes parenthesized notes.
- Removes trailing space plus number, such as `Oboe 1` -> `Oboe`.
- Splits multi-instrument part strings on comma and slash.

Important instrument rename:

- `Tenoroon` was replaced by `Tenor Bassoon`.
- Japanese display name is `テナーバスーン`.

## Map SVG Feature

Maps are loaded from `songlist/maps`.

Rule:

- If the current song ID is `MIX0003-5`, the page tries to display `songlist/maps/MIX0003-5.svg`.
- If the SVG loads successfully, it appears above the comment field.
- If it fails or does not exist, the map block is removed.
- The map area supports horizontal scrolling for wide SVGs.

## Field Help Tooltips

`description.json` maps detail labels to help text.

Current keys:

- `musicid`
- `duration`
- `difficulty`
- `price`
- `partytitle`
- `links`
- `parts`
- `map`
- `comment`

Difficulty descriptions are special:

```json
"difficulty": {
  "ja": {
    "common": "...",
    "A": "...",
    "B": "..."
  },
  "en": {
    "common": "...",
    "A": "...",
    "B": "..."
  }
}
```

The page displays `common`, then the current difficulty letter's description on the next line.

## High Difficulty Warning

For songs with difficulty F or G (`difficulty` 6 or 7):

- Link buttons show a warning tooltip on hover/focus.
- Japanese warning:
  - `この曲は難易度が高めです。ご購入の際はご注意ください。`
- English warning:
  - `This piece has a high difficulty level. Please keep this in mind before purchasing.`

The tooltip background uses rgba with opacity 0.5.

## Sorting

The song list display is sorted by song ID inside each section:

- SOLO & DUO is sorted by formatted song ID.
- ENSEMBLE is sorted by formatted song ID.
- JSON order is not changed.

## Favicon / Icon

All main pages use `cpi.jpg` as favicon and apple touch icon.

Root pages:

```html
<link rel="icon" type="image/jpeg" href="cpi.jpg">
<link rel="apple-touch-icon" href="cpi.jpg">
```

Song list page:

```html
<link rel="icon" type="image/jpeg" href="../cpi.jpg">
<link rel="apple-touch-icon" href="../cpi.jpg">
```

Browsers cache favicons heavily. If it does not update, force refresh or clear site data.

## Design Notes

Root pages use `site.css`.

`songlist/songlist4.html` still has internal CSS because it has a larger interactive UI. It has been visually aligned with the shared site style in these areas:

- Tab title format.
- Main heading size.
- Page top spacing.
- Background gradient.
- Header colors.
- Page width.

Do not blindly replace its CSS with `site.css`; the song list has many custom controls and detail-card states.

## Encoding Notes

All files should be UTF-8.

A previous edit accidentally turned Japanese text in `inst.json` into `????` because of shell encoding. This was repaired.

To avoid the same issue:

- Use an editor that writes UTF-8.
- If scripting with PowerShell, explicitly use UTF-8.
- For Python scripts, read/write with `encoding='utf-8'`.
- Be careful when putting Japanese directly inside PowerShell here-strings; verify after editing.

Recommended quick check for `inst.json`:

```powershell
Select-String -Path .\songlist\inst.json -Pattern '\?'
```

This should return no suspicious replacement characters for Japanese text.

## Verification Summary

Last known verification:

- Static local link check returned no broken local links.
- `index.html` script blocks were OK.
- `songlist/songlist4.html` script blocks were OK.

Useful verification ideas:

- Run a local static link checker after moving files.
- Parse embedded JSON script blocks with Node before committing.
- Open `index.html` and `songlist/songlist4.html` in a browser and check the console.
- On GitHub Pages, check that JSON fetches work under the deployed path.

## Suggested Next Tasks

- Decide whether old deleted directories such as `gnu/` and old `musicweaghk/` should really be removed in Git.
- Stage moved files carefully.
- Test GitHub Pages after push, especially JSON fetches under `songlist/`.
- Consider extracting shared nav/footer into a small generation workflow later, because all pages currently duplicate that HTML manually.


