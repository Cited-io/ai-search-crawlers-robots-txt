# AI crawler list: every major AI user agent, its purpose and its robots.txt token

**Short answer:** most AI companies now run separate crawlers for separate jobs. A **search** crawler (OAI-SearchBot, Claude-SearchBot, PerplexityBot) decides whether you can appear and be linked in AI answers. A **training** crawler or token (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended) decides whether your pages may train future models. A **user-initiated fetcher** (ChatGPT-User, Claude-User, Perplexity-User) visits a page because a person asked about it, and several of them say robots.txt may not apply. You can allow one group and block another.

Every row below was checked against the vendor's own documentation on **2026-10-15**. Rows we could not verify from a vendor page are marked **Unverified**. Vendors rename and add crawlers often, so re-check the doc link before you rely on a row.

## How to read the table

- **Token** is what you write after `User-agent:` in robots.txt. Matching is case-insensitive under [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html).
- **Purpose:**
  - **Search**: builds an index used to show and link your pages in AI answers or search results.
  - **Training**: collects content, or controls whether content may be used, to train AI models.
  - **User fetch**: fetches one page in real time because a user asked.
- **Respects robots.txt** quotes or paraphrases the vendor. "Implied" means the vendor tells you to manage the bot in robots.txt but doesn't state compliance in so many words.
- **IP list** is the vendor's published list of addresses, which you need to tell the real crawler from a fake one (see [check.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/check.md)).

