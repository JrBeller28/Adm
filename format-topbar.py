with open('src/components/TopBar.tsx', 'r') as f:
    content = f.read()

content = content.replace("bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20", "bg-slate-900 hover:bg-slate-800 text-white shadow-sm shadow-slate-900/20")
content = content.replace("text-blue-600", "text-slate-700")
content = content.replace("bg-blue-50", "bg-slate-100")
content = content.replace("border-blue-100", "border-slate-200")

# the icon in TopBar
content = content.replace('text-blue-600 stroke-[2.2]', 'text-slate-600 stroke-[2.2]')

with open('src/components/TopBar.tsx', 'w') as f:
    f.write(content)
