'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function CorporateReportsPage() {
  const handleExport = (format: string) => {
    alert(`Exporting ${format} report...`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">CSR Reports</h1>
            <p className="text-sm text-slate-500 mb-8">Export impact data for your stakeholders</p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">Monthly CSR Report</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Comprehensive PDF report with executive summary, charts, and SDG alignment.
                </p>
                <Button onClick={() => handleExport('pdf')} className="w-full">
                  Export PDF
                </Button>
              </Card>

              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">Raw Data Export</h3>
                <p className="text-sm text-slate-500 mb-4">
                  CSV file with all impact logs for custom analysis.
                </p>
                <Button onClick={() => handleExport('csv')} variant="outline" className="w-full">
                  Export CSV
                </Button>
              </Card>
            </div>

            <Card className="mt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Report Sections</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  'Executive Summary — Total meals, carbon, value created',
                  'Monthly Trend Charts — Area charts showing growth',
                  'Geographic Distribution — Map of rescue locations',
                  'Supplier Partners — List of contributing food businesses',
                  'NGO Impact — Communities benefited',
                  'SDG Alignment — UN Sustainable Development Goals mapping',
                  'Carbon Methodology — How CO₂ savings are calculated',
                ].map((section) => (
                  <li key={section} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    {section}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
