const convertToNFA = (regex: string) => {
  // q เป็น array 2 มิติที่ใช้เก็บข้อมูลการเปลี่ยนแปลงของ state ที่เป็น array
  const q: number[][] = [];
  // โครงสร้างข้อมูลของ q จะเป็นแบบนี้
  // [
  //   [
  //     1, // ถ้าเจอ a ให้ไป state 1
  //     2, // ถ้าเจอ b ให้ไป state 2
  //     3, // ถ้าเจอ ε ให้ไป state 3
  //   ],
  //   [

  // ให้ q[0] คือ state 0 ที่เป็น state เริ่มต้น
  // q[0] = [1, 2, 3];
  // หมายถึง q[0] มี ข้อมูลของ state คือ
  // 1 คือ ถ้าเจอ a ให้ไป state 1
  // 2 คือ ถ้าเจอ b ให้ไป state 2
  // 3 คือ ถ้าเจอ ε ให้ไป state 3

  // console.log("q:", q);

  // จำนวน state สูงสุดที่เป็นไปได้ เพื่อให้กำหนดค่าเริ่มต้นให้กับ q
  const MAX_STATES = 20;

  for (let a = 0; a < MAX_STATES; a++) {
    q[a] = [0, 0, 0];
  }

  const len = regex.length;
  let i = 0;
  let s = 0;

   // สำหรับนับ state ที่ใช้ทั้งหมด
   let st = 0;

  const handleSingleCharacter = () => {
    if (regex[i] === "a" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      q[s][0] = s + 1;
      s++;
      st += 1;
    }

    // เมื่อเจอ b โดยที่ไม่มี | และ * ต่อท้าย
    if (regex[i] === "b" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      // ให้ q[s][1] คือ state ที่ s ถ้าเจอ b ให้ไป state s+1
      q[s][1] = s + 1; // 1 คือ b
      // เพิ่ม state ไปอีก 1 เพื่อให้เป็น state ถัดไป
      s++;
      st += 1;
    }

    // เมื่อเจอ a โดยที่มี | และ b ต่อท้าย
    if (regex[i] === "a" && regex[i + 1] === "|" && regex[i + 2] === "b") {
      // สำหรับ transition ที่เป็น ε ให้ไป s ที่ (s + 1) * 10 + (s + 3)
      q[s][2] = (s + 1) * 10 + (s + 3);
      // สมมุติให้ state = 1 และ q[1][2] = 24
      // หมายถึง ถ้าเจอ ε ให้ไป state 2 และ 4 พร้อมกัน
      // จะคำนวนในส่วนที่หาร 10 ลงตัว คือ 2 และ 4 คือ 4 จะได้ว่า
      s++;
      st += 2;
      q[s][0] = s + 1; // s=2 a ให้ไป state 2 + 1 = 3
      s++;
      st += 1;
      q[s][2] = s + 3; // s=3 ε ให้ไป state 3 + 3 = 6
      s++;
      q[s][1] = s + 1; // s=4 b ให้ไป state 4 + 1 = 5
      s++;
      st += 1;
      q[s][2] = s + 1; // s=5 ε ให้ไป state 5 + 1 = 6
      s++;
      st += 1;
      i = i + 2; // เพิ่ม i ไปอีก 2 เพื่อข้าม | และ b
    }

    if (regex[i] === "b" && regex[i + 1] === "|" && regex[i + 2] === "a") {
      q[s][2] = (s + 1) * 10 + (s + 3);
      s++;
      st += 2;
      q[s][1] = s + 1;
      s++;
      st += 1;
      q[s][2] = s + 3;
      s++;
      q[s][0] = s + 1;
      s++;
      st += 1;
      q[s][2] = s + 1;
      s++;
      st += 1;
      i = i + 2;
    }

    // เมื่อเจอ a โดยที่มี * ต่อท้าย
    if (regex[i] === "a" && regex[i + 1] === "*") {
      q[s][2] = (s + 1) * 10 + (s + 3);
      //
      // สมมุติให้ s = 1 และ q[1][2] = 24
      // หมายถึง ถ้าเจอ ε ให้ไป state 2 และ 4 พร้อมกัน
      // จะคำนวนในส่วนที่หาร 10 ลงตัว คือ 2 และ 4 คือ 4 จะได้ว่า
      s++;
      st += 2;
      q[s][0] = s + 1;
      s++;
      st += 1;
      q[s][2] = (s + 1) * 10 + (s - 1);
      s++;
      st += 1;
    }

    if (regex[i] === "b" && regex[i + 1] === "*") {
      q[s][2] = (s + 1) * 10 + (s + 3);
      s++;
      st += 2;
      q[s][1] = s + 1;
      s++;
      st += 1;
      q[s][2] = (s + 1) * 10 + (s - 1);
      s++;
      st += 1;
    }

    i++; // เพิ่ม i ไปอีก 1 เพื่อให้เป็นตัวอักษรถัดไป
  };

  const handleGroup = () => {
    const groupStart = s;
    let groupEnd = 0;
    while (i < len && regex[i] !== ")") {
      if (regex[i] === "(") {
        s++;
      }
      handleSingleCharacter();
    }
    groupEnd = s + 1;
    i++;
    return [groupStart, groupEnd];
  };

  while (i < len) {
    if (regex[i] === "(") {
      const [groupStart, groupEnd] = handleGroup();
      console.log("groupStart:", groupStart);
      console.log("groupEnd:", groupEnd);
      console.log("s:", s);
      if (regex[i] === "*") {
        q[groupStart][2] = groupEnd * 10 + (groupStart + 1);
        q[s][2] = groupEnd * 10 + (groupStart + 1);
        s++;
      }
      if (regex[i] === "|") {
        q[groupStart][2] = (groupEnd + 1) * 10 + (groupStart + st +2);
        q[s][2] = (groupEnd + 1) * 10 + (groupStart + st +2);
        s++;
      }
      else {
        q[groupStart][2] = groupStart + 1;
        q[s][2] = groupEnd;
        s+=2;
      }
    }
    st = 0;
    handleSingleCharacter();
  }

  const newTransitionTable: number[][] = [];
  // โครงสร้างข้อมูลของ newTransitionTable จะเป็นแบบนี้
  // [
  //   [0, 0, 1], // คือ state 0 ถ้าเจอ a ให้ไป state 1
  //   [1, 1, 2], // คือ state 1 ถ้าเจอ b ให้ไป state 2
  //   [2, 2, 3], // คือ state 2 ถ้าเจอ ε ให้ไป state 3
  // ],

  for (let i = 0; i <= s; i++) {
    // ถ้า q[i][0] ไม่เท่ากับ 0 หมายความว่า ถ้าเจอ a ให้ไป state q[i][0]
    if (q[i][0] !== 0) newTransitionTable.push([i, 0, q[i][0]]);
    /*
        i: เป็นสถานะปัจจุบันของ NFA ที่กำลังพิจารณา
        0: หมายถึงการรับอักขระ "a" เพื่อทำการเปลี่ยนสถานะ
        q[i][0]: เป็นสถานะที่ NFA จะเปลี่ยนไปหลังจากที่รับอักขระ "a"
      */
    if (q[i][1] !== 0) newTransitionTable.push([i, 1, q[i][1]]);
    if (q[i][2] !== 0) {
      // ถ้า q[i][2] น้อยกว่า 10 หมายความว่า ε มี transition ไป state เดียว
      if (q[i][2] < 10) newTransitionTable.push([i, 2, q[i][2]]);
      else
        newTransitionTable.push([
          i,
          2,
          // ถ้า q[i][2] = 24
          Math.floor(q[i][2] / 10), // จะได้ 2
          q[i][2] % 10, // จะได้ 4
        ]);
    }
  }

  console.log("q:", q);

  // console.log("Transition Table:", newTransitionTable);
  // setTransitionTable(newTransitionTable);
  return newTransitionTable;
};

export default convertToNFA;
