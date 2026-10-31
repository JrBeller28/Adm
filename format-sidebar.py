with open('src/components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Change active tab in Sidebar
content = content.replace('bg-blue-600 text-white shadow-md shadow-blue-500/20', 'bg-slate-900 text-white shadow-md shadow-slate-900/20')
# Change active text color
content = content.replace("text-blue-100 font-medium", "text-slate-300 font-medium")
# Icon background when active
content = content.replace("'bg-white/20 text-white border-white/10 shadow-inner'", "'bg-amber-500 text-slate-900 border-amber-400 shadow-inner'")

# Group name color
content = content.replace("text-blue-600", "text-slate-500")

# Shortcut tag
content = content.replace("'bg-blue-500/50 text-blue-50 border-blue-400 font-bold'", "'bg-slate-700 text-slate-300 border-slate-600 font-bold'")

# Active bar on collapsed mode
content = content.replace("bg-blue-200 rounded-r-md", "bg-amber-500 rounded-r-md")

# Widget sync
content = content.replace('text-blue-500', 'text-emerald-500')
content = content.replace('text-blue-600', 'text-emerald-600')
content = content.replace('bg-blue-500', 'bg-emerald-500')

with open('src/components/Sidebar.tsx', 'w') as f:
    f.write(content)
