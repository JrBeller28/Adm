import os
import re

components_dir = 'src/components'
for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            content = content.replace("border-slate-200/60/80", "border-slate-200/60")
            content = content.replace("border-slate-200/60/60", "border-slate-200/60")
            
            with open(path, 'w') as f:
                f.write(content)
