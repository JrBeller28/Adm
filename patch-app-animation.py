import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add motion import
if 'import { motion, AnimatePresence }' not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';")

# Replace <main ...> content wrappers with AnimatePresence
# We need to wrap the switch/case or activeTab conditions with AnimatePresence and motion.div
# First, let's locate the <main> block
main_match = re.search(r'(<main[^>]*>)(.*?)(</main>)', content, re.DOTALL)
if main_match:
    main_start = main_match.group(1)
    main_inner = main_match.group(2)
    main_end = main_match.group(3)
    
    # Basically every condition block inside main needs to be wrapped, OR we can wrap the whole inner content in AnimatePresence and a single motion.div keyed by activeTab
    
    new_inner = f"""
        <AnimatePresence mode="wait">
          <motion.div
            key={{activeTab}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {main_inner}
          </motion.div>
        </AnimatePresence>
"""
    
    content = content[:main_match.start()] + main_start + new_inner + main_end + content[main_match.end():]

with open('src/App.tsx', 'w') as f:
    f.write(content)
