# AI Chat Assistant: Build Progress

Working doc so this task can be resumed mid-flight. Update the checklist as steps land.

## Decisions made (do not re-litigate on resume)

- **Placement**: inline section (`#ask`) on the homepage between Projects and AiStack,
  plus an "Ask" link in the site header. NOT a floating bubble widget; DESIGN.md
  explicitly rejects support-widget chrome, and the flat/tonal design language
  calls for an in-flow panel.
- **Engine**: local retrieval over a structured knowledge base (no backend exists;
  the site is a static Vite build). A `ChatProvider` interface abstracts generation
  so an Anthropic/OpenAI provider can be dropped in later without refactoring.
  The system prompt for that future API lives in `src/chat/systemPrompt.ts` now.
- **Voice**: assistant answers in first person as Tiffany (matches the suggested
  prompts, e.g. "Tell me about YOUR experience at Beacons AI"). Welcome message
  is the third-person one from the spec.
- **Copy rules honored**: no em-dashes anywhere, no years-of-experience claims,
  product-first positioning, concise chunked answers.
- **Design**: tokens from global.css only (var(--ease), three durations, tonal
  surfaces, no drop shadows, accent <= 10% of screen). Typewriter reveal for
  assistant messages; disabled under prefers-reduced-motion.
- **Knowledge source**: resume PDF (public/resume.pdf, read 2026-07-13) + src/data.ts.
  Projects with no case-study copy (Anda, Jamtown Cube, NAVA page, Aura, Axial)
  get only what data.ts says; the assistant says the case study is in progress
  rather than inventing details.

## File map

| File | Purpose |
| --- | --- |
| `src/chat/types.ts` | All chat + knowledge types |
| `src/chat/knowledge.ts` | Structured knowledge base (edit here to change answers) |
| `src/chat/systemPrompt.ts` | System prompt for future hosted-LLM providers |
| `src/chat/engine.ts` | Provider interface + local retrieval provider |
| `src/chat/useChat.ts` | Chat state machine hook (send, retry, streaming reveal) |
| `src/components/chat/ChatWindow.tsx` | Section wrapper, empty state, message list |
| `src/components/chat/MessageBubble.tsx` | One message |
| `src/components/chat/TypingIndicator.tsx` | Three-dot thinking pulse |
| `src/components/chat/PromptChips.tsx` | Suggested prompts (pre-conversation) |
| `src/components/chat/ChatInput.tsx` | Textarea + send; Enter/Shift+Enter |
| `src/components/chat/Avatar.tsx` | Small accent-dot avatar |
| `src/styles/global.css` | Chat styles appended under "Ask" comment banner |
| `src/App.tsx` | Lazy-mounts ChatWindow between Projects and AiStack |
| `src/components/SiteHeader.tsx` | "Ask" nav link |

## Checklist

- [x] Explore codebase, read DESIGN.md / PRODUCT.md / resume / data.ts
- [x] types.ts
- [x] knowledge.ts (content drafted from resume + data.ts)
- [x] systemPrompt.ts
- [x] engine.ts (retrieval, follow-ups, small talk, fallback)
- [x] useChat.ts
- [x] Components (Avatar, MessageBubble, TypingIndicator, PromptChips, ChatInput, ChatWindow)
- [x] CSS in global.css (before reduced-motion block; .chat-row added to RM list)
- [x] Wire into App.tsx (lazy) + SiteHeader "Ask" link
- [x] Typecheck + build passes (ChatWindow is its own lazy chunk, ~10 kB gzip)
- [x] Verify in preview: chips send + hide, streaming reveal, "tell me more"
      continues the Beacons topic, unknown question ("favorite ice cream
      flavor") falls back honestly, auto-scroll + input refocus, mobile 375px
      has no overflow
- [x] Final pass: no em-dashes in src (grepped), accessibility (role=log,
      aria-live, labels, focus ring), docs

## Status: COMPLETE (2026-07-13)

Two bugs found and fixed during verification:
1. Bare "favorite" keyword caught "favorite ice cream flavor"; favorite entry
   now uses phrase keywords only.
2. Engine matched entries on a lone id-token graze (score 1); minimum match
   score is now 2 (at least one real keyword hit).

## Next steps (optional, not started)

- Personalize the `// TODO(tiffany)` answers in src/chat/knowledge.ts
- Hosted LLM: implement ChatProvider with a serverless endpoint + the prompt
  from src/chat/systemPrompt.ts, pass it to useChat in ChatWindow.tsx
- Add case-study facts for Anda etc. to knowledge.ts as they're written

## Content flagged for Tiffany to personalize later

Marked with `// TODO(tiffany)` in knowledge.ts:

- "Favorite project" answer (drafted a defensible one; make it true)
- "Why product management" origin story (drafted from positioning docs)
- "What are you looking for" (kept honest and generic: internships + interesting problems)
- Fun facts (only site-derived facts used: theme slider, hidden words, dozing cursor)
