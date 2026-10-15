# Contributing

**Short answer:** issues and pull requests are welcome. Every new or changed crawler needs a link to the vendor's own documentation.

## Adding or correcting a crawler

1. **Link the vendor's page.** Use the company's own documentation for the user-agent token, such as OpenAI's [crawler overview](https://developers.openai.com/api/docs/bots). A bot directory, blog post or log sample is not enough on its own. If there's no vendor page, the crawler goes in the "Unverified" section of [crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md) and stays commented out in the templates.
2. **Quote what the vendor says** about its purpose (search, training or user fetch) and about robots.txt. Don't infer it.
3. **Update every file that names the token:**
   - [crawlers.md](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md);
   - both robots.txt templates in `templates/`;
   - [nextjs-robots.ts](https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/templates/nextjs-robots.ts).
4. **Update the "checked" date** in each file you touch.

## Other changes

- **Cloudflare, Vercel or another host:** link the host's own docs, and note the date you checked them. Dashboard labels change often.
- **Facts and numbers:** every claim needs a source link. Primary sources first.
- **Style:** short sentences, one idea each, and an answer at the top of every file.

## Reporting a problem

Open an issue with the vendor link and what changed. A token rename or a new crawler is the most useful report you can send.
