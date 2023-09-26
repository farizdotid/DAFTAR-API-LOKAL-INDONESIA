import * as path from 'path'
import * as fsPromises from 'fs/promises'
import blacklist from '../data/blacklist.json'

export const resolve = (...fileName: string[]) => {
  return path.resolve(import.meta.dir, '..', '..', 'data', ...fileName)
}

export const getLanguage = (filePath: string) => {
  return path.basename(filePath, path.extname(filePath))
}

export const getFiles = async (
  dirPath: string = resolve(),
  fileList: string[] = []
): Promise<string[]> => {
  const files = await fsPromises.readdir(dirPath)

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dirPath, file)
      const stats = await fsPromises.stat(filePath)

      if (stats.isFile()) {
        fileList.push(filePath)
      } else if (stats.isDirectory()) {
        await getFiles(filePath, fileList)
      }
    })
  )

  return fileList
}

export const isBlacklisted = (html: string) => {
  return blacklist.some((item) => html.includes(item))
}
