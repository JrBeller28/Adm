import os
import re

for root, dirs, files in os.walk('src/components'):
    for file in files:
        if file.endswith('Modal.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            content = content.replace('bg-slate-900/50 flex items-center', 'bg-slate-900/40 backdrop-blur-md flex items-center')
            
            with open(path, 'w') as f:
                f.write(content)
