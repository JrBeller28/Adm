import re

for file in ['src/components/BulkStockView.tsx', 'src/components/PackagedStockView.tsx']:
    with open(file, 'r') as f:
        content = f.read()

    # Search Input Focus ring
    content = content.replace("focus:ring-blue-500", "focus:ring-amber-500")

    # Category Pills active state
    content = content.replace("bg-blue-600 text-white shadow-xs", "bg-slate-900 text-white shadow-xs")
    
    with open(file, 'w') as f:
        f.write(content)
