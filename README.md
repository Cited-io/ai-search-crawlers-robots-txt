# robots.txt for AI crawlers: allow AI search, decide on training

**To appear in ChatGPT search, Claude, Perplexity and Google's AI answers, your robots.txt and firewall must let each engine's search crawler in.** Those crawlers are OAI-SearchBot, Claude-SearchBot, PerplexityBot and Googlebot. Most AI companies run their training crawlers (GPTBot, ClaudeBot) and training tokens (Google-Extended, Applebot-Extended) separately, so you can allow AI search and still opt out of training. This repo gives you copy-paste robots.txt templates for both choices, a verified AI crawler list, and an llms.txt template.

Block lists such as [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) help sites that want AI out. This kit is for sites that want to be found and cited in AI answers. Every user-agent token here was checked against the vendor's own documentation on **2026-10-15**, with a link.

## Pick a template

| You want | Use | What it does |
|---|---|---|
| The widest reach in AI answers, training included | [allow-all-ai-search.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/allow-all-ai-search.txt) | Allows every documented AI search, user-fetch and training crawler |
| AI search, but not model training | [allow-search-block-training.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/allow-search-block-training.txt) | Allows OAI-SearchBot, Claude-SearchBot, PerplexityBot and the rest. Blocks GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, meta-externalagent, Amazonbot, MistralAI-Training and CCBot |
| The same, but also appear in Gemini app answers | allow-search-block-training.txt, with `Google-Extended` moved to the allow group | Google-Extended also controls grounding in the Gemini app, not only training |
| Google AI Overviews and AI Mode | Allow `Googlebot` (both templates do) | Google says these follow Googlebot. Google-Extended has no effect on them |
| Microsoft Copilot | Allow `bingbot` (both templates do) | Microsoft has no separate Copilot crawler and no robots.txt training token |
| A Next.js site | [nextjs-robots.ts](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/nextjs-robots.ts) | Generates the "block training" policy from `app/robots.ts`, with a switch to allow training |
| Your site is on Cloudflare or Vercel | [cloudflare-vercel.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/cloudflare-vercel.md) | The edge settings that block AI crawlers before they read robots.txt |

## Three things people get wrong

1. **Named groups don't inherit `User-agent: *`.** A crawler follows only the most specific group that names it ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)). If you name GPTBot in its own group, repeat your private-path `Disallow` lines there too.
2. **The firewall wins.** Cloudflare's AI bot policies, Bot Fight Mode and Vercel's AI Bots ruleset can refuse a crawler before it reads robots.txt. Cloudflare's docs say that from 15 September 2026, new domains block "Agent" bots on pages with ads ([Cloudflare](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)). Cloudflare defines Agent as bots acting for a person in real time, which would include fetchers such as ChatGPT-User and Claude-User.
3. **User fetchers may ignore robots.txt.** OpenAI says robots.txt "may not apply" to ChatGPT-User. Perplexity says Perplexity-User "generally ignores" it. Meta says meta-externalfetcher may bypass it. A robots.txt block on these is a request, not a lock.

## Contents

- [crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md): the AI crawler list. For each crawler: token, company, purpose (search, training or user fetch), robots.txt behavior, IP list and doc link. Covers OpenAI, Anthropic, Perplexity, Google, Apple, Microsoft, Meta, Amazon, Common Crawl, DuckDuckGo and Mistral. Cohere and ByteDance are marked unverified.
- **Templates**
  - [allow-all-ai-search.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/allow-all-ai-search.txt): allow every AI crawler.
  - [allow-search-block-training.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/allow-search-block-training.txt): allow AI search, block training.
  - [nextjs-robots.ts](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/nextjs-robots.ts): the same policy for the Next.js App Router.
  - [cloudflare-vercel.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/cloudflare-vercel.md): firewall and bot settings that silently block AI crawlers.
- [check.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/check.md): test whether crawlers can reach you. Read the live robots.txt, use curl with each user agent, read your logs and verify IPs, and use the Bing Webmaster Tools AI Performance report.
- **llms.txt**
  - [what-is-llms-txt.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/llms-txt/what-is-llms-txt.md): what llms.txt is, the format, and an honest answer on whether it helps.
  - [llms-template.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/llms-txt/llms-template.txt): a blank template.
  - [llms-example.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/llms-txt/llms-example.txt): a filled-in example for a fictional company. For a live one, see [cited.io/llms.txt](https://cited.io/llms.txt).
- [CONTRIBUTING.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/CONTRIBUTING.md): how to add or correct a crawler.
- [LICENSE](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/LICENSE): MIT.

## Quick start

1. Pick a template from the table above.
2. Replace `https://www.example.com` with your domain, and copy your private paths into every group.
3. Publish it at `https://yourdomain/robots.txt`.
4. Check your CDN settings with [cloudflare-vercel.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/cloudflare-vercel.md).
5. Confirm with `curl -s https://yourdomain/robots.txt` and the log checks in [check.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/check.md).

## Access is step one

Letting crawlers in makes you eligible to be cited. It doesn't make you cited. What engines list as sources varies a lot by engine. In our public [AI search citations dataset](https://github.com/Cited-io/ai-search-citations-dataset) (2026-10 release, 138 AI answers across 6 engines):

- the engines listed 566 distinct domains as sources;
- ChatGPT listed 17.2 domains per answer, against 2.6 for Google AI Mode;
- reddit.com was listed as a source in 21 of the 138 answers, and youtube.com in 13.

So the sites you need to be on, and the pages you need to write, depend on the engine. The next step is in [how to get cited by ChatGPT](https://cited.io/guides/how-to-get-cited-by-chatgpt) and [how to rank in Google AI Overviews](https://cited.io/guides/how-to-rank-in-google-ai-overviews).

## Keeping it current

Vendors add and rename crawlers often. Each file carries the date it was checked. If a vendor changes its docs, please open an issue or a pull request with the link ([CONTRIBUTING.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/CONTRIBUTING.md)).

## License

[MIT](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/LICENSE). Copy the templates into any project, commercial or not.

---

Maintained by [Cited](https://cited.io): AI SEO and GEO agency with its own AI visibility platform. Read [how to get cited by ChatGPT](https://cited.io/guides/how-to-get-cited-by-chatgpt) for what to do once the crawlers are in.
