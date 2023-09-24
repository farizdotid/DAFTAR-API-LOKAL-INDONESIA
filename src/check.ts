import axios from 'axios'
import https from 'https'
import { CategoryType } from './types'
import { getFiles, isBlacklisted } from './utils'

const crawled: string[] = []
// @ts-ignore
const agent = new https.Agent({ rejectUnauthorized: false })

for await (const file of await getFiles()) {
  const json: CategoryType = await Bun.file(file).json()

  for (const api of json.apis) {
    if (!('documentationUrl' in api) || !api.documentationUrl) {
      console.error('documentationUrl is required.')
      process.exit(1)
    }

    api.documentationUrl = api.documentationUrl.split('#')[0]

    if (crawled.includes(api.documentationUrl)) {
      console.log(`[cache] => ${api.documentationUrl}`)
      continue
    }

    try {
      const response = await axios.get(api.documentationUrl, {
        httpsAgent: agent,
        headers: { 'User-Agent': 'PostmanRuntime/7.26.5', 'Accept-Encoding': 'zlib' },
        maxRedirects: 10,
        validateStatus: () => true,
      })

      if (isBlacklisted(response.data.toString())) {
        console.error('Sorry, the NSFW API is not allowed here :)')
        process.exit(1)
      }

      crawled.push(api.documentationUrl)
      console.log(`[ ${response.status} ] => ${api.documentationUrl}`)
    } catch (error: any) {}
  }
}
