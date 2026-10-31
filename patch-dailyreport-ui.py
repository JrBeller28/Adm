import re

with open('src/components/DailyReportView.tsx', 'r') as f:
    content = f.read()

# Look for the date selector block in DailyReportView
old_block = r"""        \{/\* Date Selector \*/\}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick=\{\(\) => setSelectedDate\(todayStr\)\}
            className=\{\`px-3\.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer \$\{
              selectedDate === todayStr
                \? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
            \}\`\}
          >
            Hari Ini
          </button>
          <input
            type="date"
            value=\{selectedDate\}
            onChange=\{\(e\) => setSelectedDate\(e\.target\.value\)\}
            className="px-3\.5 py-2 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>"""

new_block = """        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
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
          <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 shadow-sm shadow-slate-200/20">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value > endDate) setEndDate(e.target.value);
              }}
              className="px-3 py-1.5 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
            <span className="text-slate-400 font-bold px-1 text-xs">-</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>
        </div>"""

content = re.sub(old_block, new_block, content, flags=re.DOTALL)

# And if there was another copy inserted by my previous python script that's orphaned, let's remove it if it's there.
orphan_code = r"""        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick=\{\(\) => \{
              setStartDate\(todayStr\);
              setEndDate\(todayStr\);
            \}\}
            className=\{\`px-3\.5 py-1\.5 rounded-full text-xs font-bold transition-all cursor-pointer \$\{
              startDate === todayStr && endDate === todayStr
                \? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
            \}\`\}
          >
            Hari Ini
          </button>
          <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
            <input
              type="date"
              value=\{startDate\}
              onChange=\{\(e\) => \{
                setStartDate\(e\.target\.value\);
                if \(e\.target\.value > endDate\) setEndDate\(e\.target\.value\);
              \}\}
              className="px-3 py-2 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
            <span className="text-slate-400 font-bold px-1">-</span>
            <input
              type="date"
              value=\{endDate\}
              min=\{startDate\}
              onChange=\{\(e\) => setEndDate\(e\.target\.value\)\}
              className="px-3 py-2 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>
        </div>"""
content = re.sub(orphan_code, "", content, flags=re.DOTALL)

with open('src/components/DailyReportView.tsx', 'w') as f:
    f.write(content)
