export type NFA = {
  start: string;
  accept: string[];
  transitions: { from: string; to: string; symbol: string }[];
};

const epsilon = "ε";

let stateCounter = 0;

const generateStateName = (): string => {
  return `S${stateCounter++}`;
};

// ... (previous code)

const regexToNFA = (regex: string): NFA => {
  const stack: NFA[] = [];

  for (let i = 0; i < regex.length; i++) {
    const char = regex[i];

    if (char === "(") {
      stack.push({ start: "", accept: [], transitions: [] });
    } else if (char === ")") {
      const groupNFA = stack.pop() || {
        start: "",
        accept: [],
        transitions: [],
      };
      const prevNFA = stack.pop();

      if (prevNFA) {
        const newStart = generateStateName();
        const newAccept = generateStateName();
        const transitions = [
          { from: newStart, to: prevNFA.start, symbol: epsilon },
          ...prevNFA.transitions,
          { from: prevNFA.accept[0], to: groupNFA.start, symbol: epsilon },
          ...groupNFA.transitions,
          { from: groupNFA.accept[0], to: newAccept, symbol: epsilon },
          { from: newStart, to: newAccept, symbol: epsilon },
        ];

        stack.push({ start: newStart, accept: [newAccept], transitions });
      } else {
        stack.push(groupNFA);
      }
    } else if (char === "|") {
      const orNFA2 = stack.pop() || { start: "", accept: [], transitions: [] };
      const orNFA1 = stack.pop() || { start: "", accept: [], transitions: [] };

      const newStart = generateStateName();
      const newAccept = generateStateName();
      const transitions = [
        { from: newStart, to: orNFA1.start, symbol: epsilon },
        { from: newStart, to: orNFA2.start, symbol: epsilon },
        ...orNFA1.transitions,
        ...orNFA2.transitions,
        { from: orNFA1.accept[0], to: newAccept, symbol: epsilon },
        { from: orNFA2.accept[0], to: newAccept, symbol: epsilon },
      ];

      stack.push({ start: newStart, accept: [newAccept], transitions });
    } else if (char === "*") {
      const prevNFA = stack.pop();

      if (prevNFA) {
        const newStart = generateStateName();
        const newAccept = generateStateName();
        const transitions = [
          { from: newStart, to: prevNFA.start, symbol: epsilon },
          ...prevNFA.transitions,
          { from: prevNFA.accept[0], to: newAccept, symbol: epsilon },
          { from: newAccept, to: prevNFA.start, symbol: epsilon },
          { from: newStart, to: newAccept, symbol: epsilon },
        ];

        stack.push({ start: newStart, accept: [newAccept], transitions });
      }
    } else {
      const newStart = generateStateName();
      const newAccept = generateStateName();
      const transitions = [{ from: newStart, to: newAccept, symbol: char }];

      stateCounter++;

      stack.push({ start: newStart, accept: [newAccept], transitions });
    }
  }

  // Handle concatenation by connecting adjacent NFAs
  const concatenatedNFA = stack.reduce((resultNFA, currentNFA) => {
    if (resultNFA) {
      const newTransitions = [
        ...resultNFA.transitions,
        { from: resultNFA.accept[0], to: currentNFA.start, symbol: epsilon },
        ...currentNFA.transitions,
      ];

      return {
        start: resultNFA.start,
        accept: [currentNFA.accept[0]],
        transitions: newTransitions,
      };
    }

    return currentNFA;
  }, null as NFA | null);

  // If there's a single NFA left in the stack, return it; otherwise, return the concatenated NFA
  return concatenatedNFA || stack[0];
};

export default regexToNFA;
