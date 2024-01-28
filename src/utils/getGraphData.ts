const getGraphData = (transitionTable: number[][]) => {
  type Node = {
    id: number;
    label: string;
    color?: string;
  };
  type Edge = {
    from: number;
    to: number | string;
    label: string;
  };
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // เพิม่ start state
  const START_STATE = -1; // -1 เพื่อไม่ให้มี state ที่ซ้ำกับ state 0
  nodes.push({ id: START_STATE, label: `start` });
  edges.push({
    from: START_STATE,
    to: transitionTable[0][0],
    label: "start",
  });

  for (let i = 0; i < transitionTable.length; i++) {
    const [from, symbol, to1, to2] = transitionTable[i];
    // เพิ่ม node
    nodes.push({ id: from, label: `q[${from}]` });
    // เพิ่ม edge
    if (symbol === 0) {
      edges.push({ from, to: to1, label: "a" });
    } else if (symbol === 1) {
      edges.push({ from, to: to1, label: "b" });
    } else if (symbol === 2) {
      if (to2) {
        if (!edges.find((edge) => edge.from === from && edge.to === to1)) {
          edges.push({ from, to: to1, label: "ε" });
        }
        if (!edges.find((edge) => edge.from === from && edge.to === to2)) {
          edges.push({ from, to: to2, label: "ε" });
        }
      } else {
        if (!edges.find((edge) => edge.from === from && edge.to === to1)) {
          edges.push({ from, to: to1, label: "ε" });
        }
      }
    }
  }

  // เพิ่ม final state
  const lastState = transitionTable.length;
  nodes.push({ id: lastState, label: `q[${lastState}]`, color: "green" });

  return {
    nodes,
    edges,
  };
};

export default getGraphData;