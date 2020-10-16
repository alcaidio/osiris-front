export type ID = string | number

export class ItemNode {
    children: ItemNode[]
    item: string
}

export class ItemFlatNode {
    item: string
    level: number
    expandable: boolean
}
