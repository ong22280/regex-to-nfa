## แปลง Regular Expression เป็น NFA

เข้าชมเว็บไซต์: [https://regex-to-dmzc1p63a-ong22280.vercel.app/](https://regex-to-dmzc1p63a-ong22280.vercel.app/)

## สมาชิกในกลุ่ม

| รหัสนักศึกษา | ชื่อ-นามสกุล |
| --- | --- |
| 6410401183 | นาย สิทธิพงค์ เหมล้วน |
| 6410402121 | นาย ภูริต เทพกฤษณ์ |
| 6410406568 | นาย ณัชพล เรืองนาม |
| 6410406878 | นาย ศรันย์ภวัต โพธิ์สร้อย |

<hr>

## วิธีการทำ

1. การกำหนดข้อมูลเริ่มต้น (Initialization):
   - `const q: number[][] = [];`: สร้าง array q เพื่อเก็บข้อมูลของ state ของ NFA
2. การอ่าน Regular Expression:
   - ใช้ลูป `while` เพื่ออ่าน Regular Expression ทีละตัวอักษร
3. กำหนด Transition สำหรับแต่ละตัวอักษร:
   - ใช้เงื่อนไขต่าง ๆ เพื่อกำหนด transition สำหรับ `a, b, e, a|b, b|a, a*, b*, )*` ใน NFA
4. สร้าง Transition Table:
   - จัดเก็บข้อมูล transition table ใน `newTransitionTable` โดยใช้ข้อมูลจาก array q

การใช้เลข 10 เป็นตัวคั่นในการแทน a|b และการใช้เลข 10 เป็นตัวหารในการแยก states ใน a* และ b*

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

  while (i < len) {
    // กำหนด transition สำหรับ a
    if (regex[i] === "a" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      q[j][0] = j + 1;
      j++;
    }

    // กำหนด transition สำหรับ b
    if (regex[i] === "b" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      q[j][1] = j + 1;
      j++;
    }

    // กำหนด transition สำหรับ e (epsilon)
    if (regex[i] === "e" && regex[i + 1] !== "|" && regex[i + 1] !== "*") {
      q[j][2] = j + 1;
      j++;
    }

    // กำหนด transition สำหรับ a|b
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

    // กำหนด transition สำหรับ b|a
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

    // กำหนด transition สำหรับ a*
    if (regex[i] === "a" && regex[i + 1] === "*") {
      q[j][2] = (j + 1) * 10 + (j + 3);
      j++;
      q[j][0] = j + 1;
      j++;
      q[j][2] = (j + 1) * 10 + (j - 1);
      j++;
    }

    // กำหนด transition สำหรับ b*
    if (regex[i] === "b" && regex[i + 1] === "*") {
      q[j][2] = (j + 1) * 10 + (j + 3);
      j++;
      q[j][1] = j + 1;
      j++;
      q[j][2] = (j + 1) * 10 + (j - 1);
      j++;
    }

    // กำหนด transition สำหรับ )*
    if (regex[i] === ")" && regex[i + 1] === "*") {
      q[0][2] = (j + 1) * 10 + 1;
      q[j][2] = (j + 1) * 10 + 1;
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
      else
        newTransitionTable.push([i, 2, Math.floor(q[i][2] / 10), q[i][2] % 10]);
    }
  }

  // อัพเดท transition table ใน state
  setTransitionTable(newTransitionTable);
};
```
