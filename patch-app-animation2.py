import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("initial={ opacity: 0, y: 10 }", "initial={{ opacity: 0, y: 10 }}")
content = content.replace("animate={ opacity: 1, y: 0 }", "animate={{ opacity: 1, y: 0 }}")
content = content.replace("exit={ opacity: 0, y: -10 }", "exit={{ opacity: 0, y: -10 }}")
content = content.replace("transition={ duration: 0.2 }", "transition={{ duration: 0.2 }}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
