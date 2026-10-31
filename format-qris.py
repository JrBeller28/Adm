with open('src/components/QRISModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('bg-slate-900/50 flex items-center', 'bg-slate-900/40 backdrop-blur-md flex items-center')

with open('src/components/QRISModal.tsx', 'w') as f:
    f.write(content)
