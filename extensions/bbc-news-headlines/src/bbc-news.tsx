// src/index.tsx
import { Action, ActionPanel, List } from "@raycast/api"
import { useCachedPromise } from "@raycast/utils"
import Parser from "rss-parser"

// interface NewsItem {
//     title: string;
//     link: string;
//     pubDate: string;
// }

async function fetchNews() {
  const parser = new Parser()
  const feed = await parser.parseURL("http://feeds.bbci.co.uk/news/rss.xml")

  return feed.items.map((item) => ({
    title: item.title || "",
    link: item.link || "",
    pubDate: item.pubDate || "",
  }))
}

export default function Command() {
  const { data: items, isLoading } = useCachedPromise(fetchNews)

  return (
    <List isLoading={isLoading} navigationTitle="News Headlines" searchBarPlaceholder="Search headlines...">
      {items?.map((item, index) => (
        <List.Item
          key={index}
          title={item.title}
          accessories={[
            {
              text: new Date(item.pubDate).toLocaleString(),
            },
          ]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={item.link} />
              <Action.CopyToClipboard
                content={item.link}
                title="Copy Link"
                shortcut={{ modifiers: ["cmd"], key: "c" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  )
}
