import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Tree } from "react-d3-tree";

// AVL Tree Node Class
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

// AVL Tree Class
class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rotateRight(y) {
    let x = y.left;
    let T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  rotateLeft(x) {
    let y = x.right;
    let T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insert(node, value) {
    if (!node) return new AVLNode(value);
    if (value < node.value) node.left = this.insert(node.left, value);
    else if (value > node.value) node.right = this.insert(node.right, value);
    else return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    let balance = this.getBalanceFactor(node);

    if (balance > 1 && value < node.left.value) return this.rotateRight(node);
    if (balance < -1 && value > node.right.value) return this.rotateLeft(node);
    if (balance > 1 && value > node.left.value) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }

  deleteNode(node, value) {
    if (!node) return node;
    if (value < node.value) node.left = this.deleteNode(node.left, value);
    else if (value > node.value) node.right = this.deleteNode(node.right, value);
    else {
      if (!node.left || !node.right) {
        node = node.left ? node.left : node.right;
      } else {
        let temp = this.findMin(node.right);
        node.value = temp.value;
        node.right = this.deleteNode(node.right, temp.value);
      }
    }
    if (!node) return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    let balance = this.getBalanceFactor(node);
    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) return this.rotateRight(node);
    if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) return this.rotateLeft(node);
    if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }

  findMin(node) {
    while (node.left) node = node.left;
    return node;
  }
}

const AVLTreeVisualizer = () => {
  const [tree, setTree] = useState(new AVLTree());
  const [inputValue, setInputValue] = useState("");
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleInsert = () => {
    const newTree = new AVLTree();
    newTree.root = tree.insert(tree.root, parseInt(inputValue));
    setTree(newTree);
    setInputValue("");
  };

  const handleDelete = (value) => {
    const newTree = new AVLTree();
    newTree.root = tree.deleteNode(tree.root, value);
    setTree(newTree);
  };

  const generateTreeData = (node, treeInstance) => {
    if (!node) return null;
    return {
      name: `${node.value} (BF: ${treeInstance.getBalanceFactor(node)})` ,
      children: [generateTreeData(node.left,treeInstance), generateTreeData(node.right,treeInstance)].filter(Boolean),
      data: { value: node.value } // Store the value in data property instead of attributes
    };
  };

  const handleNodeClick = (nodeData) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    
    // Check if the time difference is less than 300ms (standard double-click threshold)
    if (timeDiff < 300) {
      // Access the value from the data property and parse it as an integer
      const value = parseInt(nodeData.data.value);
      handleDelete(value);
    }
    
    setLastClickTime(currentTime);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleInsert}>Insert</Button>
      </div>
      <div style={{ height: "500px", width: "800px", border: "1px solid gray" }}>
        <Tree
          data={generateTreeData(tree.root, tree) || { name: "Empty", data: { value: null } }}
          orientation="vertical"
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
};

export default AVLTreeVisualizer;