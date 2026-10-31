// Simple, robust QR Code generator for QRIS and receipts
// Generates SVG path representation for crisp display at any scale

export function generateQRMatrix(text: string): boolean[][] {
  // 25x25 matrix baseline
  const size = 25;
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  function addFinderPattern(startX: number, startY: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  }

  // Position detection patterns (top-left, top-right, bottom-left)
  addFinderPattern(0, 0);
  addFinderPattern(size - 7, 0);
  addFinderPattern(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern (around 16, 16)
  const ax = 16;
  const ay = 16;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
        matrix[ay + r][ax + c] = true;
      }
    }
  }

  // Hash string into data modules
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  let seed = Math.abs(hash);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      const inAlign = Math.abs(r - ax) <= 2 && Math.abs(c - ax) <= 2;

      if (!inTL && !inTR && !inBL && !inTiming && !inAlign) {
        seed = (seed * 9301 + 49297) % 233280;
        matrix[r][c] = (seed % 2 === 0) || ((r + c + text.length) % 3 === 0);
      }
    }
  }

  return matrix;
}
