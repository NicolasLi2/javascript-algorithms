import { Compare, defaultCompare } from '../../util.js';
import BinarySearchTree from './binary-search-tree.js';
import { Node } from './node.js';

const BalanceFactor = {
  UNBALANCED_RIGHT: 2,
  SLIGHTLY_UNBALANCED_RIGHT: 1,
  BALANCED: 0,
  SLIGHTLY_UNBALANCED_LEFT: -1,
  UNBALANCED_LEFT: -2,
};

export default class AVLTree extends BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    super(compareFn);
    this.compareFn = compareFn;
    this.root = null;
  }

  getNodeHeight(node) {
    if (node == null) {
      return -1;
    }
    return (
      Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) +
      1
    );
  }

  /**
   * Left left case: rotate right
   *
   *       b                           a
   *      / \                         / \
   *     a   e -> rotationLL(b) ->   c   b
   *    / \                             / \
   *   c   d                           d   e
   *
   * @param node Node<T>
   */
  rotationLL(node) {
    const tmp = node.left;
    node.left = tmp.right;
    tmp.right = node;
    return tmp;
  }

  /**
   * Right right case: rotate left
   *
   *     a                              b
   *    / \                            / \
   *   c   b   -> rotationRR(a) ->    a   e
   *      / \                        / \
   *     d   e                      c   d
   *
   * @param node Node<T>
   */
  rotationRR(node) {
    const tmp = node.right;
    node.right = tmp.left;
    tmp.left = node;
    return tmp;
  }

  /**
   * Left right case: rotate left then right
   * @param node Node<T>
   */
  rotationLR(node) {
    node.left = this.rotationRR(node.left);
    return this.rotationLL(node);
  }

  /**
   * Right left case: rotate right then left
   * @param node Node<T>
   */
  rotationRL(node) {
    node.right = this.rotationLL(node.right);
    return this.rotationRR(node);
  }

  getBalanceFactor(node) {
    const heightDifference =
      this.getNodeHeight(node.right) - this.getNodeHeight(node.left);
    switch (heightDifference) {
      case 2:
        return BalanceFactor.UNBALANCED_RIGHT;
      case 1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT;
      case -1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT;
      case -2:
        return BalanceFactor.UNBALANCED_LEFT;
      default:
        return BalanceFactor.BALANCED;
    }
  }

  insert(key) {
    this.root = this.insertNode(this.root, key);
  }

  insertNode(node, key) {
    if (node == null) {
      return new Node(key);
    } else if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.insertNode(node.left, key);
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.insertNode(node.right, key);
    } else {
      return node; // duplicated key
    }
    // verify if tree is balanced
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
      if (this.compareFn(key, node.left.key) === Compare.LESS_THAN) {
        // Left left case
        node = this.rotationLL(node);
      } else {
        // Left right case
        return this.rotationLR(node);
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
      if (this.compareFn(key, node.right.key) === Compare.BIGGER_THAN) {
        // Right right case
        node = this.rotationRR(node);
      } else {
        // Right left case
        return this.rotationRL(node);
      }
    }
    return node;
  }

  removeNode(node, key) {
    node = super.removeNode(node, key); // {1}
    if (node == null) {
      return node;
    }
    // verify if tree is balanced
    const balanceFactor = this.getBalanceFactor(node);
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
      // Left left case
      if (
        this.getBalanceFactor(node.left) === BalanceFactor.BALANCED ||
        this.getBalanceFactor(node.left) ===
          BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
      ) {
        return this.rotationLL(node);
      }
      // Left right case
      // eg:
      //     e                              e                               e
      //    / \      rotationRR(node.left) / \        rotationLL(node)      / \
      //   c  ...   -> rotationRR(a) ->   c   ...   -> rotationLL(c) ->    b   ...
      //  /                              /                               / \
      // a                              b                               a   c
      //  \                            /
      //   b                          a
      if (
        this.getBalanceFactor(node.left) ===
        BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
      ) {
        return this.rotationLR(node);
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
      // Right right case
      if (
        this.getBalanceFactor(node.right) === BalanceFactor.BALANCED ||
        this.getBalanceFactor(node.right) ===
          BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
      ) {
        return this.rotationRR(node);
      }
      // Right left case
      // eg:
      //     a                              a                           a
      //    / \     rotationLL(node.right) / \       rotationRR(node)   / \
      // ...   b    -> rotationLL(d) ->  ...  b   -> rotationRR(b) -> ...  c
      //        \                              \                         / \
      //        d                               c                       b   d
      //       /                                 \
      //      c                                   d
      if (
        this.getBalanceFactor(node.right) ===
        BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
      ) {
        return this.rotationRL(node);
      }
    }
    return node;
  }
}

// let tree = new AVLTree();
// tree.insert(1);
// tree.insert(2);
// tree.insert(3);
// tree.insert(4);
// tree.insert(5);
// tree.insert(6);
// tree.insert(7);
// tree.insert(8);
// tree.insert(9);
// tree.insert(10);
// console.log(tree.root);
// console.log(tree.getNodeHeight(tree.root));
// console.log(tree.min());
// console.log(tree.max());
// tree.remove(8);
// console.log(tree.root);
