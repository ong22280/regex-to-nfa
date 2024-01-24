"use client";

import React, { useState, useEffect } from "react";
import Graph from "react-graph-vis";

const RegexToNFA: React.FC = () => {
  const [regex, setRegex] = useState<string>("");
  const [transitionTable, setTransitionTable] = useState<number[][]>([]);
  const [graphData, setGraphData] = useState<any | null>(null);

  useEffect(() => {
    if (transitionTable.length > 0) {
      const newGraphData = getGraphData();
      console.log(newGraphData); // Check if data is correct
      setGraphData(newGraphData);
    }
  }, [transitionTable]);

  const convertToNFA = () => {
    const q: number[][] = [];
    const MAX_STATES = 20;

    for (let a = 0; a < MAX_STATES; a++) {
      q[a] = [0, 0, 0];
    }

    const len = regex.length;
    let i = 0;
    let j = 1;

    while (i < len) {
      if (regex[i] === "a" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
        q[j][0] = j + 1;
        j++;
      }

      if (regex[i] === "b" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
        q[j][1] = j + 1;
        j++;
      }

      if (regex[i] === "e" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
        q[j][2] = j + 1;
        j++;
      }

      if (regex[i] === "a" && regex[i + 1] === "|" && regex[i + 2] === "b") {
        q[j][2] = (j + 1) * 10 + (j + 3);
        j++;
        q[j][0] = j + 1;
        j++;
        q[j][2] = j + 3;
        j++;
        q[j][1] = j + 1;
        j++;
        q[j][2] = j + 1;
        j++;
        i = i + 2;
      }

      if (regex[i] === "b" && regex[i + 1] === "|" && regex[i + 2] === "a") {
        q[j][2] = (j + 1) * 10 + (j + 3);
        j++;
        q[j][1] = j + 1;
        j++;
        q[j][2] = j + 3;
        j++;
        q[j][0] = j + 1;
        j++;
        q[j][2] = j + 1;
        j++;
        i = i + 2;
      }

      if (regex[i] === "a" && regex[i + 1] === "*") {
        q[j][2] = (j + 1) * 10 + (j + 3);
        j++;
        q[j][0] = j + 1;
        j++;
        q[j][2] = (j + 1) * 10 + (j - 1);
        j++;
      }

      if (regex[i] === "b" && regex[i + 1] === "*") {
        q[j][2] = (j + 1) * 10 + (j + 3);
        j++;
        q[j][1] = j + 1;
        j++;
        q[j][2] = (j + 1) * 10 + (j - 1);
        j++;
      }

      if (regex[i] === ")" && regex[i + 1] === "*") {
        q[0][2] = (j + 1) * 10 + 1;
        q[j][2] = (j + 1) * 10 + 1;
        j++;
      }

      i++;
    }

    const newTransitionTable: number[][] = [];

    for (let i = 0; i <= j; i++) {
      if (q[i][0] !== 0) newTransitionTable.push([i, 0, q[i][0]]);
      if (q[i][1] !== 0) newTransitionTable.push([i, 1, q[i][1]]);
      if (q[i][2] !== 0) {
        if (q[i][2] < 10) newTransitionTable.push([i, 2, q[i][2]]);
        else
          newTransitionTable.push([
            i,
            2,
            Math.floor(q[i][2] / 10),
            q[i][2] % 10,
          ]);
      }
    }

    setTransitionTable(newTransitionTable);
  };

  const getGraphData = (): any => {
    const nodes: any[] = [];
    const edges: any[] = [];

    const addNode = (id: number, label: string, color?: string) => {
      if (nodes.findIndex((node) => node.id === id) === -1) {
        nodes.push({ id, label, color });
      }
    };

    const addEdge = (from: number, to: number | string, label: string) => {
      edges.push({ from, to, label });
    };

    // Add a special start state
    const startState = 0;
    addNode(startState, `start`);

    // Add edges from the new start state to the first state of transitionTable
    const firstState =
      transitionTable.length > 0 ? transitionTable[0][0] : null;
    if (firstState !== null) {
      addEdge(startState, firstState, "start");
    }

    for (let i = 0; i < transitionTable.length; i++) {
      const [from, input, to1, to2] = transitionTable[i];

      addNode(from, `q[${from}]`);

      if (input === 0) {
        addEdge(from, to1, "a");
      } else if (input === 1) {
        addEdge(from, to1, "b");
      } else if (input === 2) {
        if (to2) {
          addEdge(from, to1, "e");
          addEdge(from, to2, "e");
        } else {
          addEdge(from, to1, "e");
        }
      }
    }

    // Add a final transition to a special accept state
    const lastState = transitionTable.length + 1;
    addNode(lastState, `q[${lastState}]`, "green"); // Set the color for the accept state

    console.log(nodes, edges);

    return {
      nodes,
      edges,
    };
  };

  const graphOptions = {
    layout: {
      hierarchical: false,
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 1, type: "arrow" },
      },
    },
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-gray-200 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Regex to NFA Converter</h1>
      <label className="block mb-4">
        Enter Regular Expression:
        <input
          className="border p-2 w-full"
          type="text"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
        />
      </label>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={convertToNFA}
      >
        Convert to NFA
      </button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Transition Table</h2>
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="p-2 border border-gray-500">Current State</th>
              <th className="p-2 border border-gray-500">Input</th>
              <th className="p-2 border border-gray-500">Next State</th>
            </tr>
          </thead>
          <tbody>
            {transitionTable.map((row, index) => (
              <tr key={index}>
                <td className="p-2 border border-gray-500">{`q[${row[0]}]`}</td>
                <td className="p-2 border border-gray-500">
                  {["a", "b", "e"][row[1]]}
                </td>
                {row.length === 3 ? (
                  <td className="p-2 border border-gray-500">{`q[${row[2]}]`}</td>
                ) : (
                  <td className="p-2 border border-gray-500">{`q[${row[2]}], q[${row[3]}]`}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        {graphData && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">NFA Graph</h2>
            <Graph graph={graphData} options={graphOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RegexToNFA;
