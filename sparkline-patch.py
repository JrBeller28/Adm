import re

with open('src/components/AnalyticsView.tsx', 'r') as f:
    content = f.read()

# Fix border double classes
content = content.replace("border-slate-200/60/60", "border-slate-200/60")

# Apply Amber & Slate identity for the stat cards
# Replace bg-blue-50 text-blue-600 with bg-amber-50 text-amber-600 in the stat cards ONLY
def replace_card_colors(match):
    text = match.group(0)
    text = text.replace("bg-blue-50", "bg-amber-50").replace("text-blue-600", "text-amber-600")
    # Add sparkline before the last closing div of the card
    sparkline = """
          <div className="mt-3 -mx-2 -mb-2">
            <svg className="w-full h-8" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 20 L 20 12 L 40 15 L 60 5 L 80 8 L 100 2" fill="none" className="stroke-amber-400 stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0 20 L 20 12 L 40 15 L 60 5 L 80 8 L 100 2 L 100 20 L 0 20" className="fill-amber-500/10" />
            </svg>
          </div>
"""
    # Just insert it right before the last closing div of the card (not accurate with regex if nested)
    # The structure is: 
    # <div className="mt-4">
    #   <div>...</div>
    #   <div>...</div>
    # </div>
    # We will inject sparkline just after the value div.
    text = re.sub(r'(<div className="text-base sm:text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight mt-0.5">[\s\S]*?</div>)', r'\1' + sparkline, text)
    return text

content = re.sub(r'\{/\* Card 1: Total Penjualan \*/\}[\s\S]*?(?=\{/\* Card 2)', replace_card_colors, content)
content = re.sub(r'\{/\* Card 2: Total Transaksi \*/\}[\s\S]*?(?=\{/\* Card 3)', replace_card_colors, content)
content = re.sub(r'\{/\* Card 3: Total Produk Terjual \*/\}[\s\S]*?(?=\{/\* Card 4)', replace_card_colors, content)
content = re.sub(r'\{/\* Card 4: Nilai Aset Gudang.*?</div>\s*</div>\s*</div>', replace_card_colors, content)

with open('src/components/AnalyticsView.tsx', 'w') as f:
    f.write(content)
