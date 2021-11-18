/****************************************************************
 *             CODERBYTE CALCULATOR CHALLENGE                   *
 *                                                              *
 * Problem Statement                                            *
 * Have the function Calculator(str) take the str parameter     *
 * being passed and evaluate the mathematical expression within *
 * in. For example, if str were "2+(3-1)*3" the output should   *
 * be 8. Another example: if str were "(2-0)(6/2)" the output   *
 * should be 6. There can be parenthesis within the string so   *
 * you must evaluate it properly according to the rules of      *
 * arithmetic.                                                  *
 * The string will contain the operators: +, -, /, *, (, and ). *
 * If you have a string like this: #/#*# or #+#(#)/#, then      *
 * evaluate from left to right. So divide then multiply, and    *
 * for the second one multiply, divide, then add.               *
 * The evaluations will be such that there will not be any      *
 * decimal operations, so you do not need to account for        *
 * rounding and whatnot.                                        *
 *                                                              *
 * Examples                                                     *
 * Input 1: "6*(4/2)+3*1"                                       *
 * Output 1: 15                                                 *
 *                                                              *
 * Input 2: "6/3-1"                                             *
 * Output 2: 1                                                  *
 *                                                              *
 ***************************************************************/

// Unsecure alternative.
//function Calculator(string) {
//    let evaluateExpression = new String("");
//    let splittedString = string.split("");
//    let flag = false;
//    for(let i=0; i<splittedString.length; i++){
//        if(i!=0 && i!=splittedString.length-1) {
//            if(splittedString[i] == ')' && (splittedString[i+1] == Number(splittedString[i+1]) || splittedString[i+1] == '(') && flag == false) {
//                evaluateExpression += splittedString[i] + "*";
//                flag = true;
//            }
//            else if(splittedString[i] == '(' && (splittedString[i-1] == Number(splittedString[i-1]) || splittedString[i-1] == ')') && flag == false ) {
//                evaluateExpression += "*" + splittedString[i];
//                flag = true;
//            }
//            else evaluateExpression += splittedString[i];
//        }
//        else evaluateExpression += splittedString[i];
//    }
//    return eval(evaluateExpression);
//}
const Operations = {
  "-": {
    fn: (a, b) => a - b,
    priority: false,
    allowBegingWith: true,
  },
  "+": {
    fn: (a, b) => a + b,
    priority: false,
    allowBegingWith: true,
  },
  "*": {
    fn: (a, b) => a * b,
    priority: true,
    allowBegingWith: false,
  },
  "/": {
    fn: (a, b) => a / b,
    priority: true,
    allowBegingWith: false,
  },
};

function getNextNumber(str) {
  const nextNumber = str.match(/\d+/);
  const isNext = nextNumber ? str.startsWith(nextNumber) : false;
  const remainingStr = isNext ? str.slice(nextNumber.length) : str;
  return [isNext, nextNumber[0], remainingStr];
}

function getNextOperation(str) {
  const nextOp = Object.keys(Operations).find((op) => str.startsWith(op));
  const remainingStr = nextOp ? str.slice(nextOp.length) : str;
  return [!!nextOp, nextOp, remainingStr];
}

const SymbolTypes = {
    NUMBER: "number",
    OPERATION: "operation",
    EXPRESSION: "expression",
  };

const Handlers = [
    {
      fn:getNextNumber,
      type:SymbolTypes.NUMBER,
    },
    {
      fn:getNextOperation,
      type:SymbolTypes.OPERATION,
    },
]


class Node {
  constructor() {
    this._innerValue = 0;
    this._nextOp = null;
  }

  set innerValue(val) {
    if (this._innerValue) {
      throw "innerValue already exists";
    }
    this._innerValue = val;
  }
  set nextOp(val){
    if (this._nextOp) {
        throw "nextOp already exists";
    }
    this._nextOp = val;
  }
  
}

function ParseNext(str) {
  if (!str) {
    return null;
  }
  for (let i=0;i<Handlers.length;i++){
      const handler = Handlers[i];
      const [exists, symbolContent, remainingStr] = handler.fn(str);
      if (exists){
          return [handler.type,symbolContent,remainingStr]
      }
  }
  throw `Something went wrong with ${str}`;
}

class Parser {
  constructor(str) {
    this.string = str;
    this.nodes = this.compile();
  }

  compile() {
    const nodes = []
    let currentStr = this.string;
    while (true) {
      let currentSymbol = ParseNext(currentStr);
      if (!currentSymbol) {
        return nodes;
      }
      const [symboleType, symbolContent, remainingStr] = currentSymbol;
      switch (symboleType) {
        case SymbolTypes.NUMBER:
          const node = new Node();
          node.innerValue = symbolContent;
          nodes.push(node)
          break;
        case SymbolTypes.OPERATION:
          // set last nodes with operation
          if (!nodes.length && !symbolContent.allowBegingWith) {
            throw `cannot start with a multiplication`;
          }
          nodes[nodes.length-1].nextOp = symbolContent;
          break;
      }
      currentStr = remainingStr;
    }
  }
}

function execute(nodes){
    return nodes
}

function Calculator(string) {
    const nodes = new Parser(string).nodes;
    return execute(nodes);
}

// KEEP THIS FUNCTION CALL HERE
console.log(Calculator("6*4/2+3*1"));

//console.log(Calculator("(6*(4/2)+3*1)(6*(4/2)+3*1)(6*(4/2)+3*1)"));
//console.log(Calculator("(6*(4/2)+3*1)+(6*(4/2)+3*1)(6*(4/2)+3*1)"));
//console.log(Calculator("6/3-1"));
