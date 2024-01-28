## แปลง Regular Expression เป็น NFA

เข้าชมเว็บไซต์: [https://regex-to-nfa.vercel.app/](https://regex-to-nfa.vercel.app/)

สไลด์: [https://www.canva.com/design/DAF7J1P6RiY/PNPS_4BKP_pWRMHSiRq3Zg/edit?utm_content=DAF7J1P6RiY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton](https://www.canva.com/design/DAF7J1P6RiY/PNPS_4BKP_pWRMHSiRq3Zg/edit?utm_content=DAF7J1P6RiY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## สมาชิกในกลุ่ม

| รหัสนักศึกษา | ชื่อ-นามสกุล              |
| ------------ | ------------------------- |
| 6410401183   | นาย สิทธิพงค์ เหมล้วน     |
| 6410402121   | นาย ภูริต เทพกฤษณ์        |
| 6410406568   | นาย ณัชพล เรืองนาม        |
| 6410406878   | นาย ศรันย์ภวัต โพธิ์สร้อย |

<hr>

## วิธีการทำ

1. กำหนดตัวแปรและค่าเริ่มต้น:
   - `q`: เป็น array ที่ใช้เก็บข้อมูลของ state ของ NFA โดยแต่ละ state จะมี transition สำหรับ `a`, `b`, และ `ε` (epsilon)
   - `i` และ `j`: เป็นตัวแปรที่ใช้ในการวน loop ที่อ่าน Regular Expression
2. วน Loop อ่าน Regular Expression:
   - ในแต่ละรอบของ loop, โค้ดจะตรวจสอบ Regular Expression ทีละตัวอักษรและทำการกำหนด transition ตามเงื่อนไขที่กำหนด
3. กำหนด Transition และ State:
   - การกำหนด transition ใน `q` จะเกิดตามลำดับที่กำหนดใน Regular Expression และ state จะเพิ่มตามลำดับที่เข้าไปใน transition
4. สร้าง Transition Table:
   - จากข้อมูลใน `q`, จะถูกใช้ในการสร้าง transition table `newTransitionTable` ซึ่งเก็บข้อมูลเป็นรูปแบบ `[from, input, to1, to2]`
   - การเขียนค่าในรูปแบบ `x * 10 + y` ใน `q` ใช้เพื่อแยกค่า `x` และ `y` เพื่อให้รู้ถึงการใช้ epsilon transitions

```js
const convertToNFA = () => {
  // สร้างเก็บข้อมูลของ state ของ NFA
  const q: number[][] = [];
  const MAX_STATES = 20;

  // กำหนดค่าเริ่มต้นของ state
  for (let a = 0; a < MAX_STATES; a++) {
    q[a] = [0, 0, 0];
  }

  // อ่าน Regular Expression ทีละตัวอักษร
  const len = regex.length;
  let i = 0;
  let j = 1;

      const handleGroup = () => {
      const groupStart = s;
      let groupEnd = 0;
      while (i < len && regex[i] !== ")") {
        // กำหนด transition เหมือนด้านล่าง
      }
      groupEnd = s + 1;
      i++;
      return [groupStart, groupEnd];
    };

  while (i < len) {
    // กำหนด transition สำหรับ ()
    if (regex[i] === "(") {
      const [groupStart, groupEnd] = handleGroup();
      if (regex[i] === "*") {
        q[groupStart][2] = groupEnd * 10 + (groupStart + 1);
        q[s][2] = groupEnd;
        s++;
      }
    }

    // กำหนด transition สำหรับ a
    if (regex[i] === "a" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      q[j][0] = j + 1; // ไปยัง state ถัดไป
      j++;
    }

    // กำหนด transition สำหรับ b
    if (regex[i] === "b" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      q[j][1] = j + 1; // ไปยัง state ถัดไป
      j++;
    }

    // กำหนด transition สำหรับ ε (epsilon)
    if (regex[i] === "ε" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      q[j][2] = j + 1; // ไปยัง state ถัดไป
      j++;
    }

    // กำหนด transition สำหรับ a|b
    if (regex[i] === "a" && regex[i + 1] === "|" && regex[i + 2] === "b") {
      q[j][2] = (j + 1) * 10 + (j + 3); // ไปยัง state ถัดไปหลัง | (บวก 10 เพื่อแยก)
      j++;
      q[j][0] = j + 1; // ไปยัง state ถัดไป
      j++;
      q[j][2] = j + 3; // ไปยัง state หลัง b
      j++;
      q[j][1] = j + 1; // ไปยัง state ถัดไปหลัง a
      j++;
      q[j][2] = j + 1; // ไปยัง state ถัดไป
      j++;
      i = i + 2; // ข้าม a|b
    }

    // กำหนด transition สำหรับ b|a
    if (regex[i] === "b" && regex[i + 1] === "|" && regex[i + 2] === "a") {
      q[j][2] = (j + 1) * 10 + (j + 3); // ไปยัง state ถัดไปหลัง | (บวก 10 เพื่อแยก)
      j++;
      q[j][1] = j + 1; // ไปยัง state ถัดไป
      j++;
      q[j][2] = j + 3; // ไปยัง state หลัง a
      j++;
      q[j][0] = j + 1; // ไปยัง state ถัดไปหลัง b
      j++;
      q[j][2] = j + 1; // ไปยัง state ถัดไป
      j++;
      i = i + 2; // ข้าม b|a
    }

    // กำหนด transition สำหรับ a*
    if (regex[i] === "a" && regex[i + 1] === "*") {
      q[j][2] = (j + 1) * 10 + (j + 3); // ไปยัง state ถัดไปหลัง * (บวก 10 เพื่อแยก)
      j++;
      q[j][0] = j + 1; // ไปยัง state ถัดไป
      j++;
      q[j][2] = (j + 1) * 10 + (j - 1); // กลับไปยัง state ก่อนหน้า * (บวก 10 เพื่อแยก)
      j++;
    }

    // กำหนด transition สำหรับ b*
    if (regex[i] === "b" && regex[i + 1] === "*") {
      q[j][2] = (j + 1) * 10 + (j + 3); // ไปยัง state ถัดไปหลัง * (บวก 10 เพื่อแยก)
      j++;
      q[j][1] = j + 1; // ไปยัง state ถัดไป
      j++;
      q[j][2] = (j + 1) * 10 + (j - 1); // กลับไปยัง state ก่อนหน้า * (บวก 10 เพื่อแยก)
      j++;
    }

    i++;
  }

  // สร้าง transition table จากข้อมูลที่ได้
  const newTransitionTable: number[][] = [];

  for (let i = 0; i <= j; i++) {
    if (q[i][0] !== 0) newTransitionTable.push([i, 0, q[i][0]]);
    if (q[i][1] !== 0) newTransitionTable.push([i, 1, q[i][1]]);
    if (q[i][2] !== 0) {
      if (q[i][2] < 10) newTransitionTable.push([i, 2, q[i][2]]);
      else newTransitionTable.push([i, 2, q[i][2] / 10, q[i][2] % 10]);
    }
  }

  // อัพเดท transition table ใน state
  setTransitionTable(newTransitionTable);
};
```
