with open('src/components/MobileBottomNav.tsx', 'r') as f:
    content = f.read()

content = content.replace("bg-blue-600 text-white border-blue-600 shadow-md font-bold", "bg-slate-900 text-white border-slate-900 shadow-md font-bold")
content = content.replace("text-blue-100", "text-slate-300")
content = content.replace("bg-white text-blue-600", "bg-white text-slate-900")
content = content.replace("text-blue-600", "text-slate-900")
content = content.replace("bg-blue-100", "bg-amber-100")
content = content.replace("border-slate-200/60/80", "border-slate-200/60")

with open('src/components/MobileBottomNav.tsx', 'w') as f:
    f.write(content)
