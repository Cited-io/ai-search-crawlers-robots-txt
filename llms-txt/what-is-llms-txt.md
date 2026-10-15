# llms.txt: what it is, the format, and whether it helps AI search

**Short answer:** llms.txt is a Markdown file at `/llms.txt` on your site. It gives language models a short summary of who you are and links to the pages that matter. The format comes from a community proposal at [llmstxt.org](https://llmstxt.org); no standards body has taken it up. No major AI engine has said it uses llms.txt to decide what to cite. Google says you need no AI text files to appear in AI Overviews or AI Mode. Add one if it is cheap to keep accurate. Don't expect it to move your AI visibility.

Files in this folder:

- [llms-template.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/llms-txt/llms-template.txt): a blank template with instructions in each section.
- [llms-example.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/llms-txt/llms-example.txt): a filled-in example for a fictional company.
- A live file in production: [cited.io/llms.txt](https://cited.io/llms.txt).

## The format

The [llmstxt.org](https://llmstxt.org) proposal, from Jeremy Howard (first published September 2024), sets out these sections in this order:

1. **An H1 with the site or project name.** This is the only required part.
2. **A blockquote summary.** Short, and enough to understand the rest of the file.
3. **Optional detail.** Paragraphs or lists, but no headings.
4. **Optional H2 sections of links.** Each item is `[name](url)`, optionally followed by `: notes`.

One H2 has a special meaning. A section titled **Optional** holds links an agent can skip when it needs a shorter context.

Some sites also publish `/llms-full.txt`, which contains the full text of the listed pages in one file. That is a common practice, not part of the core format above.

## Does it help? What the evidence says

| Question | Answer | Source |
|---|---|---|
| Does Google need it for AI Overviews or AI Mode? | No. "You don't need to create new machine readable files, AI text files, or markup to appear in these features." | [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) |
| What does Google need instead? | The page must be indexed and eligible to show in Search with a snippet. Googlebot must be allowed | [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) |
| Do OpenAI, Anthropic or Perplexity say they read it for search? | Their crawler docs don't mention llms.txt. They describe robots.txt controls only | [OpenAI](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity](https://docs.perplexity.ai/guides/bots) |
| Is there a downside? | Little. A stale file is the main one: if it lists last year's prices, a model that reads it repeats them | Our view |

What actually decides whether AI engines can use your pages is robots.txt, your firewall and indexing. That is the rest of this repo: [crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md) and [check.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/check.md).

## Why write one anyway

- **It costs an hour.** The file is short and static.
- **Some tools read it.** Developer tools such as LangChain's [mcpdoc](https://github.com/langchain-ai/mcpdoc) load a site's llms.txt into a coding assistant. For developer products, that is a real audience. Several vendors publish one for their own docs, among them [Cloudflare](https://developers.cloudflare.com/bots/llms.txt) and [Next.js](https://nextjs.org/docs/llms.txt).
- **It is a good test of your positioning.** If your team can't agree on the blockquote, your homepage probably doesn't say it clearly either. Fix both.

## How to keep it honest

- **Build it in your deploy, not by hand.** For example, render the plan list from the same data your pricing page uses. A file someone edits once a year will be wrong within months.
- **State facts, not slogans.** "Payroll software for US restaurants with 5 to 200 staff" helps a model more than "the future of payroll".
- **Link canonical URLs only,** on your production domain.
- **Date anything that changes,** such as prices, with the month you checked it.
- **Don't list pages robots.txt blocks.** A crawler that obeys robots.txt can't follow those links.

## How to fill in the template

Start from [llms-template.txt](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/llms-txt/llms-template.txt):

1. **Replace every placeholder,** including `Company Name` and each `https://www.example.com` link, and delete any section you have nothing for.
2. **Keep the order:** H1, blockquote, detail, then H2 link sections. The detail part may not use headings.
3. **Write each link as `[name](url): note`,** with a one-line note on what the page answers.
4. **Put secondary pages under `## Optional`,** so an agent short on context can skip them.

## Where to put it

Most sites serve it at `https://www.example.com/llms.txt`, as plain text. A docs site can keep its own next to its pages, for example `https://www.example.com/docs/llms.txt`; llmstxt.org permits that. In Next.js, put a static file in `public/llms.txt`, or generate it from a route handler at `app/llms.txt/route.ts`.

## Sources

All checked 2026-10-15.

- [The /llms.txt file proposal](https://llmstxt.org)
- [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots), [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Perplexity crawlers](https://docs.perplexity.ai/guides/bots)

---

Maintained by [Cited](https://cited.io): AI SEO and GEO agency with its own AI visibility platform. For the longer answer, read [What is llms.txt, and does it help?](https://cited.io/guides/llms-txt)
