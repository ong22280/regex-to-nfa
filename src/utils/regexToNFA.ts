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
    // Add transitions for concatenation
    expr1.accept.forEach((state) => {
      expr2.transitions.push({ from: state, to: expr2.start, symbol: epsilon });
    });

    nfa = {
      states: new Set([...expr1.states, ...expr2.states]),
      alphabet: new Set([...expr1.alphabet, ...expr2.alphabet]),
      transitions: [...expr1.transitions, ...expr2.transitions],
      start: expr1.start,
      accept: expr2.accept,
    };
  };

  const handleUnion = (expr1: NFA, expr2: NFA): void => {
    // Create a new start state and connect it to the start states of expr1 and expr2
    const newStartState = generateStateName();
    nfa.transitions.push({
      from: newStartState,
      to: expr1.start,
      symbol: epsilon,
    });
    nfa.transitions.push({
      from: newStartState,
      to: expr2.start,
      symbol: epsilon,
    });

    // Create a new accept state and connect the accept states of expr1 and expr2 to it
    const newAcceptState = generateStateName();
    expr1.accept.forEach((state) =>
      nfa.transitions.push({ from: state, to: newAcceptState, symbol: epsilon })
    );
    expr2.accept.forEach((state) =>
      nfa.transitions.push({ from: state, to: newAcceptState, symbol: epsilon })
    );

    nfa = {
      states: new Set([
        ...expr1.states,
        ...expr2.states,
        newStartState,
        newAcceptState,
      ]),
      alphabet: new Set([...expr1.alphabet, ...expr2.alphabet]),
      transitions: [
        ...expr1.transitions,
        ...expr2.transitions,
        ...nfa.transitions,
      ],
      start: newStartState,
      accept: new Set([newAcceptState]),
    };
  };

  const handleKleeneStar = (expr: NFA): void => {
    // Create a new start state and connect it to the original start state and the new accept state
    const newStartState = generateStateName();
    nfa.transitions.push({
      from: newStartState,
      to: expr.start,
      symbol: epsilon,
    });
    nfa.transitions.push({
      from: newStartState,
      to: nfa.accept.values().next().value,
      symbol: epsilon,
    });

    // Connect the original accept state to the original start state and the new accept state
    expr.accept.forEach((state) => {
      nfa.transitions.push({ from: state, to: expr.start, symbol: epsilon });
      nfa.transitions.push({
        from: state,
        to: nfa.accept.values().next().value,
        symbol: epsilon,
      });
    });

    nfa = {
      states: new Set([...expr.states, newStartState]),
      alphabet: new Set([...expr.alphabet]),
      transitions: [...expr.transitions, ...nfa.transitions],
      start: newStartState,
      accept: nfa.accept,
    };
  };

  const handleSingleCharacter = (character: string): NFA => {
    const startState = generateStateName();
    const acceptState = generateStateName();

    nfa = {
      states: new Set([startState, acceptState]),
      alphabet: new Set([character]),
      transitions: [{ from: startState, to: acceptState, symbol: character }],
      start: startState,
      accept: new Set([acceptState]),
    };

    return nfa;
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
        // Handle parentheses
        localNfa = parseExpression();
        getNextToken(); // Consume closing parenthesis
      } else {
        // Handle single character
        localNfa = handleSingleCharacter(token);
      }

      return localNfa;
    };

    const parseExpression = (): NFA => {
      let localNfa: NFA = parseTerm();
      let nextToken = expr[index];

      while (nextToken === "|") {
        getNextToken(); // Consume '|'
        const expr2 = parseTerm();
        handleUnion(localNfa, expr2);
        nextToken = expr[index];
      }

      return localNfa;
    };

    const parseTerm = (): NFA => {
      let localNfa: NFA = parseFactor();
      let nextToken = expr[index];

      while (nextToken && nextToken !== ")" && nextToken !== "|") {
        const expr2 = parseFactor();
        handleConcatenation(localNfa, expr2);
        nextToken = expr[index];
      }

      return localNfa;
    };

    currentNFA = parseExpression();

    return currentNFA;
  };

  handleExpression(regex);

  return nfa;
};

export default regexToNFA;
