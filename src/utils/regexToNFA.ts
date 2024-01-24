export type NFA = {
  states: Set<string>;
  alphabet: Set<string>;
  transitions: Array<{ from: string; to: string; symbol: string }>;
  start: string;
  accept: Set<string>;
};

const epsilon = "ε";

let stateCounter = 0;

const generateStateName = (): string => {
  return `S${stateCounter++}`;
};

const regexToNFA = (regex: string): NFA => {
  let nfa: NFA = {
    states: new Set(),
    alphabet: new Set(),
    transitions: [],
    start: "",
    accept: new Set(),
  };

  const handleConcatenation = (expr1: NFA, expr2: NFA): void => {
    let localNfa: NFA = {
      states: new Set(),
      alphabet: new Set(),
      transitions: [],
      start: "",
      accept: new Set(),
    };

    localNfa = {
      states: new Set([...expr1.states, ...expr2.states]),
      alphabet: new Set([...expr1.alphabet, ...expr2.alphabet]),
      transitions: [
        ...expr1.transitions,
        ...expr2.transitions,
        ...Array.from(expr1.accept).map((acceptState) => ({
          from: acceptState,
          to: expr2.start,
          symbol: epsilon,
        })),
      ],
      start: expr1.start,
      accept: new Set([...expr2.accept]),
    };

    nfa = { ...localNfa };
  };

  const handleUnion = (expr1: NFA, expr2: NFA): void => {
    let localNfa: NFA = {
      states: new Set(),
      alphabet: new Set(),
      transitions: [],
      start: "",
      accept: new Set(),
    };

    localNfa = {
      states: new Set([...expr1.states, ...expr2.states]),
      alphabet: new Set([...expr1.alphabet, ...expr2.alphabet]),
      transitions: [
        { from: generateStateName(), to: expr1.start, symbol: epsilon },
        { from: generateStateName(), to: expr2.start, symbol: epsilon },
        ...expr1.transitions,
        ...expr2.transitions,
      ],
      start: localNfa.transitions[0].from,
      accept: new Set([...expr1.accept, ...expr2.accept]),
    };

    nfa = { ...localNfa };
  };

  const handleKleeneStar = (expr: NFA): void => {
    let localNfa: NFA = {
      states: new Set([...expr.states]),
      alphabet: new Set([...expr.alphabet]),
      transitions: [
        ...expr.transitions,
        ...Array.from(expr.accept).map((acceptState) => ({
          from: acceptState,
          to: expr.start,
          symbol: epsilon,
        })),
        { from: generateStateName(), to: expr.start, symbol: epsilon },
      ],
      start: "",
      accept: new Set([...expr.accept]),
    };

    // Update the start and accept states
    localNfa.start = generateStateName();
    localNfa.accept = new Set([localNfa.start, ...expr.accept]);

    nfa = { ...localNfa };
  };


  const handleSingleCharacter = (character: string): NFA => {
    const startState = generateStateName();
    const acceptState = generateStateName();

    const singleCharacterNFA: NFA = {
      states: new Set([startState, acceptState]),
      alphabet: new Set([character]),
      transitions: [{ from: startState, to: acceptState, symbol: character }],
      start: startState,
      accept: new Set([acceptState]),
    };

    return singleCharacterNFA;
  };

  const handleExpression = (expr: string): NFA => {
    let currentNFA: NFA | null = null;
    let index = 0;

    const getNextToken = (): string => {
      return expr[index++];
    };

    const parseFactor = (): NFA => {
      let localNfa: NFA = {
        states: new Set(),
        alphabet: new Set(),
        transitions: [],
        start: "",
        accept: new Set(),
      };

      const token = getNextToken();

      if (token === "(") {
        const factorNFA = parseExpression();
        if (getNextToken() !== ")") {
          throw new Error("Missing closing parenthesis");
        }
        return factorNFA;
      } else if (token === "|") {
        throw new Error("Unexpected union operator");
      } else if (token === "*") {
        throw new Error("Unexpected Kleene star operator");
      } else {
        return handleSingleCharacter(token);
      }
    };

    const parseExpression = (): NFA => {
      let localNfa: NFA = {
        states: new Set(),
        alphabet: new Set(),
        transitions: [],
        start: "",
        accept: new Set(),
      };

      let expressionNFA = parseTerm();
      let nextToken = expr[index];
      while (nextToken === "|") {
        index++;
        const termNFA = parseTerm();
        handleUnion(expressionNFA, termNFA);
        expressionNFA = { ...nfa };
        nextToken = expr[index];
      }
      return expressionNFA;
    };

    const parseTerm = (): NFA => {
      let localNfa: NFA = {
        states: new Set(),
        alphabet: new Set(),
        transitions: [],
        start: "",
        accept: new Set(),
      };

      let termNFA = parseFactor();
      let nextToken = expr[index];
      while (
        nextToken &&
        nextToken !== ")" &&
        nextToken !== "|" &&
        nextToken !== "*"
      ) {
        const factorNFA = parseFactor();
        handleConcatenation(termNFA, factorNFA);
        termNFA = { ...nfa };
        nextToken = expr[index];
      }
      return termNFA;
    };

    try {
      currentNFA = parseExpression();
      handleKleeneStar(currentNFA);
    } catch (error) {
      console.error("Error parsing expression:", error);
      throw new Error("Invalid regular expression");
    }

    return currentNFA;
  };

  handleExpression(regex);

  return nfa;
};

export default regexToNFA;
