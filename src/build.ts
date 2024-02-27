import https from 'https'
import fetch from 'node-fetch'
import { CategoryType, ListType } from './types'
import { generateToc, markdownBuilder } from './utils/markdown'
import { getFiles, getLanguage, isBlacklisted, resolve } from './utils'

const data: ListType = {}
const crawledx: string[] = []
const crawled: Record<string, boolean> = {}
const agent = new https.Agent({ rejectUnauthorized: false })

// filter files
for await (const file of await getFiles()) {
  const language = getLanguage(file)
  const json: CategoryType = await Bun.file(file).json()

  // sort alphabetically
  json.apis.sort((a, b) => a.apiName.localeCompare(b.apiName))

  if (Bun.argv[2] !== '--merged') {
    for (let i = 0; i < json.apis.length; i++) {
      const api = json.apis[i]
      const previous = api.status

      if (!('documentationUrl' in api) || !api.documentationUrl) {
        console.error('documentationUrl is required.')
        process.exit(1)
      }

      const url = api.documentationUrl.split('#')[0]

      if (url in crawled) {
        api.status = crawled[url]
        console.log(`[ cache ] => ${url}`)
      } else {
        try {
          console.log(`[  ...  ] => ${url}`)

          const response = await fetch(api.documentationUrl, {
            headers: { 'Accept-Encoding': 'zlib, gzip' },
            agent,
            redirect: 'follow',
            follow: 10,
            signal: AbortSignal.timeout(10_000),
          })
          const body = await response.text()

          api.status = response!.status !== 404
          console.log(`[  ${response.status}  ] => ${url}`)

          // mark as nsfw
          if (isBlacklisted(body)) {
            crawledx.push(url)
          }
        } catch (error: any) {
          api.status = false
          console.log(`[  404  ] => ${url}`)
        }

        // mark as crawled
        crawled[url] = api.status
      }

      if (
        // if their content contains nsfw
        crawledx.includes(url) ||
        // if both current and previous statuses are false
        (!api.status && !previous)
      ) {
        // remove items from array
        json.apis.splice(i, 1)
        i--
      }
    }
  }

  await Bun.write(file, JSON.stringify(json, undefined, 2))

  if (language in data) {
    data[language].push(json)
  } else {
    data[language] = [json]
  }
}

// write to markdown
for await (const language of Object.keys(data)) {
  const categories = data[language].sort((a, b) => a.categoryName.localeCompare(b.categoryName))
  const fileName = ['README', language === 'id' ? null : language, 'md'].filter((value) => !!value)
  const filePath = resolve(import.meta.dir, '..', fileName.join('.'))
  const markdown = await Bun.file(filePath).text()

  let result: string

  // apply api list
  const apiRegex =
    /^(<!--(?:\s|)API START(?:\s|)-->)(?:\n|)([\s\S]*?)(?:\n|)(<!--(?:\s|)API END(?:\s|)-->)$/gm
  result = markdown.replace(apiRegex, `$1\n${markdownBuilder(categories, language)}\n$3`)

  // apply toc
  const tocRegex =
    /^(<!--(?:\s|)TOC START(?:\s|)-->)(?:\n|)([\s\S]*?)(?:\n|)(<!--(?:\s|)TOC END(?:\s|)-->)$/gm
  result = result.replace(tocRegex, `$1\n${generateToc(result)}\n\n$3`)

  await Bun.write(filePath, result)
}

// prettier
Bun.spawn(['bun', 'format'])
