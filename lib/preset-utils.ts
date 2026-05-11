/**
 * Utility functions for Filter Presets
 * Handles dynamic calculation of top regions and segments
 */

import type { ComparisonData, DataRecord, FilterState } from './types'

// Main region-level geographies only (not sub-regions like ASEAN)
const REGION_GEOGRAPHIES = new Set([
  'North America', 'Europe', 'Asia Pacific', 'Latin America',
  'Middle East', 'Africa', 'Middle East & Africa'
])

// Country-level geographies
const COUNTRY_GEOGRAPHIES = new Set([
  'U.S.', 'Canada',
  'U.K.', 'Germany', 'Italy', 'France', 'Spain', 'Russia', 'Rest of Europe',
  'China', 'India', 'Japan', 'South Korea', 'Australia', 'Rest of Asia Pacific',
  'Brazil', 'Argentina', 'Mexico', 'Rest of Latin America',
  'GCC', 'Israel', 'Rest of Middle East',
  'North Africa', 'Central Africa', 'South Africa'
])

/**
 * Calculate CAGR from time series data (2026-2033)
 */
function calculateCAGR(timeSeries: Record<number, number>): number {
  const startYear = 2026
  const endYear = 2033
  const years = endYear - startYear // 7
  const startValue = timeSeries[startYear] || 0
  const endValue = timeSeries[endYear] || 0
  if (startValue <= 0 || endValue <= 0) return 0
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100
}

/**
 * Calculate top regions based on market value for a specific year
 * Only considers region-level geographies (not countries or Global)
 */
export function getTopRegionsByMarketValue(
  data: ComparisonData | null,
  year: number = 2025,
  topN: number = 3
): string[] {
  if (!data) return []

  const records = data.data.value.geography_segment_matrix

  // Sum market value by region-level geography only
  const geographyTotals = new Map<string, number>()

  records.forEach((record: DataRecord) => {
    const geography = record.geography

    // Only include region-level geographies
    if (!REGION_GEOGRAPHIES.has(geography)) return

    const value = record.time_series[year] || 0
    const currentTotal = geographyTotals.get(geography) || 0
    geographyTotals.set(geography, currentTotal + value)
  })

  return Array.from(geographyTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([geography]) => geography)
}

/**
 * Get all first-level segments for a given segment type
 */
export function getFirstLevelSegments(
  data: ComparisonData | null,
  segmentType: string
): string[] {
  if (!data) return []

  const segmentDimension = data.dimensions.segments[segmentType]
  if (!segmentDimension) return []

  const hierarchy = segmentDimension.hierarchy || {}
  const allSegments = segmentDimension.items || []

  const allChildren = new Set(Object.values(hierarchy).flat())
  const firstLevelSegments: string[] = []

  Object.keys(hierarchy).forEach(parent => {
    if (!allChildren.has(parent) && hierarchy[parent].length > 0) {
      firstLevelSegments.push(parent)
    }
  })

  allSegments.forEach(segment => {
    if (!allChildren.has(segment) && !hierarchy[segment]) {
      firstLevelSegments.push(segment)
    }
  })

  return firstLevelSegments.sort()
}

/**
 * Get the first available segment type from the data
 */
export function getFirstSegmentType(data: ComparisonData | null): string | null {
  if (!data || !data.dimensions.segments) return null

  const segmentTypes = Object.keys(data.dimensions.segments)
  return segmentTypes.length > 0 ? segmentTypes[0] : null
}

/**
 * Calculate top regions based on CAGR (2026-2033)
 * Only considers region-level geographies, calculates CAGR from time series
 */
