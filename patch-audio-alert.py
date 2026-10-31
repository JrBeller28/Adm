import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

if 'useRef' not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect, useRef } from 'react';")

hook_code = """
  const prevLowStockRef = useRef(totalLowStock);

  useEffect(() => {
    // Play audio alert when low stock count increases
    if (totalLowStock > prevLowStockRef.current) {
      try {
        // Create an oscillator for a short beep
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5); // drop to A4
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (err) {
        console.warn('AudioContext not supported or blocked by browser policy:', err);
      }
    }
    prevLowStockRef.current = totalLowStock;
  }, [totalLowStock]);
"""

# Insert the hook right after totalLowStock is calculated
content = content.replace(
    "const totalLowStock = lowBulkCount + lowPackagedCount;",
    "const totalLowStock = lowBulkCount + lowPackagedCount;\n" + hook_code
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
