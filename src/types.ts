// something changes
type ItemType = {
  apiName: string
  status: boolean
  documentationUrl: string
  developer: { name: string; profileUrl: string | null }
  description: string
  authentication: string | false
}

export type CategoryType = {
  categoryName: string
  apis: ItemType[]
}

export type ListType = {
  [x: string]: CategoryType[]
}