## OpenAI

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `OAI-SearchBot` | OpenAI | Search: shows and links sites in ChatGPT search. Not used for training | Yes | [searchbot.json](https://openai.com/searchbot.json) | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| `GPTBot` | OpenAI | Training: content that may be used to train OpenAI's foundation models | Yes. Disallowing it signals your content should not be used for training | [gptbot.json](https://openai.com/gptbot.json) | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| `ChatGPT-User` | OpenAI | User fetch: visits pages for user actions in ChatGPT and Custom GPTs. OpenAI says it is not used for automatic crawling or for search eligibility | No: OpenAI says "robots.txt rules may not apply" | [chatgpt-user.json](https://openai.com/chatgpt-user.json) | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |
| `OAI-AdsBot` | OpenAI | Ads: checks landing pages submitted as ads on ChatGPT. Not used for training | Not stated | [adsbot.json](https://openai.com/adsbot.json) | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) |

OpenAI says the GPTBot and OAI-SearchBot settings are independent, and that its search systems can take about 24 hours to reflect a robots.txt change.

## Anthropic

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `Claude-SearchBot` | Anthropic | Search: indexes content to improve the relevance of Claude's search answers | Yes | [bots.json](https://claude.com/crawling/bots.json) | [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `ClaudeBot` | Anthropic | Training: collects content that could contribute to model training | Yes. Also supports `Crawl-delay` | [bots.json](https://claude.com/crawling/bots.json) | [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| `Claude-User` | Anthropic | User fetch: retrieves pages when a person asks Claude a question | Yes: Anthropic says all its bots honor robots.txt, and disallowing Claude-User stops these fetches | [bots.json](https://claude.com/crawling/bots.json) | [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |

Anthropic warns that blocking its IP addresses instead of using robots.txt may not work reliably, because the bot can no longer read your robots.txt.

## Perplexity

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `PerplexityBot` | Perplexity | Search: surfaces and links sites in Perplexity results. Perplexity says it is not used to crawl content for foundation models | Implied: Perplexity says to manage it in robots.txt and recommends allowing it | [perplexitybot.json](https://www.perplexity.com/perplexitybot.json) | [Perplexity crawlers](https://docs.perplexity.ai/guides/bots) |
| `Perplexity-User` | Perplexity | User fetch: supports user actions in Perplexity. Not used for crawling or training | No: Perplexity says it "generally ignores robots.txt rules" | [perplexity-user.json](https://www.perplexity.com/perplexity-user.json) | [Perplexity crawlers](https://docs.perplexity.ai/guides/bots) |

## Google

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `Googlebot` | Google | Search: Google Search, **including AI Overviews and AI Mode** | Yes | [common-crawlers.json](https://developers.google.com/static/crawling/ipranges/common-crawlers.json) | [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot), [AI features](https://developers.google.com/search/docs/appearance/ai-features) |
| `Google-Extended` | Google | Training **and grounding** control: whether content may train future Gemini models and be used for grounding in Gemini Apps and Grounding with Google Search on Vertex AI. Not a crawler: it has no user agent of its own | Yes (it exists only as a robots.txt token) | None: crawling uses existing Google user agents | [Google common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) |
| `Google-CloudVertexBot` | Google | Crawls that site owners request to build Vertex AI Agents. No effect on Google Search | Yes | [common-crawlers.json](https://developers.google.com/static/crawling/ipranges/common-crawlers.json) | [Google common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) |
| `GoogleOther` | Google | Generic crawler for Google product teams, such as one-off research crawls. No effect on Google Search | Yes | [common-crawlers.json](https://developers.google.com/static/crawling/ipranges/common-crawlers.json) | [Google common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) |

Two facts matter most here:

1. **AI Overviews and AI Mode are controlled by Googlebot, not Google-Extended.** Google says Googlebot rules in robots.txt are how you manage access, and that a page only needs to be indexed and eligible for a snippet. Google-Extended "does not impact a site's inclusion in Google Search".
2. **Blocking Google-Extended is not training-only.** It also removes your content from grounding in the Gemini app. If you want to appear in Gemini app answers, keep Google-Extended allowed.

## Apple

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `Applebot` | Apple | Search: powers Spotlight, Siri, Safari and other Apple features | Yes. Does not follow `Crawl-delay`. **If you have no Applebot group but do have a Googlebot group, Applebot follows the Googlebot rules** | [applebot.json](https://search.developer.apple.com/applebot.json) | [About Applebot](https://support.apple.com/en-us/119829) |
| `Applebot-Extended` | Apple | Training control: opts your content out of training Apple's foundation models. Does not crawl. Not used for search ranking | Yes (robots.txt token only) | None: it does not crawl | [About Applebot](https://support.apple.com/en-us/119829) |

## Microsoft (Bing and Copilot)

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `bingbot` | Microsoft | Search: Bing's index, which also feeds citations in Microsoft Copilot and AI summaries in Bing | Yes: "Bing respects all content owner preferences expressed through robots.txt" | No list linked from the docs we could read. Use the [Verify Bingbot tool](https://www.bing.com/toolbox/verify-bingbot). (A file at [bingbot.json](https://www.bing.com/toolbox/bingbot.json) also loads) | [Which crawlers Bing uses](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0), [bingbot user agents](https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/) |

Microsoft documents **no separate Copilot crawler and no robots.txt training token**. The training controls are page-level meta tags:

- `NOCACHE`: the page may appear in Bing's AI answers as a URL, title and snippet only. Only those parts may be used for training.
- `NOARCHIVE`: the page is left out of the AI answers and not used for training.

Source: [Bing's 2023 announcement](https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat), which covered Bing Chat, now Copilot. If you want Copilot citations, don't block bingbot and don't use NOARCHIVE.

## Meta

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `meta-webindexer` | Meta | Search: improves Meta AI search. Meta says allowing it "helps us cite and link to your content in Meta AI's responses" | Implied: Meta tells you to manage it in robots.txt | Not published on the crawler page | [Meta web crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) |
| `meta-externalagent` | Meta | Training: crawls for uses such as training AI models or indexing content directly | Yes: block it with a Disallow rule | Not published on the crawler page | [Meta web crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) |
| `meta-externalfetcher` | Meta | User fetch: fetches links at a user's request, including for AI agents | No: Meta says it "may bypass robots.txt rules" | Not published on the crawler page | [Meta web crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) |
| `facebookexternalhit` | Meta | Link previews when a page is shared on Meta apps | Partly: Meta says it might bypass robots.txt for security or integrity checks | Not published on the crawler page | [Meta web crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) |

Meta says robots.txt changes can take up to 24 hours to apply. `FacebookBot` appears in many older block lists, but it is **not on Meta's current crawler page**, so we don't list it.

## Amazon

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `Amzn-SearchBot` | Amazon | Search: search experiences in Amazon products such as Alexa. Not used for training | Yes. If not named, it follows the rules you give other search bots | [searchbot IPs](https://developer.amazon.com/amazonbot/searchbot-ip-addresses/) | [Amazonbot](https://developer.amazon.com/amazonbot) |
| `Amazonbot` | Amazon | Training and products: improves Amazon services and "may be used to train Amazon AI models" | Yes. Ignores `Crawl-delay`. Caches robots.txt for up to 30 days | [Amazonbot IPs](https://developer.amazon.com/amazonbot/ip-addresses/) | [Amazonbot](https://developer.amazon.com/amazonbot) |
| `Amzn-User` | Amazon | User fetch: live information for Alexa questions. Not used for training | Partly: Amazon says it "may not follow all robots.txt directives" | [live IPs](https://developer.amazon.com/amazonbot/live-ip-addresses/) | [Amazonbot](https://developer.amazon.com/amazonbot) |

## Common Crawl

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `CCBot` | Common Crawl Foundation | Training (in practice): Common Crawl is a nonprofit open archive of the web. Its data is widely used to train AI models | Yes: block it with `User-agent: CCBot` and `Disallow: /` | [ccbot.json](https://index.commoncrawl.org/ccbot.json) | [CCBot](https://commoncrawl.org/ccbot) |

Common Crawl's own page describes an open repository, not training. We list it under training because the AI-training use is why most sites decide about it. Cloudflare's managed robots.txt also places it in its training block list ([source](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)).

## DuckDuckGo

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `DuckAssistBot` | DuckDuckGo | Search: crawls pages in real time for DuckDuckGo's AI-assisted answers, which cite sources. "Not used in any way to train AI models" | Yes. Changes take effect after 72 hours | [duckassistbot.json](https://duckduckgo.com/duckassistbot.json) | [DuckAssistBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot) |
| `DuckDuckBot` | DuckDuckGo | Search: DuckDuckGo's search crawler | Yes | [duckduckbot.json](https://duckduckgo.com/duckduckbot.json) | [DuckDuckBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot) |

## Mistral

| Token | Company | Purpose | Respects robots.txt | IP list | Doc |
|---|---|---|---|---|---|
| `MistralAI-Index` | Mistral AI | Search: indexes content for Mistral search, used for answers in Vibe. Not used for training | Not stated | [index IPs](https://mistral.ai/mistralai-index-ips.json) | [Mistral robots](https://docs.mistral.ai/robots) |
| `MistralAI-User` | Mistral AI | User fetch: visits a page to answer a user's question and links the source. Not an automatic crawler | Yes: Mistral says robots.txt "governs which sites these user requests can be made to" | [user IPs](https://mistral.ai/mistralai-user-ips.json) | [Mistral robots](https://docs.mistral.ai/robots) |
| `MistralAI-Training` | Mistral AI | Training: builds datasets for training Mistral models | Yes: you can block it in robots.txt | None published | [Mistral robots](https://docs.mistral.ai/robots) |

## Unverified: Cohere and ByteDance

| Token | Company | What third parties say | Status |
|---|---|---|---|
| `cohere-ai` | Cohere | Bot directories describe it as a Cohere fetcher or crawler. Some also list `cohere-training-data-crawler` | **Unverified.** We found no Cohere page that documents either token (checked 2026-10-15) |
| `Bytespider` | ByteDance | Widely described as ByteDance's AI training crawler. Reports disagree on whether it honors robots.txt | **Unverified.** We found no ByteDance page that documents it (checked 2026-10-15). Cloudflare's managed robots.txt includes it in its training block list ([source](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)) |

These two are commented out in our templates. Blocking them in robots.txt costs you nothing, but we won't present a token as documented when the vendor hasn't documented it. If you find the vendor's page, please [open a pull request](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/CONTRIBUTING.md).

## The pattern in one table

| Company | Search (appear in answers) | Training | User fetch |
|---|---|---|---|
| OpenAI | OAI-SearchBot | GPTBot | ChatGPT-User |
| Anthropic | Claude-SearchBot | ClaudeBot | Claude-User |
| Perplexity | PerplexityBot | (none listed) | Perplexity-User |
| Google | Googlebot (AI Overviews, AI Mode) | Google-Extended (also Gemini app grounding) | (not covered here) |
| Apple | Applebot | Applebot-Extended | (none listed) |
| Microsoft | bingbot (Bing, Copilot) | No token: NOCACHE / NOARCHIVE meta tags | (none documented) |
| Meta | meta-webindexer | meta-externalagent | meta-externalfetcher |
| Amazon | Amzn-SearchBot | Amazonbot | Amzn-User |
| DuckDuckGo | DuckAssistBot, DuckDuckBot | (none: not used for training) | (none listed) |
| Mistral | MistralAI-Index | MistralAI-Training | MistralAI-User |
| Common Crawl | (none) | CCBot | (none) |

## Sources

All checked 2026-10-15.

- OpenAI: [Overview of OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- Anthropic: [Does Anthropic crawl data from the web, and how can site owners block the crawler?](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- Perplexity: [Perplexity crawlers](https://docs.perplexity.ai/guides/bots)
- Google: [Google's common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot), [Verifying Googlebot](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests), [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- Apple: [About Applebot](https://support.apple.com/en-us/119829)
- Microsoft: [Which crawlers does Bing use?](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0), [bingbot user-agent change (2022)](https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/), [NOCACHE and NOARCHIVE for Bing Chat (2023)](https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat), [AI Performance in Bing Webmaster Tools (2026)](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)
- Meta: [Meta web crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/)
- Amazon: [Amazonbot](https://developer.amazon.com/amazonbot)
- Common Crawl: [CCBot](https://commoncrawl.org/ccbot)
- DuckDuckGo: [DuckAssistBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot), [DuckDuckBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot)
- Mistral: [Mistral robots](https://docs.mistral.ai/robots)
- Standard: [RFC 9309, Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)

---

Maintained by [Cited](https://cited.io): AI SEO and GEO agency with its own AI visibility platform. For what to do once the crawlers can reach you, read [how to get cited by ChatGPT](https://cited.io/guides/how-to-get-cited-by-chatgpt).
