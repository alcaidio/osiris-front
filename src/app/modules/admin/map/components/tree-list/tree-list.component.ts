import { SelectionModel } from '@angular/cdk/collections'
import { FlatTreeControl } from '@angular/cdk/tree'
import { Component, Injectable, OnInit } from '@angular/core'
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree'
import { ItemFlatNode } from 'app/shared/shared.model'
import { BehaviorSubject } from 'rxjs'
import { ItemNode } from './../../../../../shared/shared.model'

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<ItemNode[]>([])

  get data(): ItemNode[] { return this.dataChange.value }

  constructor() {
    this.initialize()
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `ItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0)

    // Notify the change.
    this.dataChange.next(data)
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `ItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): ItemNode[] {
     const test = Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
      const value = obj[key]
      const node = new ItemNode()
      node.item = key

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1)
        } else {
          node.item = value
        }
      }

      return accumulator.concat(node)
    }, [])
     console.log(test)
     return test
  }

  /** Add an item to to-do list */
  insertItem(parent: ItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as ItemNode)
      this.dataChange.next(this.data)
    }
  }

  updateItem(node: ItemNode, name: string) {
    node.item = name
    this.dataChange.next(this.data)
  }
}

@Component({
  selector: 'app-tree-list',
  templateUrl: 'tree-list.component.html',
  providers: [ChecklistDatabase],
  styles: [`
    .mat-form-field {
      margin-right: 4px;
    }
  `]
})
export class TreeListComponent implements OnInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ItemFlatNode, ItemNode>()

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>()

  /** A selected parent node to be inserted */
  selectedParent: ItemFlatNode | null = null

  /** The new item's name */
  newItemName = ''

  treeControl: FlatTreeControl<ItemFlatNode>

  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>

  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */)

  constructor(private _database: ChecklistDatabase) {}

  ngOnInit() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren)
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable)
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)

    this._database.dataChange.subscribe(data => {
      this.dataSource.data = data
    })
  }

  getLevel = (node: ItemFlatNode) => node.level

  isExpandable = (node: ItemFlatNode) => node.expandable

  getChildren = (node: ItemNode): ItemNode[] => node.children

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable

  hasNoContent = (_: number, _nodeData: ItemFlatNode) => _nodeData.item === ''

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node)
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new ItemFlatNode()
    flatNode.item = node.item
    flatNode.level = level
    flatNode.expandable = !!node.children?.length
    this.flatNodeMap.set(flatNode, node)
    this.nestedNodeMap.set(node, flatNode)
    return flatNode
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node)
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child)
    })
    return descAllSelected
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node)
    const result = descendants.some(child => this.checklistSelection.isSelected(child))
    return result && !this.descendantsAllSelected(node)
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  ItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node)
    const descendants = this.treeControl.getDescendants(node)
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants)

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child))
    this.checkAllParentsSelection(node)
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  LeafItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node)
    this.checkAllParentsSelection(node)
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: ItemFlatNode): void {
    let parent: ItemFlatNode | null = this.getParentNode(node)
    while (parent) {
      this.checkRootNodeSelection(parent)
      parent = this.getParentNode(parent)
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: ItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node)
    const descendants = this.treeControl.getDescendants(node)
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child)
    })
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node)
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node)
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: ItemFlatNode): ItemFlatNode | null {
    const currentLevel = this.getLevel(node)

    if (currentLevel < 1) {
      return null
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i]

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode
      }
    }
    return null
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: ItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node)
    // tslint:disable-next-line: no-non-null-assertion
    this._database.insertItem(parentNode!, '')
    this.treeControl.expand(node)
  }

  /** Save the node to database */
  saveNode(node: ItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node)
    // tslint:disable-next-line: no-non-null-assertion
    this._database.updateItem(nestedNode!, itemValue)
  }
}
