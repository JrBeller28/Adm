import re
with open('src/components/POSView.tsx', 'r') as f:
    content = f.read()

# Checkout button (usually bg-blue-600)
content = content.replace("bg-blue-600 hover:bg-blue-700", "bg-slate-900 hover:bg-slate-800")
content = content.replace("shadow-blue-500/20", "shadow-slate-900/20")
content = content.replace("text-blue-600", "text-slate-900")
content = content.replace("bg-blue-50", "bg-slate-100")
content = content.replace("border-blue-200", "border-slate-300")
content = content.replace("focus:ring-blue-500", "focus:ring-slate-900")
content = content.replace("ring-blue-500", "ring-slate-900")

with open('src/components/POSView.tsx', 'w') as f:
    f.write(content)

with open('src/components/RepackView.tsx', 'r') as f:
    content2 = f.read()

content2 = content2.replace("bg-blue-600 hover:bg-blue-700", "bg-slate-900 hover:bg-slate-800")
content2 = content2.replace("shadow-blue-500/20", "shadow-slate-900/20")
content2 = content2.replace("text-blue-600", "text-slate-900")
content2 = content2.replace("bg-blue-50", "bg-slate-100")
content2 = content2.replace("border-blue-200", "border-slate-300")
content2 = content2.replace("focus:ring-blue-500", "focus:ring-slate-900")

with open('src/components/RepackView.tsx', 'w') as f:
    f.write(content2)

