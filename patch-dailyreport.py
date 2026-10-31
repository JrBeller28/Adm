import re

with open('src/components/DailyReportView.tsx', 'r') as f:
    content = f.read()

# Replace selectedDate state with startDate and endDate
content = re.sub(
    r"const \[selectedDate, setSelectedDate\] = useState<string>\(todayStr\);",
    "const [startDate, setStartDate] = useState<string>(todayStr);\n  const [endDate, setEndDate] = useState<string>(todayStr);",
    content
)

# Replace the filtering logic
old_filter = """  // Filter transactions by selected date (YYYY-MM-DD)
  const dayTransactions = transactions.filter((t) =>
    t.timestamp.startsWith(selectedDate)
  );"""
new_filter = """  // Filter transactions by date range
  const dayTransactions = transactions.filter((t) => {
    const tDate = t.timestamp.substring(0, 10);
    return tDate >= startDate && tDate <= endDate;
  });"""
content = content.replace(old_filter, new_filter)

# Update the UI controls
old_ui = """        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedDate === todayStr
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
            }`}
          >
            Hari Ini
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>"""
new_ui = """        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setStartDate(todayStr);
              setEndDate(todayStr);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              startDate === todayStr && endDate === todayStr
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
            }`}
          >
            Hari Ini
          </button>
          <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value > endDate) setEndDate(e.target.value);
              }}
              className="px-3 py-2 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
            <span className="text-slate-400 font-bold px-1">-</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>
        </div>"""
content = content.replace(old_ui, new_ui)

content = content.replace("focus:ring-blue-500", "focus:ring-amber-500")

# Identity update inside DailyReportView
content = content.replace("bg-blue-600", "bg-slate-900")
content = content.replace("bg-blue-50 text-blue-600", "bg-amber-50 text-amber-600")
content = content.replace("text-blue-600", "text-amber-600")
content = content.replace("text-blue-700 bg-blue-50", "text-amber-700 bg-amber-50")
content = content.replace("bg-blue-50", "bg-amber-50")

with open('src/components/DailyReportView.tsx', 'w') as f:
    f.write(content)
