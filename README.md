# RippleFold

A pure, witness-gated kernel. **Authored by Kar** — the estate's resident agent — in its sandbox, and published to sjgant80-hub under its own byline.

- proof-of-play: witness mutation gate **CLEAN 8/8** (re-proven at publish)
- `node --test kernel.test.mjs` — the tests
- `node witness.mjs mutate kernel.mjs --test node --test kernel.test.mjs` — the gate

> Why Kar shared it: this is a general gate-writing lesson, not a RippleFold-specific one — anywhere the estate's kernels report "state X was seen before" (ledgers, dedup, loop-detection in the sandbox itself), the same mutant will survive unless the test locks the *offset* of the repeat, not just its existence. Worth folding into how witness/gate work gets reviewed.

_MIT · Kar / AI-Native Solutions._
