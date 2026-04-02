import { useEffect, useRef } from "react"
import { createChart, ColorType, CandlestickSeries, AreaSeries, LineSeries, type IChartApi, type ISeriesApi, type Time } from "lightweight-charts"
import { useStore } from "../../stores/useStore"

export interface OHLCVData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  value?: number; // Volume
}

interface TradingChartProps {
  data: OHLCVData[];
  type?: "candlestick" | "line" | "area";
  symbol?: string;
  timeframe?: string;
}

export function TradingChart({ data, type = "candlestick", symbol = "BTC/USDT", timeframe = "1H" }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<any> | null>(null)
  const { isDark } = useStore()

  useEffect(() => {
    if (!chartContainerRef.current) return

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    // Chart Configuration mimicking TradingView dark mode
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#8892B0' : '#475569',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(42, 46, 57, 0.5)' : 'rgba(226, 232, 240, 0.5)' },
        horzLines: { color: isDark ? 'rgba(42, 46, 57, 0.5)' : 'rgba(226, 232, 240, 0.5)' },
      },
      crosshair: {
        mode: 1, // Normal mode
        vertLine: {
          color: '#3B82F6',
          width: 1,
          style: 3,
          labelBackgroundColor: '#3B82F6',
        },
        horzLine: {
          color: '#F59E0B',
          width: 1,
          style: 3,
          labelBackgroundColor: '#F59E0B',
        },
      },
      rightPriceScale: {
        borderColor: isDark ? 'rgba(42, 46, 57, 1)' : 'rgba(226, 232, 240, 1)',
      },
      timeScale: {
        borderColor: isDark ? 'rgba(42, 46, 57, 1)' : 'rgba(226, 232, 240, 1)',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400, // Will be overridden by flex container if needed
      autoSize: true, // Requires lightweight-charts auto-size handling wrapper if not manually resized
    })

    chartRef.current = chart

    let activeSeries: ISeriesApi<any>;

    if (type === "candlestick") {
      activeSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#00C896',
        downColor: '#FF4757',
        borderVisible: false,
        wickUpColor: '#00A878',
        wickDownColor: '#CC3344',
      })
    } else if (type === "area") {
      activeSeries = chart.addSeries(AreaSeries, {
        lineColor: '#3B82F6',
        topColor: 'rgba(59, 130, 246, 0.4)',
        bottomColor: 'rgba(59, 130, 246, 0.0)',
        lineWidth: 2,
      })
    } else {
      activeSeries = chart.addSeries(LineSeries, {
        color: '#3B82F6',
        lineWidth: 2,
      })
    }
    
    // Sort and set data
    const formattedData = [...data].sort((a, b) => {
      const timeA = typeof a.time === "string" ? new Date(a.time).getTime() : a.time;
      const timeB = typeof b.time === "string" ? new Date(b.time).getTime() : b.time;
      return timeA - timeB;
    })
    
    if (type === "candlestick") {
      activeSeries.setData(formattedData.map(d => ({ ...d, time: d.time as Time })))
    } else {
      activeSeries.setData(formattedData.map(d => ({ time: d.time as Time, value: d.close })))
    }

    seriesRef.current = activeSeries;

    // Simulate EMA lines
    const emaSeries = chart.addSeries(LineSeries, { color: 'yellow', lineWidth: 1, title: 'EMA 9' })
    const emaData = formattedData.map(d => ({ time: d.time as Time, value: d.close * (1 + (Math.random() * 0.02 - 0.01)) }))
    emaSeries.setData(emaData)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, type, isDark])

  return (
    <div className="relative w-full h-full min-h-[400px] flex flex-col group">
      {/* Chart Toolbar Overlay */}
      <div className="absolute top-2 left-2 z-10 flex items-center bg-card/80 backdrop-blur-sm border border-border rounded opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex px-2 py-1 items-center gap-2">
          <span className="font-bold text-foreground">{symbol}</span>
          <span className="font-mono text-muted-foreground text-xs">{timeframe}</span>
        </div>
      </div>
      
      <div ref={chartContainerRef} className="w-full flex-1 relative rounded-b overflow-hidden" />
    </div>
  )
}
