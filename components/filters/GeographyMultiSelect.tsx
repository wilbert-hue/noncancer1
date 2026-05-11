'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useDashboardStore } from '@/lib/store'
import { Check, ChevronDown, ChevronRight } from 'lucide-react'

// Region-to-countries hierarchy (matches data-processor.ts)
const regionToCountries: Record<string, string[]> = {
  'North America': ['U.S.', 'Canada'],
  'Europe': ['U.K.', 'Germany', 'Italy', 'France', 'Spain', 'Russia', 'Rest of Europe'],
  'Asia Pacific': ['China', 'India', 'Japan', 'South Korea', 'ASEAN', 'Australia', 'Rest of Asia Pacific'],
  'Latin America': ['Brazil', 'Argentina', 'Mexico', 'Rest of Latin America'],
  'Middle East': ['GCC', 'Israel', 'Rest of Middle East'],
  'Africa': ['North Africa', 'Central Africa', 'South Africa']
}

const regionOrder = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa']

export function GeographyMultiSelect() {
  const { data, filters, updateFilters } = useDashboardStore()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Build hierarchical geography structure from available data
  const { hierarchy, flatFiltered } = useMemo(() => {
    if (!data || !data.dimensions?.geographies) return { hierarchy: [], flatFiltered: [] }

    const allGeographies = data.dimensions.geographies.all_geographies || []
    const allSet = new Set(allGeographies)
    const search = searchTerm.toLowerCase()

    // Build hierarchy: Global at top, then regions with their countries
    const tree: { label: string; children: string[] }[] = []

    // Add Global if it exists in data
    if (allSet.has('Global')) {
      tree.push({ label: 'Global', children: [] })
    }

    // Add regions with their countries (only if they exist in data)
    for (const region of regionOrder) {
      if (!allSet.has(region)) continue
      const countries = (regionToCountries[region] || []).filter(c => allSet.has(c))
      tree.push({ label: region, children: countries })
    }

    // Collect all items already placed in the hierarchy
    const placed = new Set<string>()
    placed.add('Global')
    for (const node of tree) {
      placed.add(node.label)
      node.children.forEach(c => placed.add(c))
    }

    // Add any remaining geographies that aren't in the hierarchy as top-level items
    for (const geo of allGeographies) {
      if (!placed.has(geo)) {
        tree.push({ label: geo, children: [] })
      }
    }

    // Filter by search term
    if (search) {
      const filtered: string[] = []
      for (const node of tree) {
        if (node.label.toLowerCase().includes(search)) filtered.push(node.label)
        for (const child of node.children) {
          if (child.toLowerCase().includes(search)) filtered.push(child)
        }
      }
      return { hierarchy: tree, flatFiltered: filtered }
    }

    return { hierarchy: tree, flatFiltered: [] }
  }, [data, searchTerm])

  const isSearching = searchTerm.length > 0

  const toggleExpand = (region: string) => {
    setExpandedRegions(prev => {
      const next = new Set(prev)
      if (next.has(region)) {
        next.delete(region)
      } else {
        next.add(region)
      }
      return next
    })
  }

  const handleToggle = (geography: string) => {
    const current = filters.geographies
    const updated = current.includes(geography)
      ? current.filter(g => g !== geography)
      : [...current, geography]

    updateFilters({ geographies: updated })
  }

  // Toggle a region individually (same as any other geography)
  const handleToggleRegion = (region: string) => {
    const current = filters.geographies
    const updated = current.includes(region)
      ? current.filter(g => g !== region)
      : [...current, region]

    updateFilters({ geographies: updated })
  }

  const handleSelectAll = () => {
    if (!data) return
    updateFilters({
      geographies: data.dimensions.geographies.all_geographies
    })
  }

  const handleClearAll = () => {
    updateFilters({ geographies: [] })
  }

  if (!data) return null

  const selectedCount = filters.geographies.length

  const renderCheckbox = (geography: string, indented: boolean = false) => (
    <label
      key={geography}
      className={`flex items-center py-2 hover:bg-blue-50 cursor-pointer border-t border-gray-100 ${
        indented ? 'pl-10 pr-3' : 'px-3'
      }`}
    >
      <input
        type="checkbox"
        checked={filters.geographies.includes(geography)}
        onChange={() => handleToggle(geography)}
        className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <span className={`text-sm text-black flex-1 ${indented ? '' : 'font-medium'}`}>{geography}</span>
      {filters.geographies.includes(geography) && (
        <Check className="h-4 w-4 text-blue-600" />
      )}
    </label>
  )

  const renderRegionNode = (node: { label: string; children: string[] }) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedRegions.has(node.label)
    const isSelected = filters.geographies.includes(node.label)

    if (!hasChildren) {
      return renderCheckbox(node.label, false)
    }

    return (
      <div key={node.label}>
        {/* Region row with expand arrow + checkbox */}
        <div className="flex items-center py-2 px-3 hover:bg-blue-50 border-t border-gray-100">
          <button
            onClick={() => toggleExpand(node.label)}
            className="mr-1 p-0.5 rounded hover:bg-gray-200 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
            )}
          </button>
          <label className="flex items-center flex-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggleRegion(node.label)}
              className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-black font-medium flex-1">{node.label}</span>
            {isSelected && <Check className="h-4 w-4 text-blue-600" />}
          </label>
        </div>

        {/* Children */}
        {isExpanded && node.children.map(child => renderCheckbox(child, true))}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span className="text-sm text-black">
          {selectedCount === 0
            ? 'Select geographies...'
            : `${selectedCount} selected`}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search geographies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="px-3 py-2 bg-gray-50 border-b flex gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>

          {/* Geography List - Hierarchical */}
          <div className="overflow-y-auto max-h-64">
            {isSearching ? (
              // Flat filtered results when searching
              flatFiltered.length === 0 ? (
                <div className="px-3 py-4 text-sm text-black text-center">
                  No geographies found matching your search
                </div>
              ) : (
                flatFiltered.map(geo => renderCheckbox(geo, false))
              )
            ) : (
              // Hierarchical view
              hierarchy.length === 0 ? (
                <div className="px-3 py-4 text-sm text-black text-center">
                  No geographies available
                </div>
              ) : (
                hierarchy.map(node => renderRegionNode(node))
              )
            )}
          </div>
        </div>
      )}

      {/* Selected Count Badge */}
      {selectedCount > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-black">
            {selectedCount} {selectedCount === 1 ? 'geography' : 'geographies'} selected
          </span>
        </div>
      )}
    </div>
  )
}
