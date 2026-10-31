import os
import re

components_dir = 'src/components'
for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            # 1. Replace font-black and font-extrabold with font-bold
            content = content.replace('font-black', 'font-bold')
            content = content.replace('font-extrabold', 'font-bold')
            
            # 2. Replace border-slate-200 or border-slate-200/80 or border-slate-100 with border-slate-200/60 for subtle borders
            content = re.sub(r'border-slate-100\b', 'border-slate-200/60', content)
            content = re.sub(r'border-slate-200\b', 'border-slate-200/60', content)
            content = re.sub(r'border-slate-200/80', 'border-slate-200/60', content)
            
            # 3. Replace rounded-3xl with rounded-2xl
            content = content.replace('rounded-3xl', 'rounded-2xl')
            
            with open(path, 'w') as f:
                f.write(content)
