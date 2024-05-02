// another thing
import https from 'https'
import fetch from 'node-fetch'
import { CategoryType } from './types'
import { getFiles, isBlacklisted } from './utils'

const crawled: string[] = []
const agent = new https.Agent({ rejectUnauthorized: false })

for await (const file of await getFiles()) {
  const json: CategoryType = await Bun.file(file).json()

  for await (const api of json.apis) {
    if (!('documentationUrl' in api) || !api.documentationUrl) {
      console.error('documentationUrl is required.')
      process.exit(1)
    }

    api.documentationUrl = api.documentationUrl.split('#')[0]

    if (crawled.includes(api.documentationUrl)) {
      console.log(`[ cache ] => ${api.documentationUrl}`)
      continue
    }

    try {
      console.log(`[  ...  ] => ${api.documentationUrl}`)

      const response = await fetch(api.documentationUrl, {
        headers: { 'Accept-Encoding': 'zlib, gzip' },
        agent,
        redirect: 'follow',
        follow: 10,
        signal: AbortSignal.timeout(10_000),
      })
      const body = await response.text()

      if (isBlacklisted(body)) {
        console.error('Sorry, the NSFW API is not allowed here :)')
        process.exit(1)
      }

      crawled.push(api.documentationUrl)
      console.log(`[  ${response.status}  ] => ${api.documentationUrl}`)
    } catch (error: any) {}
  }
}
