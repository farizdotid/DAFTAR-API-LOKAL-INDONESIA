import { CategoryType } from '../types'
import vocabularies from '../data/vocabularies.json'

export const translate = (key: string, language: string) => {
  return (vocabularies as Record<string, Record<string, string>>)[language][key] || 'Unknown'
}

export const markdownBuilder = (categories: CategoryType[], language: string) => {
  let results = ''

  for (const category of categories) {
    results += `### ${category.categoryName}`
    results += `\n| ${translate('apiName', language)} | ${translate('developer', language)}`
    results += ` | ${translate('documentation', language)} | ${translate('status', language)}`
    results += ` | ${translate('description', language)}`
    results += ` | ${translate('authentication', language)} |`
    results += `\n| - | - | - | - | - | - |`

    for (const api of category.apis) {
      const developer = api.developer.profileUrl
        ? `[${api.developer.name}](${api.developer.profileUrl})`
        : api.developer.name

      results += `\n| ${api.apiName} | ${developer} | [Link](${api.documentationUrl})`
      results += ` | ${api.status ? '✅' : '❎'} | ${api.description}`
      results += ` | ${api.authentication || '`false`'} |`
    }

    results += '\n'
  }

  return results.trim()
}

export const generateToc = (markdown: string) => {
  const regex = /^(#{1,6})\s+(.+)$/gm
  const headings: { level: number; text: string }[] = []

  let match

  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2]
    headings.push({ level, text })
  }

  const toc = headings
    .map(
      (heading) =>
        `${'  '.repeat(heading.level - 1)}- [${heading.text}](#${heading.text
          .toLowerCase()
          .replace(/\s+/g, '-')})`
    )
    .join('\n')

  return toc
}
