function updateHexLabel() {
    // Get the input value
    var inputValue = document.getElementById('plaintextInput').value;

    // Update the hex label
    document.getElementById('hexLabel').innerText = "Hex Value: " + asciiToHex(inputValue);
  }

  function convertPlaintextToHex() {
    // Get the plaintext input value
    var plaintextInput = document.getElementById('plaintextInput').value;

    // Convert plaintext to hex
    var hexValue = asciiToHex(plaintextInput);

    // Display the result
    document.getElementById('result').innerText = "Hex Value: " + hexValue;
  }

  function asciiToHex(asciiString) {
    var hexValue = '';

    for (var i = 0; i < asciiString.length; i++) {
        var hexChar = asciiString.charCodeAt(i).toString(16).toUpperCase();
        hexValue += hexChar.length === 1 ? '0' + hexChar : hexChar;
    }

    return hexValue;
  }










  let useBlockTranspose = document.getElementById("transpose").checked;
  let updateAEStimer = null;
  let lastBlockAfterEachRound = [];
  function getCaretPosition(ctrl) {
    if (ctrl.type != "text") return;
    var CaretPos = 0; // IE Support
    if (document.selection) {
      ctrl.focus();
      var Sel = document.selection.createRange();
      Sel.moveStart("character", -ctrl.value.length);
      CaretPos = Sel.text.length;
    } else if (ctrl.selectionStart || ctrl.selectionStart == "0") {
      CaretPos = ctrl.selectionStart; // Firefox support
    }
    return CaretPos;
  }

  function setCaretPosition(ctrl, pos) {
    if (ctrl.type != "text") return;
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    } else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  }

  computeAES();

  function computeAES() {
    const msgDOM = document.getElementById("msg");
    const keyDOM = document.getElementById("key");
    useBlockTranspose = document.getElementById("transpose").checked;

    let caretPos = getCaretPosition(document.activeElement);

    msgDOM.value = (
      msgDOM.value.toUpperCase().replace(/[^0-9A-F]/, "") +
      "00000000000000000000000000000000"
    ).substring(0, 32); // 64 bits long
    keyDOM.value = (
      keyDOM.value.toUpperCase().replace(/[^0-9A-F]/, "") +
      "00000000000000000000000000000000"
    ).substring(0, 32); // 64 bits long

    setCaretPosition(document.activeElement, caretPos);

    clearTimeout(updateAEStimer);
    updateAEStimer = setTimeout(function () {
      const msg = msgDOM.value;
      const key = keyDOM.value;
      let encryption = encrypt(msg, key, 2000000);
      const output = document.getElementById("output");
      output.innerHTML = encryption;
    }, 500);
  }

  // Add spaces to a sequence of numbers
  function formatBinary(str) {
    switch (str.length) {
      case 16:
      case 32:
      case 64:
        return str.match(/.{4}/g).join(" ");
        break;
      case 28:
      case 56:
        return str.match(/.{7}/g).join(" ");
        break;
      case 48:
        return str.match(/.{6}/g).join(" ");
        break;
    }
    return str;
  }

  function encrypt(msg, keyStr, numSteps) {
    const Sbox = [
      99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
      202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114,
      192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49,
      21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9,
      131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209,
      0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170,
      251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143,
      146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236,
      95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34,
      42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6,
      36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213,
      78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166,
      180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3,
      246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217,
      142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230,
      66, 104, 65, 153, 45, 15, 176, 84, 187, 22,
    ];
    const shiftRowTab = [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11];

    let blockAfterEachRound = [];

    const byteToString = (byte, base = 16) => {
      if (base == 2) {
        return ("00000000" + byte.toString(2)).slice(-8);
      } else if (base == 16) {
        return ("00" + byte.toString(16)).slice(-2).toUpperCase();
      } else {
        return byte.toString(base).toUpperCase();
      }
    };

    const subBytes = (block, sbox, count) => {
      /* Step */
      if (step++ == numSteps) return html;
      html +=
        '<br><h3><span class="step">Step ' +
        step +
        ", Round " +
        count +
        ":</span> Substitute bytes</h3>";

      html +=
        "Each cell is plugged into the following S-box (first=row, second=column):<br><br>";
      html += '<table border="1" cellpadding="5" style="background-color: #FFF">';
      html += "<tr><td></td>";
      for (let i = 0; i < 16; i++) {
        html +=
          '<td style="background-color: #FEE6EA">X<b>' +
          i.toString(16).toUpperCase() +
          "</b></td>";
      }
      html += "</tr>";
      for (let i = 0; i < 16; i++) {
        html +=
          '<tr><td style="background-color: #FEE6EA"><b>' +
          i.toString(16).toUpperCase() +
          "</b>X</td>";
        for (let j = 0; j < 16; j++) {
          html += "<td>" + byteToString(sbox[i * 16 + j]) + "</td>";
        }
        html += "</tr>";
      }
      html += "</table>";

      for (let i = 0; i < 16; i++) block[i] = sbox[block[i]];

      html +=
        "Note that this is equivalent to making the S-box a one-dimensional list, converting the cell into base-10 and making it an index into the S-box list.<br>";
      html += "<br>The resulting state of the block is as follows:<br><br>";
      printBlock(block, useBlockTranspose);
    };

    const addRoundKey = (block, rkey, w, count) => {
      /* Step */
      if (step++ == numSteps) return html;
      html +=
        '<br><h3><span class="step">Step ' +
        step +
        ", Round " +
        count +
        ":</span> Add round key</h3>";

      html +=
        "The round key is added by XORing the block with the expanded keys, " +
        `w${w}, w${w + 1}, w${w + 2}, and w${w + 3}` +
        ", as displayed in the following table:<br><br>";

      html += '<table border="1" cellpadding="5" style="background-color: #FFF">';
      html +=
        '<tr><th style="background-color: #FEE6EA">Previous block</th><td>' +
        block.map((x) => byteToString(x)).join("</td><td>") +
        "</td></tr>";
      html +=
        '<tr><th rowspan="2" style="background-color: #FEE6EA">Round key</th><td colspan="4">w' +
        w +
        '</td><td colspan="4">w' +
        (w + 1) +
        '</td><td colspan="4">w' +
        (w + 2) +
        '</td><td colspan="4">w' +
        (w + 3) +
        "</td></tr>";
      html +=
        "<tr><td>" +
        rkey.map((x) => byteToString(x)).join("</td><td>") +
        "</td></tr>";

      for (let i = 0; i < 16; i++) {
        block[i] ^= rkey[i];
      }

      html +=
        '<tr><th style="background-color: #FEE6EA">Result (⊕)</th><td>' +
        block.map((x) => byteToString(x)).join("</td><td>") +
        "</td></tr>";
      html += "</table><br>Block state:<br><br>";
      printBlock(block, useBlockTranspose);
    };

    const shiftRows = (block, shiftTab, count) => {
      /* Step */
      if (step++ == numSteps) return html;
      html +=
        '<br><h3><span class="step">Step ' +
        step +
        ", Round " +
        count +
        ":</span> Shift rows</h3>";

      let h = new Array().concat(block);
      for (let i = 0; i < 16; i++) {
        block[i] = h[shiftTab[i]];
      }
      html +=
        "In this step, the rows are cyclically shifted by an offset. The first row is left unchanged, the second row is shifted one to the left (or three to the right), the third is offset two to the left (or two to the right), and the third is offset three to the left (or one to the right).<br><br>The resulting block state is as follows:<br><br>";
      printBlock(block, useBlockTranspose);
    };

    const mixColumns = (block, count) => {
      /* Step */
      if (step++ == numSteps) return html;
      html +=
        '<br><h3><span class="step">Step ' +
        step +
        ", Round " +
        count +
        ":</span> Mix columns</h3>";

      html +=
        "In this step, each column is combined using an invertible linear transformation. This is done by taking:<br><br>";

      html += '<table border="1" cellpadding="5" style="background-color: #FFF">';
      html += "<tr>";
      html += "<td>02</td><td>03</td><td>01</td><td>01</td>";
      html += "<tr><td>01</td><td>02</td><td>03</td><td>01</td>";
      html += "<tr><td>01</td><td>01</td><td>02</td><td>03</td>";
      html += "<tr><td>03</td><td>01</td><td>01</td><td>02</td>";
      html += "</table>";
      html += "<br>And peforming a matrix multiply on the block:<br><br>";

      printBlock(block, useBlockTranspose);

      html += "<br>";

      for (let i = 0; i < 16; i += 4) {
        // Iterate through first row
        let s0 = block[i + 0]; // Get the elements of the current column
        let s1 = block[i + 1];
        let s2 = block[i + 2];
        let s3 = block[i + 3];
        let xor = s0 ^ s1 ^ s2 ^ s3;
        // Use a lookup table for the Galois Field part
        block[i + 0] ^= xor ^ xtime[s0 ^ s1]; // x*2, x*3, x*1, x*1
        block[i + 1] ^= xor ^ xtime[s1 ^ s2]; // x*1, x*2, x*3, x*1
        block[i + 2] ^= xor ^ xtime[s2 ^ s3]; // x*1, x*1, x*2, x*3
        block[i + 3] ^= xor ^ xtime[s3 ^ s0]; // x*3, x*1, x*1, x*2
        if ((s0 ^ s1) < 128)
          xtimeStr = `(${byteToString(s0)} ⊕ ${byteToString(s1)}) * 2`;
        else
          xtimeStr = `((${byteToString(s0)} ⊕ ${byteToString(
            s1
          )}) * 2 - 256) ⊕ 1B`;
        html += `${byteToString(s0)} ⊕ (${byteToString(s0)} ⊕ ${byteToString(
          s1
        )} ⊕ ${byteToString(s2)} ⊕ ${byteToString(
          s3
        )}) ⊕ (${xtimeStr}) = <b>${byteToString(block[i + 0])}</b><br>`;

        if ((s1 ^ s2) < 128)
          xtimeStr = `(${byteToString(s1)} ⊕ ${byteToString(s2)}) * 2`;
        else
          xtimeStr = `((${byteToString(s1)} ⊕ ${byteToString(
            s2
          )}) * 2 - 256) ⊕ 1B`;
        html += `${byteToString(s1)} ⊕ (${byteToString(s0)} ⊕ ${byteToString(
          s1
        )} ⊕ ${byteToString(s2)} ⊕ ${byteToString(
          s3
        )}) ⊕ (${xtimeStr}) = <b>${byteToString(block[i + 1])}</b><br>`;

        if ((s2 ^ s3) < 128)
          xtimeStr = `(${byteToString(s2)} ⊕ ${byteToString(s3)}) * 2`;
        else
          xtimeStr = `((${byteToString(s2)} ⊕ ${byteToString(
            s3
          )}) * 2 - 256) ⊕ 1B`;
        html += `${byteToString(s2)} ⊕ (${byteToString(s0)} ⊕ ${byteToString(
          s1
        )} ⊕ ${byteToString(s2)} ⊕ ${byteToString(
          s3
        )}) ⊕ (${xtimeStr}) = <b>${byteToString(block[i + 2])}</b><br>`;

        if ((s3 ^ s0) < 128)
          xtimeStr = `(${byteToString(s3)} ⊕ ${byteToString(s0)}) * 2`;
        else
          xtimeStr = `((${byteToString(s3)} ⊕ ${byteToString(
            s0
          )}) * 2 - 256) ⊕ 1B`;
        html += `${byteToString(s3)} ⊕ (${byteToString(s0)} ⊕ ${byteToString(
          s1
        )} ⊕ ${byteToString(s2)} ⊕ ${byteToString(
          s3
        )}) ⊕ (${xtimeStr}) = <b>${byteToString(block[i + 3])}</b><br>`;
        html += "<br>";
      }
      html +=
        "<i>Note that for the Galois field computation, (A ⊕ B) * 2, is used when (A ⊕ B) < 128, otherwise ((A ⊕ B) * 2 - 256) ⊕ 1B is used. Other methods are available as well.</i><br><br>";
      html += "The resulting output is as follows:<br><br>";
      printBlock(block, useBlockTranspose);
    };

    const invMixColumns = (block) => {
      /* Step */
      if (step++ == numSteps) return html;
      html +=
        '<br><h3><span class="step">Step ' +
        step +
        ":</span> Inverse mix columns</h3>";
      for (let i = 0; i < 16; i += 4) {
        let s0 = block[i + 0],
          s1 = block[i + 1];
        let s2 = block[i + 2],
          s3 = block[i + 3];
        let h = s0 ^ s1 ^ s2 ^ s3;
        let xh = xtime[h];
        let h1 = xtime[xtime[xh ^ s0 ^ s2]] ^ h;
        let h2 = xtime[xtime[xh ^ s1 ^ s3]] ^ h;
        block[i + 0] ^= h1 ^ xtime[s0 ^ s1];
        block[i + 1] ^= h2 ^ xtime[s1 ^ s2];
        block[i + 2] ^= h1 ^ xtime[s2 ^ s3];
        block[i + 3] ^= h2 ^ xtime[s3 ^ s0];
      }
      html += "Unmix columns:";
      printBlock(block, useBlockTranspose);
    };

    const toHexString = (byteArray) => {
      return Array.from(byteArray, function (byte) {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      })
        .join("")
        .toUpperCase();
    };

    const printBlock = (block, transpose = false) => {
      html += '<table border="1" cellpadding="5" style="background-color: #FFF">';
      if (transpose) {
        for (let i = 0; i < block.length; i += 4) {
          let s1 = byteToString(block[i]);
          let s2 = byteToString(block[i + 1]);
          let s3 = byteToString(block[i + 2]);
          let s4 = byteToString(block[i + 3]);
          html += `<tr><td>${s1}</td><td>${s2}</td><td>${s3}</td><td>${s4}</td></tr>`;
        }
      } else {
        for (let i = 0; i < 4; i++) {
          html += "<tr>";
          for (let j = 0; j < 4; j++) {
            html += "<td>" + byteToString(block[j * 4 + i]);
            +"</td>";
          }
          html += "</tr>";
        }
      }
      html += "</table>";
    };

    invSbox = new Array(256);
    for (let i = 0; i < 256; i++) {
      invSbox[Sbox[i]] = i;
    }

    invShiftRowTab = new Array(16);
    for (let i = 0; i < 16; i++) {
      invShiftRowTab[shiftRowTab[i]] = i;
    }

    xtime = new Array(256);
    for (let i = 0; i < 128; i++) {
      xtime[i] = i << 1;
      xtime[128 + i] = (i << 1) ^ 0x1b;
    }

    /* Step 0 */
    let step = 0;
    let html = '<h3><span class="step">Step 0:</span> Initialization</h3>';

    // Parse strings into an array of integers
    let block = msg.match(/(..?)/g).map((x) => parseInt(x, 16));
    let key = keyStr.match(/(..?)/g).map((x) => parseInt(x, 16));

    html += "Message: " + msg.match(/(..?)/g).join(", ") + "<br><br>";
    printBlock(block, useBlockTranspose);
    html += "<br><hr><br>Key: " + keyStr.match(/(..?)/g).join(", ") + "<br><br>";
    printBlock(key, useBlockTranspose);

    /* Step 1 */
    if (step++ == numSteps) return html;
    html += '<br><h3><span class="step">Step 1:</span> Expand the key</h3>';

    // Depending on the desired encryption strength of 128, 192 or 256 bits 'key' has to be a byte array of length 16, 24 or 32, respectively. The key expansion is done 'in place', meaning that the array 'key' is modified.
    const expandKey = (key) => {
      let keyLength = key.length,
        keySize,
        Rcon = 1;
      switch (keyLength) {
        case 16:
          keySize = 16 * (10 + 1);
          break;
        case 24:
          keySize = 16 * (12 + 1);
          break;
        case 32:
          keySize = 16 * (14 + 1);
          break;
        default:
          alert("Key length can only by 16, 24 or 32 bytes.");
      }

      html +=
        '<table border="1" cellpadding="5" style="background-color: #FFF; width:100%">';

      html += '<tr style="background-color: #FFC7C9">';
      html +=
        "<th>z1</th><th>z2</th><th>z3</th><th>z4</th><th>z5</th><th>z6</th><th>z7</th><th>z8</th><th>z9</th><th>z10</th>";
      html += "</tr><tr>";
      for (let i = keyLength; i < keySize; i += 4) {
        let temp = key.slice(i - 4, i);
        if (i % keyLength == 0) {
          temp = [
            Sbox[temp[1]] ^ Rcon,
            Sbox[temp[2]],
            Sbox[temp[3]],
            Sbox[temp[0]],
          ];
          if ((Rcon <<= 1) >= 256) {
            Rcon ^= 0x11b;
          }
          let z = temp.map((x) => byteToString(x));
          html += `<td>${z[0]} ${z[1]}<br>${z[2]} ${z[3]}</td>`;
        } else if (keyLength > 24 && i % keyLength == 16) {
          temp = [Sbox[temp[0]], Sbox[temp[1]], Sbox[temp[2]], Sbox[temp[3]]];
        }
        for (let j = 0; j < 4; j++) {
          key[i + j] = key[i + j - keyLength] ^ temp[j];
        }
      }
      html += "</tr>";
      html += "</table>";
      html += "<br>";

      const pre = [
        "w0 =  = ",
        "w1 =  = ",
        "w2 =  = ",
        "w3 =  = ",
        "w4 = w0  ⊕ z1 = ",
        "w5 = w4  ⊕ w1 = ",
        "w6 = w5  ⊕ w2 = ",
        "w7 = w6  ⊕ w3 = ",
        "w8 = w4  ⊕ z2 = ",
        "w9 = w8  ⊕ w5 = ",
        "w10 = w9  ⊕ w6 = ",
        "w11 = w10  ⊕ w7 = ",
        "w12 = w8  ⊕ z3 = ",
        "w13 = w12  ⊕ w9 = ",
        "w14 = w13  ⊕ w10 = ",
        "w15 = w14  ⊕ w11 = ",
        "w16 = w12 ⊕ z4 = ",
        "w17 = w16 ⊕ w13 = ",
        "w18 = w17 ⊕ w14 = ",
        "w19 = w18 ⊕ w15 = ",
        "w20 = w16 ⊕ z5 = ",
        "w21 = w20 ⊕ w17 = ",
        "w22 = w21 ⊕ w18 = ",
        "w23 = w22 ⊕ w19 = ",
        "w24 = w20 ⊕ z6 = ",
        "w25 = w24 ⊕ w21 = ",
        "w26 = w25 ⊕ w22 = ",
        "w27 = w26 ⊕ w23 = ",
        "w28 = w24 ⊕ z7 = ",
        "w29 = w28 ⊕ w25 = ",
        "w30 = w29 ⊕ w26 = ",
        "w31 = w30 ⊕ w27 = ",
        "w32 = w28 ⊕ z8 = ",
        "w33 = w32 ⊕ w29 = ",
        "w34 = w33 ⊕ w30 = ",
        "w35 = w34 ⊕ w32 =",
        "w36 = w32 ⊕ z9 = ",
        "w37 = w36 ⊕ w33 = ",
        "w38 = w37 ⊕ w34 = ",
        "w39 = w38 ⊕ w35 = ",
        "w40 = w36 ⊕ z10 = ",
        "w41 = w40 ⊕ w37 = ",
        "w42 = w41 ⊕ w38 = ",
        "w43 = w42 ⊕ w39 = ",
      ];

      html +=
        '<table border="1" cellpadding="5" style="background-color: #FFF; width:100%">';
      html +=
        '<tr style="background-color: #FFC7C9"><th>Round key</th><th>Expansion formula</th><th>Final output</th></tr>';
      for (let i = 0; i < key.length; i += 4) {
        let s1 = "00" + key[i].toString(16).toUpperCase();
        s1 = s1.substring(s1.length - 2);
        let s2 = "00" + key[i + 1].toString(16).toUpperCase();
        s2 = s2.substring(s2.length - 2);
        let s3 = "00" + key[i + 2].toString(16).toUpperCase();
        s3 = s3.substring(s3.length - 2);
        let s4 = "00" + key[i + 3].toString(16).toUpperCase();
        s4 = s4.substring(s4.length - 2);

        let s = (pre[i / 4] + " " + s1 + " " + s2 + " " + s3 + " " + s4).split(
          " = "
        );

        html +=
          "<tr" +
          (Math.floor(i / 16) % 2 == 1
            ? ' style="background-color: #FEE6EA"'
            : "") +
          "><td>" +
          s[0] +
          "</td><td>" +
          s[1] +
          "</td><td><b>" +
          s[2] +
          "</b></td></tr>";
      }
      html += "</table>";
    };
    expandKey(key);

    blockAfterEachRound.push(block.slice());
    let count = 0,
      i;
    addRoundKey(block, key.slice(0, 16), 0, count);

    blockAfterEachRound.push(block.slice());
    for (i = 16; i < key.length - 16; i += 16) {
      count++;

      subBytes(block, Sbox, count);
      shiftRows(block, shiftRowTab, count);
      mixColumns(block, count);
      addRoundKey(block, key.slice(i, i + 16), i / 4, count);
      blockAfterEachRound.push(block.slice());
    }
    count++;
    subBytes(block, Sbox, count);
    shiftRows(block, shiftRowTab, count);
    addRoundKey(block, key.slice(i, key.length), i / 4, count);
    blockAfterEachRound.push(block.slice());

    /* Step 42 */
    if (step++ == numSteps) return html;
    html +=
      '<br><h3><span class="step">Step ' +
      step +
      ":</span> Output the ciphertext</h3>";

    html +=
      "In conclusion, the block states after each round are as follows:<br><hr>";
    round = -2;
    for (let block of blockAfterEachRound) {
      round++;
      if (round >= 0) html += `Round ${round}: `;
      else html += "Initialize: ";
      html += `${block.map((x) => byteToString(x)).join(" ")}<br>`;
    }

    /* Shows the binary representation as well
        html += '<br>Or in binary:<hr>';
        round = -2;
        for(let block of blockAfterEachRound) {
            round++;
            if(round >= 0 ) html += `Round ${round}: `;
            else html += 'Initialize: ';
            html += `${block.map(x => byteToString(x, 2)).join(' ')}<br>`;
        }
        */

    html +=
      "<br><hr>The ciphertext is the final block state:\n" +
      toHexString(block)
        .match(/(.{4}?)/g)
        .join(" ");


    ciphertext = toHexString(block);

    const ciphertextDOM = document.getElementById("ciphertext");
    ciphertextDOM.value = ciphertext;
    return html;
  }
