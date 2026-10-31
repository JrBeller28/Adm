with open('src/index.css', 'r') as f:
    content = f.read()

import re
old_css = r'\.receipt-thermal::after \{.*?\}'
new_css = """.receipt-thermal::after {
    content: "";
    position: absolute;
    bottom: -16px;
    left: 0;
    width: 100%;
    height: 16px;
    background-size: 16px 16px;
    background-image: 
      linear-gradient(135deg, transparent 50%, white 50%),
      linear-gradient(225deg, transparent 50%, white 50%);
    background-position: 0 0;
    filter: drop-shadow(0 4px 2px rgba(0,0,0,0.06));
}"""

content = re.sub(old_css, new_css, content, flags=re.DOTALL)

with open('src/index.css', 'w') as f:
    f.write(content)
