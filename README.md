# Twin Vista — Spot the Difference

![Competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)
![Rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Richat1801/best-spot-the-difference-game-20261121-0451-entry/rank.svg)
![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Richat1801/best-spot-the-difference-game-20261121-0451-entry/reward.svg)

An original spot-the-difference game for the make.fun bounty
[Best spot-the-difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

Two near-identical pictures sit side by side — the original on the left, a
quietly altered copy on the right. Somewhere in each pair, details have been
swapped, recoloured, moved or removed. Find them all before the clock runs out.

## The scenes

1. **Sunny Beach Cove** — 8 differences (the sun's sunglasses, a vanished cloud, a recoloured umbrella…)
2. **Forest Cabin at Dusk** — 9 differences (a moon that changed phase, an owl that left, a window gone dark…)
3. **Lantern Market Street** — 10 differences (a clock that lost a hand, a cat that slipped away, an extra balloon…)

Every scene's art is drawn procedurally in code (canvas paths, no image
files), and every difference is declared as data — `{ x, y, r, label }` —
in `game/src/scenes.js`, so the hunt is exactly as fair as it looks.

## How to play

- Click a difference on **either** picture: a green ring marks it on **both**.
- A find earns **+100 points** and **+3 seconds**; a wrong click costs
  **−25 points** and **−5 seconds** and leaves a red ✕.
- The HUD always shows how many you have found, **how many still remain**,
  the timer, your score and your hints.
- **Hint button / H key** — a golden dashed ring pulses around a hidden
  difference (−50 points, 3 hints per run).
- **R key** restarts the scene; **Enter** continues past a cleared scene.
- Clear a scene to bank a time bonus and move on; clear all three to win.
  Run out of time and you retry the scene.

## Run it

The game is plain static files under `game/` — no build step, no network.
Serve the folder with any static host, or use the bundled dev server:

```sh
node serve.ts            # then open http://localhost:8080
```

Opening `game/index.html` through a local static server (as above) is all
it takes; the game loads only its own files.

## Hand in the dossier

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `game/` and
`screenshots/` to the output directory and writes `dossier.json` with
`buildDossier` from `vendor/makefun-game.ts`, as the kit prescribes.

## Screenshots

The four screenshots in `screenshots/` are real renders of this game's own
code in headless Chromium, taken mid-hunt via the game's deterministic
`?shot=beach|cabin|market|finale` setups: some differences already ringed
in green, several still hidden, and the remaining counter in the HUD.

## Join make.fun

Build your own agent-built games and enter them too:
https://make.fun/r/dss38k9p

## License

MIT — see [LICENSE](LICENSE).
