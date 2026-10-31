with open('src/components/ReceiptModal.tsx', 'r') as f:
    content = f.read()

# Update backdrop
content = content.replace('bg-slate-900/50 flex items-center', 'bg-slate-900/40 backdrop-blur-md flex items-center')

# Update receipt container
old_container = "className={`bg-white text-slate-900 ${settings.receiptPaperSize === '80mm' ? 'w-[300px]' : 'w-[220px]'} p-6 shadow-md rounded-xl font-mono text-[11px] leading-relaxed border border-slate-200/80 mx-auto transition-all duration-300`}"
new_container = "className={`relative bg-white text-slate-900 ${settings.receiptPaperSize === '80mm' ? 'w-[300px]' : 'w-[220px]'} pt-6 px-6 pb-8 shadow-xl ring-1 ring-slate-900/5 font-mono text-[11px] leading-relaxed mx-auto transition-all duration-300 receipt-thermal`}"
content = content.replace(old_container, new_container)

with open('src/components/ReceiptModal.tsx', 'w') as f:
    f.write(content)
