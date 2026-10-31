import re

with open('src/components/Header.tsx', 'r') as f:
    content = f.read()

# Segmented control style
content = content.replace('bg-slate-100/90 rounded-2xl border border-slate-200/60/80', 'bg-slate-100/80 rounded-2xl border-none')
content = content.replace('shadow-sm shadow-slate-200 ring-1 ring-slate-200/80 font-bold', 'shadow-xs font-bold')
content = re.sub(r'\{/\* Active bottom glowing bar \*/\}.*?\{isActive && \(\s*<span className="absolute bottom-0[^>]+>\s*\)\}', '', content, flags=re.DOTALL)
content = re.sub(r'\{isActive && \(\s*<span className="absolute bottom-0[^>]+></span>\s*\)\}', '', content, flags=re.DOTALL)
content = re.sub(r'<span className="absolute bottom-0 inset-x-4 h-0.5 bg-amber-500 rounded-full" />', '', content)

with open('src/components/Header.tsx', 'w') as f:
    f.write(content)
