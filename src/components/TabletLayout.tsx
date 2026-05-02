import React from 'react'

interface TabletLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

const TabletLayout: React.FC<TabletLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left Sidebar - Navigation */}
      {sidebar && (
        <div className="w-64 bg-dark-card border-r border-dark-border p-4">
          {sidebar}
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default TabletLayout
