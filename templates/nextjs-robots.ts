// app/robots.ts: Next.js App Router robots.txt for AI search
// Template from https://github.com/Cited-io/ai-search-crawlers-robots-txt
//
// Copy this file to app/robots.ts (the root of the app directory).
// Next.js serves it at /robots.txt. Docs:
//   https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
//
// It produces the same policy as templates/allow-search-block-training.txt:
// allow AI search crawlers and user fetchers, block model-training crawlers.
// To allow training too, set BLOCK_TRAINING to false.
//
// Every token is verified against the vendor's own docs (2026-10-15):
//   https://github.com/Cited-io/ai-search-crawlers-robots-txt/blob/main/crawlers.md

import type { MetadataRoute } from "next";

const SITE_URL = "https://www.example.com";

// Under RFC 9309 a crawler follows only the most specific group that names
// it, so private paths must be repeated in every group. Keeping them in one
// list means every group below gets the same ones.
const PRIVATE_PATHS: string[] = [
  // "/admin/",
  // "/cart/",
];

// Crawlers that show and link your pages in AI answers, plus fetchers that
// load a page when a person asks about it.
const AI_SEARCH_AND_USER_AGENTS = [
  "OAI-SearchBot", // ChatGPT search
  "Claude-SearchBot", // Claude search
  "PerplexityBot", // Perplexity
  "Googlebot", // Google Search, AI Overviews, AI Mode
  "bingbot", // Bing and Microsoft Copilot
  "Applebot", // Siri, Spotlight, Safari (falls back to Googlebot rules if not named)
  "meta-webindexer", // Meta AI search
  "Amzn-SearchBot", // Alexa and Amazon search
  "DuckAssistBot", // DuckDuckGo AI answers
  "DuckDuckBot", // DuckDuckGo search
  "MistralAI-Index", // Mistral search
  "ChatGPT-User", // user fetch; OpenAI says robots.txt may not apply
  "Claude-User", // user fetch
  "Perplexity-User", // user fetch; Perplexity says it generally ignores robots.txt
  "meta-externalfetcher", // user fetch; Meta says it may bypass robots.txt
  "Amzn-User", // user fetch; Amazon says it may not follow all directives
  "MistralAI-User", // user fetch
];

// Crawlers and tokens that control use of your content for model training.
// Google-Extended also controls grounding in the Gemini app: move it to the
// list above if you want to appear in Gemini app answers.
const AI_TRAINING_AGENTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "MistralAI-Training",
  "CCBot",
];

const BLOCK_TRAINING = true;

function allowWithPrivatePaths(userAgent: string | string[]) {
  return {
    userAgent,
    allow: "/",
    ...(PRIVATE_PATHS.length > 0 ? { disallow: PRIVATE_PATHS } : {}),
  };
}

export default function robots(): MetadataRoute.Robots {
  const searchAgents = BLOCK_TRAINING
    ? AI_SEARCH_AND_USER_AGENTS
    : [...AI_SEARCH_AND_USER_AGENTS, ...AI_TRAINING_AGENTS];

  return {
    rules: [
      allowWithPrivatePaths("*"),
      allowWithPrivatePaths(searchAgents),
      ...(BLOCK_TRAINING ? [{ userAgent: AI_TRAINING_AGENTS, disallow: "/" }] : []),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
