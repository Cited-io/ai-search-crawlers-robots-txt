# Cloudflare and Vercel settings that silently block AI crawlers

**Short answer:** a correct robots.txt is not enough. Cloudflare and Vercel can block AI crawlers at the edge, before they ever read your robots.txt. Cloudflare can also rewrite your robots.txt by putting its own rules on top of yours. If ChatGPT, Claude or Perplexity never cite you, check these settings first, then confirm with the tests in [check.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/check.md).

Checked against Cloudflare's and Vercel's own docs on 2026-10-15. Dashboard labels change often, so follow the doc links if a menu name differs.

## Cloudflare

### 1. AI bot policies (Search, Agent, Training)

Cloudflare sorts AI bots into three presets, and you can block each one separately:

| Preset | What Cloudflare puts in it | Crawlers whose vendor describes that purpose ([crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md)). Cloudflare's own category may differ |
|---|---|---|
| **Search** | Crawlers that index your content to answer questions about it later | OAI-SearchBot, Claude-SearchBot, PerplexityBot |
| **Agent** | Activity acting in real time for a person, "such as chat fetch bots and browser-use agents" | ChatGPT-User, Claude-User, Perplexity-User |
| **Training** | Crawlers that train or fine-tune models, **including mixed-purpose crawlers used for both training and search** | GPTBot, ClaudeBot |

Each preset can be set to **Block (on all pages)**, **Block on pages with ads** or **Allow (do not block)**. The setting lives at **Security Settings > Configure AI bot policies**.

**The new default.** Cloudflare's docs (updated 1 July 2026) say that from 15 September 2026, new domains block **Training and Agent** bots on pages that display ads, while Search stays allowed. The Agent part matters: on those pages, a person asking ChatGPT or Claude about your page can be refused. The legacy "Block AI bots" toggle is deprecated on the same date.

**What to set if you want AI search:** Search to **Allow**, and Agent to **Allow**. For Training, choose for yourself. Remember that Training also catches mixed-purpose crawlers. The doc doesn't name which crawlers count as mixed-purpose, so check each crawler's category in AI Crawl Control (section 3).

Source: [Block AI Bots](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/), [Verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/).

### 2. Managed robots.txt (Bot Preference Sync)

When a policy is set to block, and **Enable Bot Preference Sync** is on, Cloudflare writes robots.txt rules for you:

- If your site already serves a robots.txt, Cloudflare **puts its managed rules before yours** and serves both as one file.
- If you have none, Cloudflare creates one.
- With Training set to Disallow, the managed block disallows `Amazonbot`, `Applebot-Extended`, `Bytespider`, `CCBot`, `ClaudeBot`, `Google-Extended`, `GPTBot` and `meta-externalagent`.
- It also adds a `Content-signal: search=yes, ai-train=no` line under `User-Agent: *`.

So the file crawlers read is not the file in your repository. If your own file also names GPTBot, the crawler now sees two sets of rules for it. Always test the live URL, as shown in [check.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/check.md).

Two more details:

- Blocking `Google-Extended` this way also removes you from grounding in the Gemini app, per Google's own docs ([crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md#google) explains why).
- Free-plan domains that have no robots.txt of their own are served Cloudflare's Content Signals Policy text when a crawler asks for robots.txt.

Source: [robots.txt setting](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/).

### 3. AI Crawl Control

**AI Crawl Control** lists each AI crawler that requests your pages, with its category, request count and **robots.txt violations**. You can set **Allow** or **Block** for each crawler. This is the place to:

- see whether OAI-SearchBot, Claude-SearchBot or PerplexityBot are reaching you at all;
- unblock one crawler without changing a whole preset.

On the free plan it identifies crawlers by user agent only.

Source: [Manage AI crawlers](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/).

### 4. Bot Fight Mode

**Bot Fight Mode** challenges traffic that matches known bot patterns. Cloudflare says it can't be skipped with WAF custom rules or Page Rules, because it doesn't run on the Ruleset Engine. If you need an exception, Cloudflare points you to **Super Bot Fight Mode**, which supports Skip rules. If AI crawlers show up as challenged in **Security > Analytics**, on the **Events** tab, under "Bot Fight Mode", that is the cause.

Source: [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/).

### 5. Sign-up question (since July 2025)

