# How to check whether AI crawlers can reach your site

**Short answer:** run three checks, in this order.

1. **Read the robots.txt that is actually served**, after your CDN, not the copy in your repository.
2. **Request a page with each crawler's user agent** using curl, to spot firewall blocks.
3. **Look for real crawler visits** in your server or CDN logs, and confirm them against the vendor's IP list.

Steps 1 and 2 take five minutes and catch most problems. Only step 3 proves that the real crawler got through. Then use the Bing Webmaster Tools **AI Performance** report to see whether Copilot actually cites you.

## 1. Read the live robots.txt

```sh
curl -s https://www.example.com/robots.txt
```

Check four things:

- **The status is 200.** Add `-o /dev/null -w "%{http_code}\n"` to print only the status.
- **There are no surprise groups.** Cloudflare's Bot Preference Sync puts its own rules before yours, so the served file can block GPTBot or ClaudeBot even when your file doesn't. See [cloudflare-vercel.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/cloudflare-vercel.md).
- **Every crawler you want is allowed by the group that names it.** A crawler follows only the most specific group that names it ([RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)). A `Disallow: /` under `User-agent: GPTBot` wins over `Allow: /` under `User-agent: *`.
- **Applebot is named if Googlebot is.** If there's no Applebot group, Apple follows your Googlebot rules ([Apple](https://support.apple.com/en-us/119829)).

To test one rule the way Google reads it, use Google's open-source parser, [google/robotstxt](https://github.com/google/robotstxt). Bing Webmaster Tools also has a [robots.txt tester](https://www.bing.com/webmasters/help/robots-txt-tester-623520ca).

## 2. Request a page with each crawler's user agent

This shows whether your firewall or bot settings treat the request differently because of its user agent.

```sh
URL="https://www.example.com/"

for UA in \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)" \
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)" \
  "Claude-SearchBot" \
  "Claude-User" \
  "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
do
  printf "%s  %s\n" "$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" "$URL")" "$UA"
done
```

The OpenAI and Perplexity strings are the examples from their docs ([OpenAI](https://developers.openai.com/api/docs/bots), [Perplexity](https://docs.perplexity.ai/guides/bots)). OpenAI notes that the version number may change. Anthropic's page names its tokens but doesn't publish full strings, so the script sends the bare token. The bingbot string is Bing's historical one ([Bing](https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/)). The Googlebot line uses Google's long-standing desktop string. Add any other token from [crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md).

**How to read the result:**

| What you see | What it probably means |
|---|---|
| `200` for every user agent | No rule blocks on user agent alone. Go on to step 3 |
| `403`, `429` or `503` for some user agents only | A firewall or bot rule matches that user agent. Look at your CDN's security events |
| `403` for every user agent, including Googlebot | Your CDN blocks unverified bots, which is normal. A fake from your laptop fails where the real crawler may pass. Go to step 3 |
| `200` with a challenge or CAPTCHA page in the body | A bot challenge. Crawlers can't solve it. Check Bot Fight Mode or your bot protection |

**The limit of this test.** Cloudflare and Vercel check bots by IP address, reverse DNS or signature, not by user agent alone. Your laptop is not OpenAI. So a `403` here doesn't prove the real OAI-SearchBot is blocked, and a `200` doesn't prove it gets in. Treat this step as a first signal only.

## 3. Find real crawler visits in your logs

This is the only proof. Search your access logs for the tokens:

```sh
grep -Ei "OAI-SearchBot|ChatGPT-User|GPTBot|Claude-SearchBot|Claude-User|ClaudeBot|PerplexityBot|Perplexity-User|bingbot|Googlebot|Applebot|meta-webindexer|Amzn-SearchBot|DuckAssistBot|MistralAI" access.log \
  | awk '{print $1, $9}' | sort | uniq -c | sort -rn | head -50
```

This assumes the common log format, where field 1 is the IP address and field 9 is the status code. Adjust for yours. On managed hosting, use the host's log view or a log drain.

**What to look for:**

- **The crawlers you want are present** and mostly get `200` (or `304`). Many `403`s mean an edge rule blocks them.
- **The IP addresses are genuine.** Anyone can claim to be GPTBot. Check the IPs against the vendor's published list, linked for each crawler in [crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md). Google, Apple, Bing and Common Crawl also support a reverse DNS check: look up the IP's hostname, then confirm it resolves back to the same IP ([Google](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests), [Bing's Verify Bingbot tool](https://www.bing.com/toolbox/verify-bingbot)).

```sh
# Example: is 203.0.113.7 in OpenAI's published OAI-SearchBot ranges?
curl -s https://openai.com/searchbot.json | grep -o '"ipv4Prefix": *"[^"]*"'
```

Then compare by hand, or with a CIDR tool such as Python's `ipaddress` module.

**If you use Cloudflare,** **AI Crawl Control** shows each AI crawler's requests, how many failed, and how many times it broke your robots.txt rules ([Cloudflare](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/)). It is the quickest way to see whether OAI-SearchBot or Claude-SearchBot reach you at all.

**Allow time for changes.** Vendors cache robots.txt:

| Crawler | Stated delay | Source |
|---|---|---|
| OpenAI search | About 24 hours | [OpenAI](https://developers.openai.com/api/docs/bots) |
| Meta crawlers | Up to 24 hours | [Meta](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) |
| DuckAssistBot | 72 hours | [DuckDuckGo](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot) |
| Amazonbot | Caches robots.txt for up to 30 days | [Amazon](https://developer.amazon.com/amazonbot) |

## 4. See whether Copilot cites you: Bing AI Performance

Crawler access is the start. Being cited is the goal. Microsoft offers site owners a report built for exactly this.

The **AI Performance** report in [Bing Webmaster Tools](https://www.bing.com/webmasters) has been in public preview since 10 February 2026. It covers Microsoft Copilot, AI-generated summaries in Bing and "select partner integrations". It shows:

- **Total citations:** how often your pages were shown as sources in AI answers.
- **Average cited pages:** unique pages cited per day.
- **Grounding queries:** a sample of the phrases the AI used when it retrieved your content.
- **Page-level citation activity:** citations for each URL.
- **Trends over time.**

To use it, verify your site in Bing Webmaster Tools and open AI Performance. If it shows no citations while your logs show bingbot getting `200`s, access is not the problem. Your content is.

Source: [Introducing AI Performance in Bing Webmaster Tools](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/).

For ChatGPT, Perplexity, Gemini and Google's AI features, the dependable method is to ask them the questions your buyers ask and record which sources each answer lists. Our guide on [how to measure AI visibility](https://cited.io/guides/how-to-measure-ai-visibility) covers the method.

## Sources

All checked 2026-10-15.

- [RFC 9309, Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots), [Perplexity crawlers](https://docs.perplexity.ai/guides/bots), [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Verifying Google's crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests), [google/robotstxt](https://github.com/google/robotstxt)
- [About Applebot](https://support.apple.com/en-us/119829)
- [bingbot user agents](https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/), [Verify Bingbot](https://www.bing.com/toolbox/verify-bingbot), [AI Performance in Bing Webmaster Tools](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)
- [Meta web crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/), [Amazonbot](https://developer.amazon.com/amazonbot), [DuckAssistBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot)
- [Cloudflare: Manage AI crawlers](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/)

---

Maintained by [Cited](https://cited.io): AI SEO and GEO agency with its own AI visibility platform. To track which engines cite you, prompt by prompt, read [how to measure AI visibility](https://cited.io/guides/how-to-measure-ai-visibility).
