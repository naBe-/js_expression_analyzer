var operator_precedence = {
    '(' : 0,
    ')' : 0,
    '||' : 1,
    '&' : 1
}

function Node(payload, left, right) {
    if(payload === undefined)
        return null;
    this.payload = payload;
    this.left = left || null;
    this.right = right || null;
}

function ExpressionTree(root) {
    if(root === undefined)
        return null;
    this.root = root;
    this.inorder = function(node) {
        if(node) {
            this.inorder(node.left);
            console.log(node.payload);
            this.inorder(node.right);
        }
    }
    this.preorder = function(node) {
        if(node) {
            console.log(node.payload);
            this.inorder(node.left);
            this.inorder(node.right);
        }
    }
    this.postorder = function(node) {
        if(node) {
            this.inorder(node.left);
            this.inorder(node.right);
            console.log(node.payload);
        }
    }
}

function postfix_notation(infix) {
    var stack = [];
    var postfix = [];
    var accumulator = null;

    for(character in infix) {
        if(!operator_precedence[character]) {
            postfix.push(character);
        } else if(!stack.length) {
            stack.push(character);
        } else if(character == '(') {
            stack.push(character);
        } else if(character == ')') {
            while(stack[stack.length-1] != '(')
                postfix.push(stack.pop())
            stack.pop()
        } else if(operator_precedence[character] > operator_precedence[stack[stack.length-1]]) {
            stack.push(character);
        } else {
            while(stack.length > 0) {
                if(stack[stack.length-1] == '(')
                    break;
                postfix.push(stack.pop());
            stack.push(character);
        }
    }

    while(stack.length > 0)
        postfix.push(stack.pop())

    return postfix
}

function build_tree(expression) {
    var position = 0;
    var stack = [];

    var postfix = postfix_notation(expression);

    for(item in postfix) {
        node = new Node(item)
        if(!operator_precedence[item])
            stack.push(node)
        else {
            node.right = stack.pop();
            node.left = stack.pop();
            stack.push(node);
        }
    }

    return new ExpressionTree(stack.pop())
}