Since 1 July 2025, Cloudflare asks every new domain at sign-up whether it wants to allow AI crawlers. If someone on your team answered "no" during setup, that choice may still be active.

Source: [Cloudflare press release, 1 July 2025](https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/).

### Cloudflare checklist

1. **Security Settings > Configure AI bot policies:** Search and Agent on Allow.
2. **Bot Preference Sync:** off, or on with only the Training preset blocking.
3. **AI Crawl Control:** each search crawler you want shows Allow, with requests getting through.
4. **Bot Fight Mode:** off, or move to Super Bot Fight Mode with skip rules.
5. Fetch `https://yourdomain/robots.txt` and read what is really served.

## Vercel

### 1. AI Bots Managed Ruleset

Vercel's **AI Bots Ruleset** covers bots that crawl "for training data, search purposes, or user-generated fetches". It is **off by default** (labelled **Allow**). If someone sets it to **Deny**, it "blocks all traffic identified as coming from AI bots". That includes the search crawlers and user fetchers you want. Vercel maintains the list and adds new bots to it automatically.

You'll find it under **Firewall > Rules > Bot Management**.

**To block training but keep AI search:**

1. Leave the ruleset on **Allow** or **Log**.
2. Write WAF custom rules that deny only the training user agents (GPTBot, ClaudeBot and the others in [allow-search-block-training.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/allow-search-block-training.txt)).

Alternatively, keep **Deny** and add a custom rule with a **Bypass** action for the search crawlers. Vercel runs custom rules before managed rulesets, so the bypass wins. A bypass that matches on user agent alone also lets through anyone who fakes that user agent, so keep the list short.

Source: [Bot Management](https://vercel.com/docs/bot-management), [Managed rulesets](https://vercel.com/docs/vercel-firewall/vercel-waf/managed-rulesets).

### 2. Bot Protection Managed Ruleset and Attack Mode

Vercel's **Bot Protection** ruleset challenges non-browser traffic. Vercel says it automatically excludes **verified bots**. Its verified-bots directory lists, among others:

- `googlebot`, `bingbot`, `applebot`;
- `oai-searchbot`, `chatgpt-user`, `gptbot`;
- `claude-searchbot`, `claude-user`, `claudebot`;
- `perplexitybot`, `perplexity-user`, `duckassistbot`.

**Attack Mode** also lets known bots through. Vercel notes that Bot Protection doesn't work well behind another reverse proxy such as Cloudflare.

Source: [Bot Management: verified bots](https://vercel.com/docs/bot-management#verified-bots).

### 3. Your own custom rules

The most common self-inflicted block is a custom rule written to stop scrapers, such as "user agent contains `bot`". That rule also matches OAI-SearchBot, PerplexityBot and Googlebot. Review every custom rule with **Deny** or **Challenge** that matches on user agent.

### 4. Preview deployments

Vercel automatically adds `X-Robots-Tag: noindex` to preview deployments and to outdated production deployments. That is correct behavior, but it means crawlers should only ever be pointed at your production domain. Check that your sitemap, canonical tags and internal links use it.

Source: [Are Vercel preview deployments indexed by search engines?](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines)

### Vercel checklist

1. **Firewall > Rules > Bot Management > AI Bots Ruleset:** Allow or Log, not Deny (or Deny with bypass rules for search crawlers).
2. **Custom rules:** no broad user-agent rule that catches search crawlers.
3. Sitemap and canonical URLs point at the production domain.
4. Test with [check.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/check.md).

## Sources

All checked 2026-10-15.

- Cloudflare: [Block AI Bots](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/), [robots.txt setting](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/), [Manage AI crawlers](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/), [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/), [Verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/), [Press release, 1 July 2025](https://www.cloudflare.com/press/press-releases/2025/cloudflare-just-changed-how-ai-crawlers-scrape-the-internet-at-large/)
- Vercel: [Bot Management](https://vercel.com/docs/bot-management), [Managed rulesets](https://vercel.com/docs/vercel-firewall/vercel-waf/managed-rulesets), [Preview deployments and indexing](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines)

---

Maintained by [Cited](https://cited.io): AI SEO and GEO agency with its own AI visibility platform. Once crawlers can reach you, the next step is content they want to cite: see [how to get cited by ChatGPT](https://cited.io/guides/how-to-get-cited-by-chatgpt).
