"use client";

import React, { useState, useEffect } from "react";
import Graph from "react-graph-vis";
import convertToNFA from "@/utils/convertToNFA";
import getGraphData from "@/utils/getGraphData";

const RegexToNFA: React.FC = () => {
  const [regex, setRegex] = useState<string>("");
  const [transitionTable, setTransitionTable] = useState<number[][]>([]);
  const [graphData, setGraphData] = useState<any | null>(null);

  useEffect(() => {
    if (transitionTable.length > 0) {
      const newGraphData = getGraphData(transitionTable);
      // console.log("Graph Data:", newGraphData); // Check if data is correct
      setGraphData(newGraphData);
    }
  }, [transitionTable]);

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

  const submitHandler = () => {
    const newTransitionTable = convertToNFA(regex);
    setTransitionTable(newTransitionTable);
  }

  return (
    <div className="container mx-auto my-8 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        Regex to NFA Converter
      </h1>
      <p className="text-center text-gray-500 mb-6">
        By | 6410401183 | 6410402121 | 6410406568 | 6410406878
        <br></br>
        <a
          className="text-blue-500 hover:underline"
          href="https://www.canva.com/design/DAF7J1P6RiY/PNPS_4BKP_pWRMHSiRq3Zg/edit?utm_content=DAF7J1P6RiY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
          target="_blank"
        >
          Slide Presentation
        </a>
      </p>

      <label className="block mb-6">
        <span className="block text-xl mb-2">Enter Regular Expression:</span>
        <span className="block text-sm mb-2 text-gray-500">
          accept only a, b, (, ), |, *
        </span>
      </label>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          className="border p-3 w-full md:w-full md:mr-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          type="text"
          value={regex}
          placeholder="(a|b)*abb"
          onChange={(ε) => setRegex(ε.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-6  rounded-md hover:bg-blue-700 transition duration-300 w-full md:w-auto"
          onClick={submitHandler}
        >
          Convert to NFA
        </button>
      </div>

      {/* if have transition table */}
      {transitionTable.length > 0 && (
        <>
          <div className="mt-6 overflow-x-auto">
            {/* Q = set of states, E = set of input symbols, q0 = start state, F = set of final states */}
            <h2 className="text-2xl font-bold mb-4">NFA description</h2>
            <p className="text-gray-500 mb-2">
              Q ={" "}
              {transitionTable.map((row) => "q" + row[0]).join(", ") +
                ", q" +
                transitionTable.length}
            </p>

            <p className="text-gray-500 mb-2">E = {["a", "b"].join(", ")}</p>

            <p className="text-gray-500 mb-2">S = q[0]</p>

            <p className="text-gray-500 mb-2">
              F = q[{transitionTable.length}]
            </p>

            <h2 className="text-2xl font-bold mb-4">Transition Table</h2>
            <table className="w-full border-collapse border border-gray-500">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3">Current State</th>
                  <th className="p-3">Input</th>
                  <th className="p-3">Next State</th>
                </tr>
              </thead>
              <tbody>
                {transitionTable.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="p-3">{`q[${row[0]}]`}</td>
                    <td className="p-3">{["a", "b", "ε"][row[1]]}</td>
                    <td className="p-3">
                      {row.length === 3
                        ? `q[${row[2]}]`
                        : `q[${row[2]}], q[${row[3]}]`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            {graphData && (
              <div className="mt-8 h-96">
                <h2 className="text-2xl font-bold mb-4">NFA Graph</h2>
                <Graph graph={graphData} options={graphOptions} />
              </div>
            )}
          </div>
        </>
      )}

      {/* if no transition table */}
      {transitionTable.length === 0 && (
        <div className="mt-6">
          <p className="text-center text-gray-500 mb-2">please enter regex</p>
        </div>
      )}
    </div>
  );
};

export default RegexToNFA;
