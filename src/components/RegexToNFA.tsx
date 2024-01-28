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
  //   // q เป็น array 2 มิติที่ใช้เก็บข้อมูลการเปลี่ยนแปลงของ state ที่เป็น array
  //   const q: number[][] = [];
  //   // โครงสร้างข้อมูลของ q จะเป็นแบบนี้
  //   // [
  //   //   [
  //   //     1, // ถ้าเจอ a ให้ไป state 1
  //   //     2, // ถ้าเจอ b ให้ไป state 2
  //   //     3, // ถ้าเจอ ε ให้ไป state 3
  //   //   ],
  //   //   [

  //   // ให้ q[0] คือ state 0 ที่เป็น state เริ่มต้น
  //   // q[0] = [1, 2, 3];
  //   // หมายถึง q[0] มี ข้อมูลของ state คือ
  //   // 1 คือ ถ้าเจอ a ให้ไป state 1
  //   // 2 คือ ถ้าเจอ b ให้ไป state 2
  //   // 3 คือ ถ้าเจอ ε ให้ไป state 3

  //   // console.log("q:", q);

  //   // จำนวน state สูงสุดที่เป็นไปได้ เพื่อให้กำหนดค่าเริ่มต้นให้กับ q
  //   const MAX_STATES = 20;

  //   for (let a = 0; a < MAX_STATES; a++) {
  //     q[a] = [0, 0, 0];
  //   }

  //   const len = regex.length;
  //   let i = 0;
  //   let s = 0;

  //   const handleGroup = () => {
  //     const groupStart = s;
  //     let groupEnd = 0;
  //     while (i < len && regex[i] !== ")") {
  //       if (regex[i] === "(") {
  //         s++;
  //       }
  //       if (regex[i] === "a" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
  //         q[s][0] = s + 1;
  //         s++;
  //       }
  //       if (regex[i] === "b" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
  //         q[s][1] = s + 1;
  //         s++;
  //       }
  //       if (regex[i] === "a" && regex[i + 1] === "|" && regex[i + 2] === "b") {
  //         q[s][2] = (s + 1) * 10 + (s + 3);
  //         s++;
  //         q[s][0] = s + 1;
  //         s++;
  //         q[s][2] = s + 3;
  //         s++;
  //         q[s][1] = s + 1;
  //         s++;
  //         q[s][2] = s + 1;
  //         s++;
  //         i = i + 2;
  //       }
  //       if (regex[i] === "b" && regex[i + 1] === "|" && regex[i + 2] === "a") {
  //         q[s][2] = (s + 1) * 10 + (s + 3);
  //         s++;
  //         q[s][1] = s + 1;
  //         s++;
  //         q[s][2] = s + 3;
  //         s++;
  //         q[s][0] = s + 1;
  //         s++;
  //         q[s][2] = s + 1;
  //         s++;
  //         i = i + 2;
  //       }
  //       if (regex[i] === "a" && regex[i + 1] === "*") {
  //         q[s][2] = (s + 1) * 10 + (s + 3);
  //         s++;
  //         q[s][0] = s + 1;
  //         s++;
  //         q[s][2] = (s + 1) * 10 + (s - 1);
  //         s++;
  //       }
  //       if (regex[i] === "b" && regex[i + 1] === "*") {
  //         q[s][2] = (s + 1) * 10 + (s + 3);
  //         s++;
  //         q[s][1] = s + 1;
  //         s++;
  //         q[s][2] = (s + 1) * 10 + (s - 1);
  //         s++;
  //       }
  //       i++;
  //     }
  //     groupEnd = s + 1;
  //     i++;
  //     return [groupStart, groupEnd];
  //   };

  //   while (i < len) {
  //     if (regex[i] === "(") {
  //       const [groupStart, groupEnd] = handleGroup();
  //       if (regex[i] === "*") {
  //         q[groupStart][2] = groupEnd * 10 + (groupStart + 1);
  //         q[s][2] = groupEnd;
  //         s++;
  //       }
  //     }

  //     if (regex[i] === "a" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
  //       q[s][0] = s + 1;
  //       s++;
  //     }

  //     // เมื่อเจอ b โดยที่ไม่มี | และ * ต่อท้าย
  //     if (regex[i] === "b" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
  //       // ให้ q[s][1] คือ state ที่ s ถ้าเจอ b ให้ไป state s+1
  //       q[s][1] = s + 1; // 1 คือ b
  //       // เพิ่ม state ไปอีก 1 เพื่อให้เป็น state ถัดไป
  //       s++;
  //     }

  //     // เมื่อเจอ a โดยที่มี | และ b ต่อท้าย
  //     if (regex[i] === "a" && regex[i + 1] === "|" && regex[i + 2] === "b") {
  //       // สำหรับ transition ที่เป็น ε ให้ไป s ที่ (s + 1) * 10 + (s + 3)
  //       q[s][2] = (s + 1) * 10 + (s + 3);
  //       // สมมุติให้ state = 1 และ q[1][2] = 24
  //       // หมายถึง ถ้าเจอ ε ให้ไป state 2 และ 4 พร้อมกัน
  //       // จะคำนวนในส่วนที่หาร 10 ลงตัว คือ 2 และ 4 คือ 4 จะได้ว่า
  //       s++;
  //       q[s][0] = s + 1; // s=2 a ให้ไป state 2 + 1 = 3
  //       s++;
  //       q[s][2] = s + 3; // s=3 ε ให้ไป state 3 + 3 = 6
  //       s++;
  //       q[s][1] = s + 1; // s=4 b ให้ไป state 4 + 1 = 5
  //       s++;
  //       q[s][2] = s + 1; // s=5 ε ให้ไป state 5 + 1 = 6
  //       s++;
  //       i = i + 2; // เพิ่ม i ไปอีก 2 เพื่อข้าม | และ b
  //     }

  //     if (regex[i] === "b" && regex[i + 1] === "|" && regex[i + 2] === "a") {
  //       q[s][2] = (s + 1) * 10 + (s + 3);
  //       s++;
  //       q[s][1] = s + 1;
  //       s++;
  //       q[s][2] = s + 3;
  //       s++;
  //       q[s][0] = s + 1;
  //       s++;
  //       q[s][2] = s + 1;
  //       s++;
  //       i = i + 2;
  //     }

  //     // เมื่อเจอ a โดยที่มี * ต่อท้าย
  //     if (regex[i] === "a" && regex[i + 1] === "*") {
  //       q[s][2] = (s + 1) * 10 + (s + 3);
  //       //
  //       // สมมุติให้ s = 1 และ q[1][2] = 24
  //       // หมายถึง ถ้าเจอ ε ให้ไป state 2 และ 4 พร้อมกัน
  //       // จะคำนวนในส่วนที่หาร 10 ลงตัว คือ 2 และ 4 คือ 4 จะได้ว่า
  //       s++;
  //       q[s][0] = s + 1;
  //       s++;
  //       q[s][2] = (s + 1) * 10 + (s - 1);
  //       s++;
  //     }

  //     if (regex[i] === "b" && regex[i + 1] === "*") {
  //       q[s][2] = (s + 1) * 10 + (s + 3);
  //       s++;
  //       q[s][1] = s + 1;
  //       s++;
  //       q[s][2] = (s + 1) * 10 + (s - 1);
  //       s++;
  //     }

  //     i++; // เพิ่ม i ไปอีก 1 เพื่อให้เป็นตัวอักษรถัดไป
  //   }

  //   const newTransitionTable: number[][] = [];
  //   // โครงสร้างข้อมูลของ newTransitionTable จะเป็นแบบนี้
  //   // [
  //   //   [0, 0, 1], // คือ state 0 ถ้าเจอ a ให้ไป state 1
  //   //   [1, 1, 2], // คือ state 1 ถ้าเจอ b ให้ไป state 2
  //   //   [2, 2, 3], // คือ state 2 ถ้าเจอ ε ให้ไป state 3
  //   // ],

  //   for (let i = 0; i <= s; i++) {
  //     // ถ้า q[i][0] ไม่เท่ากับ 0 หมายความว่า ถ้าเจอ a ให้ไป state q[i][0]
  //     if (q[i][0] !== 0) newTransitionTable.push([i, 0, q[i][0]]);
  //     /*
  //       i: เป็นสถานะปัจจุบันของ NFA ที่กำลังพิจารณา
  //       0: หมายถึงการรับอักขระ "a" เพื่อทำการเปลี่ยนสถานะ
  //       q[i][0]: เป็นสถานะที่ NFA จะเปลี่ยนไปหลังจากที่รับอักขระ "a"
  //     */
  //     if (q[i][1] !== 0) newTransitionTable.push([i, 1, q[i][1]]);
  //     if (q[i][2] !== 0) {
  //       // ถ้า q[i][2] น้อยกว่า 10 หมายความว่า ε มี transition ไป state เดียว
  //       if (q[i][2] < 10) newTransitionTable.push([i, 2, q[i][2]]);
  //       else
  //         newTransitionTable.push([
  //           i,
  //           2,
  //           // ถ้า q[i][2] = 24
  //           Math.floor(q[i][2] / 10), // จะได้ 2
  //           q[i][2] % 10, // จะได้ 4
  //         ]);
  //     }
  
  //   }
  //   console.log("q:", q);

  //   // console.log("Transition Table:", newTransitionTable);
  //   setTransitionTable(newTransitionTable);
  // };

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