export function getTopRegionsByCAGR(
  data: ComparisonData | null,
  topN: number = 2
): string[] {
  if (!data) return []

  const records = data.data.value.geography_segment_matrix

  // Sum total value per region for start and end years, then compute CAGR on the total
  const regionTotals = new Map<string, { start: number; end: number }>()

  records.forEach((record: DataRecord) => {
    const geography = record.geography

    // Only include region-level geographies
    if (!REGION_GEOGRAPHIES.has(geography)) return

    const startVal = record.time_series[2026] || 0
    const endVal = record.time_series[2033] || 0

    const current = regionTotals.get(geography) || { start: 0, end: 0 }
    current.start += startVal
    current.end += endVal
    regionTotals.set(geography, current)
  })

  // Calculate CAGR for each region's total
  const regionCAGRs = Array.from(regionTotals.entries())
    .map(([geography, totals]) => {
      const cagr = totals.start > 0 && totals.end > 0
        ? (Math.pow(totals.end / totals.start, 1 / 7) - 1) * 100
        : 0
      return { geography, cagr }
    })
    .filter(item => item.cagr > 0)

  return regionCAGRs
    .sort((a, b) => b.cagr - a.cagr)
    .slice(0, topN)
    .map(item => item.geography)
}

/**
 * Calculate top countries based on CAGR (2026-2033)
 * Only considers country-level geographies, calculates CAGR from time series
 */
export function getTopCountriesByCAGR(
  data: ComparisonData | null,
  topN: number = 5
): string[] {
  if (!data) return []

  const records = data.data.value.geography_segment_matrix

  // Sum total value per country for start and end years, then compute CAGR on the total
  const countryTotals = new Map<string, { start: number; end: number }>()

  records.forEach((record: DataRecord) => {
    const geography = record.geography

    // Only include country-level geographies
    if (!COUNTRY_GEOGRAPHIES.has(geography)) return

    const startVal = record.time_series[2026] || 0
    const endVal = record.time_series[2033] || 0

    const current = countryTotals.get(geography) || { start: 0, end: 0 }
    current.start += startVal
    current.end += endVal
    countryTotals.set(geography, current)
  })

  // Calculate CAGR for each country's total
  const countryCAGRs = Array.from(countryTotals.entries())
    .map(([geography, totals]) => {
      const cagr = totals.start > 0 && totals.end > 0
        ? (Math.pow(totals.end / totals.start, 1 / 7) - 1) * 100
        : 0
      return { geography, cagr }
    })
    .filter(item => item.cagr > 0)

  return countryCAGRs
    .sort((a, b) => b.cagr - a.cagr)
    .slice(0, topN)
    .map(item => item.geography)
}

/**
 * Create dynamic filter configuration for Top Market preset
 */
export function createTopMarketFilters(data: ComparisonData | null): Partial<FilterState> {
  const topRegions = getTopRegionsByMarketValue(data, 2025, 3)

  return {
    viewMode: 'geography-mode',
    geographies: topRegions,
    segments: [],
    segmentType: 'By Region',
    yearRange: [2025, 2029],
    dataType: 'value'
  }
}

/**
 * Create dynamic filter configuration for Growth Leaders preset
 * Identifies top 2 regions with highest CAGR (2026-2033)
 */
export function createGrowthLeadersFilters(data: ComparisonData | null): Partial<FilterState> {
  if (!data) return {
    viewMode: 'geography-mode',
    yearRange: [2025, 2033],
    dataType: 'value'
  }

  const topRegions = getTopRegionsByCAGR(data, 2)

  return {
    viewMode: 'geography-mode',
    geographies: topRegions,
    segments: [],
    segmentType: 'By Region',
    yearRange: [2025, 2033],
    dataType: 'value'
  }
}

/**
 * Create dynamic filter configuration for Emerging Markets preset
 * Identifies top 5 countries with highest CAGR (2026-2033)
 */
export function createEmergingMarketsFilters(data: ComparisonData | null): Partial<FilterState> {
  if (!data) return {
    viewMode: 'geography-mode',
    yearRange: [2025, 2033],
    dataType: 'value'
  }

  const topCountries = getTopCountriesByCAGR(data, 5)

  // Prefer a standard segment breakdown where country is record.geography (clearer for presets).
  const segmentKeys = Object.keys(data.dimensions.segments)
  const segmentType =
    segmentKeys.find((k) => k === 'By Antibody Type') ||
    segmentKeys.find((k) => k === 'By Usage Techniques') ||
    segmentKeys.find((k) => k === 'By Application / Disease Types') ||
    getFirstSegmentType(data) ||
    'By Region'

  return {
    viewMode: 'geography-mode',
    geographies: topCountries,
    segments: [],
    segmentType,
    yearRange: [2025, 2033],
    dataType: 'value'
  }
}
