"use client";

import React, { useState } from "react";
import regexToNFA, { NFA } from "../utils/regexToNFA";
import Graph from "react-graph-vis";

const RegexToNFA: React.FC = () => {
  const [regex, setRegex] = useState("");
  const [nfa, setNFA] = useState<NFA | null>(null);

  const handleConvert = () => {
    try {
      const nfaResult = regexToNFA(regex);
      setNFA(nfaResult);
      console.log("NFA:", nfaResult);
    } catch (error) {
      console.error("Error converting regex to NFA:", error);
      setNFA(null);
    }
  };

  // ... (previous code)

  const getGraphData = (): any => {
    if (!nfa) return { nodes: [], edges: [] };

    const uniqueNodes: {
      [id: string]: { id: string; label: string; color?: string };
    } = {};

    // Add a unique node for the start state
    const startNodeId = "start";
    uniqueNodes[startNodeId] = { id: startNodeId, label: "" };

    const edges = nfa.transitions.map((transition, index) => {
      uniqueNodes[transition.from] = {
        id: transition.from,
        label: transition.from,
      };
      uniqueNodes[transition.to] = { id: transition.to, label: transition.to };

      return {
        id: index.toString(),
        from: uniqueNodes[transition.from].id,
        to: uniqueNodes[transition.to].id,
        label: transition.symbol === "ε" ? "ε" : transition.symbol,
      };
    });

    // Add an edge from the start node to the actual start state
    edges.push({
      id: "start-edge",
      from: startNodeId,
      to: nfa.start,
      label: "start",
    });

    // Apply different styles or labels to accept states
    nfa.accept.forEach((acceptState) => {
      if (uniqueNodes[acceptState]) {
        uniqueNodes[acceptState].label = "Accept";
        uniqueNodes[acceptState].color = "green"; // Change the color to green, for example
      }
    });

    return { nodes: Object.values(uniqueNodes), edges };
  };

  // ... (remaining code)

  const graphData = getGraphData();

  const options = {
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
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-200 rounded shadow-md">
      <input
        type="text"
        placeholder="Enter Regular Expression"
        className="w-full p-2 mb-4 border rounded"
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
      />
      <button
        onClick={handleConvert}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Convert to NFA
      </button>
      <div className="mt-4">
        <p className="font-bold">Resulting NFA:</p>
        {nfa && (
          <Graph
            graph={graphData}
            options={options}
            style={{ height: "300px" }}
          />
        )}
      </div>
    </div>
  );
};

export default RegexToNFA;
