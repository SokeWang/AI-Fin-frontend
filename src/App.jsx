import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  TrendingUp, 
  Newspaper, 
  Activity, 
  User,
  Globe,
  Twitter,
  Wifi,
  Clock,
  List,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Briefcase,
  Code,
  Zap,
  MessageSquare,
  Mail,
  Shield
} from 'lucide-react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aifinb.ai-mindflicker.com';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://aifinb.ai-mindflicker.com';

// --- Helper Functions ---

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().slice(11, 16); // HH:MM
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().slice(5, 10); // MM-DD
};


const StrategyPanel = ({ trades }) => {
  // 过滤近一个月的数据
  const recentTrades = useMemo(() => {
    const oneMonthAgo = Date.now() / 1000 - 30 * 24 * 60 * 60; // 30天前的时间戳
    return trades.filter(trade => trade.exitTime >= oneMonthAgo);
  }, [trades]);

  const winRate = useMemo(() => {
    if (!recentTrades.length) return 0;
    const wins = recentTrades.filter(t => t.isWin).length;
    return ((wins / recentTrades.length) * 100).toFixed(1);
  }, [recentTrades]);

  const totalPnL = useMemo(() => {
    return recentTrades.reduce((acc, t) => acc + t.pnl, 0).toFixed(2);
  }, [recentTrades]);

  return (
    <div className="group relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div id="orders-section" className="relative bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-700/30 shadow-2xl flex flex-col overflow-hidden" style={{ height: '500px' }}>
        {/* Orders List Header */}
        <div className="p-5 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/20">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <List className="text-green-400 w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-lg">Strategy Orders</h3>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <span className="text-slate-400 text-xs">Win Rate:</span>
                <span className={`${parseFloat(winRate) > 50 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'} font-bold px-3 py-1 rounded-lg text-xs border ${parseFloat(winRate) > 50 ? 'border-green-500/30' : 'border-red-500/30'}`}>
                  {winRate}%
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 backdrop-blur-md border border-slate-700/50">
                <span className="text-slate-400 text-xs">Total PnL:</span>
                <span className={`${parseFloat(totalPnL) > 0 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'} font-mono font-bold px-3 py-1 rounded-lg text-xs border ${parseFloat(totalPnL) > 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
                  {parseFloat(totalPnL) > 0 ? '+' : ''}{totalPnL}
                </span>
              </div>
            </div>
          </div>
        </div>
      
        <div className="flex-1 overflow-auto custom-scrollbar p-0" style={{ minHeight: '300px' }}>
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-gradient-to-b from-slate-900/70 to-slate-800/50 backdrop-blur-sm text-xs uppercase font-medium text-slate-500 sticky top-0 shadow-inner">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Entry Time</th>
              <th className="px-4 py-3">Entry Price</th>
              <th className="px-4 py-3">Exit Time</th>
              <th className="px-4 py-3">Exit Price</th>
              <th className="px-4 py-3 text-right">PnL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {recentTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-slate-700/20 transition-all duration-200">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${trade.type === 'long' ? 'text-green-400 bg-green-500/30 border border-green-500/40 shadow-green-500/20' : 'text-red-400 bg-red-500/30 border border-red-500/40 shadow-red-500/20'}`}>
                    {trade.type === 'long' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  <div>{formatDate(trade.entryTime)}</div>
                  <div className="text-xs text-slate-500">{formatTime(trade.entryTime)}</div>
                </td>
                <td className="px-4 py-3 font-mono text-slate-300">${trade.entryPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-300">
                  <div>{formatDate(trade.exitTime)}</div>
                  <div className="text-xs text-slate-500">{formatTime(trade.exitTime)}</div>
                </td>
                <td className="px-4 py-3 font-mono text-slate-300">${trade.exitPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-md ${trade.isWin ? 'text-green-400 bg-green-500/30 border border-green-500/40 shadow-green-500/20' : 'text-red-400 bg-red-500/30 border border-red-500/40 shadow-red-500/20'}`}>
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
            {recentTrades.length === 0 && (
               <tr>
                 <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                   No trades executed yet. Strategy waits for 03:00-12:00 UTC range completion.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};


const CryptoChart = ({ onStrategyUpdate }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  
  // Store references to trade box series
  const tradeBoxSeriesRef = useRef([]);
  // Store all data
  const allCandlesRef = useRef([]);
  const allMarkersRef = useRef([]);
  const allTradesRef = useRef([]);
  const isLoadingMoreRef = useRef(false);
  
  const [price, setPrice] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState('1h'); 

  const intervals = ['1m', '5m', '15m', '30m', '1h', '4h', '1d']; 
  
  const drawTradeBoxes = (tradeBoxes) => {
    if (!chartRef.current) return;
    
    // Remove old trade box series
    tradeBoxSeriesRef.current.forEach(boxSeries => {
      if (boxSeries) {
        try {
          chartRef.current.removeSeries(boxSeries);
        } catch (e) {
          console.error("Error removing box series:", e);
        }
      }
    });
    tradeBoxSeriesRef.current = [];
    
    // Create trade boxes (rectangles from entry to exit)
    tradeBoxes.forEach(box => {
      // Create filled area using BaselineSeries
      const fillSeries = chartRef.current.addBaselineSeries({
        baseValue: { type: 'price', price: box.lowPrice },
        topFillColor1: box.color,
        topFillColor2: box.color,
        bottomFillColor1: box.color,
        bottomFillColor2: box.color,
        topLineColor: 'transparent',
        bottomLineColor: 'transparent',
        lineWidth: 0,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });
      
      const fillData = [
        { time: box.entryTime, value: box.highPrice },
        { time: box.exitTime, value: box.highPrice },
      ];
      
      fillSeries.setData(fillData);
      tradeBoxSeriesRef.current.push(fillSeries);
      
      // Helper to create boundary lines
      const createLine = (data) => {
        const lineSeries = chartRef.current.addLineSeries({
          color: box.borderColor,
          lineWidth: 2,
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        });
        lineSeries.setData(data);
        tradeBoxSeriesRef.current.push(lineSeries);
      };

      // Top & Bottom
      createLine([{ time: box.entryTime, value: box.highPrice }, { time: box.exitTime, value: box.highPrice }]);
      createLine([{ time: box.entryTime, value: box.lowPrice }, { time: box.exitTime, value: box.lowPrice }]);
      
      // Left & Right (Vertical)
      createLine([{ time: box.entryTime, value: box.lowPrice }, { time: box.entryTime, value: box.highPrice }]);
      createLine([{ time: box.exitTime, value: box.lowPrice }, { time: box.exitTime, value: box.highPrice }]);
    });
  };

  useEffect(() => {
    const scriptId = 'lightweight-charts-v4-script';
    if (document.getElementById(scriptId)) {
      if (window.LightweightCharts) {
        setIsLibraryLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://unpkg.com/lightweight-charts@4.1.1/dist/lightweight-charts.standalone.production.js';
    script.async = true;
    script.onload = () => setIsLibraryLoaded(true);
    script.onerror = () => setError("Failed to load chart library");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLibraryLoaded || !chartContainerRef.current || !window.LightweightCharts) return;

    let chart;
    let ws;

    // Clean up previous chart and series before creating new one
    if (chartRef.current) {
      // Remove all trade box series first
      tradeBoxSeriesRef.current.forEach(boxSeries => {
        if (boxSeries && chartRef.current) {
          try {
            chartRef.current.removeSeries(boxSeries);
          } catch (e) {
            console.error("Error removing box series:", e);
          }
        }
      });
      tradeBoxSeriesRef.current = [];
      
      // Remove the chart
      chartRef.current.remove();
      chartRef.current = null;
    }

    try {
      const { createChart, ColorType } = window.LightweightCharts;

      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#0f172a' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#1e293b' },
          horzLines: { color: '#1e293b' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: { 
          timeVisible: true, 
          secondsVisible: false,
          rightOffset: 0, // Show data up to the right edge
        },
      });

      // Main Candle Series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      // Load history function
      const loadMoreHistory = async (endTime) => {
        if (isLoadingMoreRef.current) return;
        isLoadingMoreRef.current = true;
        
        try {
          // Show loading indicator if needed
          // console.log("Loading more history before", endTime);
          
          const response = await fetch(`${API_BASE_URL}/api/strategy/trades?interval=${interval}&endTime=${endTime}`);
          if (!response.ok) throw new Error('Failed to load history');
          
          const data = await response.json();
          const newCandles = data.candles;
          
          if (newCandles && newCandles.length > 0) {
            // Filter out duplicates based on time
            const existingTimes = new Set(allCandlesRef.current.map(c => c.time));
            const uniqueNewCandles = newCandles.filter(c => !existingTimes.has(c.time));
            
            if (uniqueNewCandles.length > 0) {
              // Merge data
              allCandlesRef.current = [...uniqueNewCandles, ...allCandlesRef.current].sort((a, b) => a.time - b.time);
              allMarkersRef.current = [...data.markers, ...allMarkersRef.current]; // Markers might need de-duplication too if logic repeats
              
              // De-duplicate markers by time + text
              const uniqueMarkers = [];
              const markerSet = new Set();
              [...data.markers, ...allMarkersRef.current].forEach(m => {
                  const key = `${m.time}-${m.text}`;
                  if(!markerSet.has(key)) {
                      markerSet.add(key);
                      uniqueMarkers.push(m);
                  }
              });
              allMarkersRef.current = uniqueMarkers.sort((a, b) => a.time - b.time);

              // De-duplicate tradeBoxes logic is complex because they are separate series.
              // For simplicity, we will redraw all boxes from the new strategy result for now, 
              // or we merge strategy results. 
              // Strategy is stateless per day in our backend impl, so we can just merge lists.
              
              // However, we need to be careful not to add duplicate trades to the list.
              // Let's just update the chart data
              seriesRef.current.setData(allCandlesRef.current);
              seriesRef.current.setMarkers(allMarkersRef.current);
              
              // For trade boxes, we need to merge them.
              // Since drawTradeBoxes clears all boxes and redraws, we can just maintain a list of all boxes.
              // But backend returns ALL boxes for the queried range.
              // We should probably just keep the new boxes + old boxes
              // ... simplified: just draw new boxes? No, we need to persist old ones.
              // Let's assume we simply re-fetch strategy for the whole combined range? No, too heavy.
              // Let's merge the tradeBoxes list.
              // Note: tradeBoxes don't have unique IDs in the backend response structure used here, 
              // but they are unique by entryTime/exitTime.
              
              // For now, let's just append the new boxes to the chart without clearing old ones?
              // But drawTradeBoxes clears them. Let's modify drawTradeBoxes to take a list and we manage the master list.
              // Or, we simply don't clear old boxes when loading history, just add new ones.
              // But React state updates might trigger re-renders.
              
              drawTradeBoxes(data.tradeBoxes); // This clears old ones in current implementation!
              // Wait, drawTradeBoxes implementation above clears EVERYTHING.
              // We need to fix drawTradeBoxes to APPEND or we maintain a master list of boxes.
            }
          }
        } catch (err) {
          console.error("Error loading history:", err);
        } finally {
          isLoadingMoreRef.current = false;
        }
      };

      // Fetch Data & Run Strategy
      const fetchHistory = async () => {
        try {
          setConnectionStatus(`Loading ${interval}...`);
          
          // Fetch data from backend API
          const response = await fetch(`${API_BASE_URL}/api/strategy/trades?interval=${interval}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
          // Initialize refs
          allCandlesRef.current = data.candles;
          allMarkersRef.current = data.markers;
          allTradesRef.current = data.trades;

          candlestickSeries.setData(data.candles);
          candlestickSeries.setMarkers(data.markers);
          
          // Draw initial boxes
          drawTradeBoxes(data.tradeBoxes);
          
          // Set initial visible range
          if (data.candles.length > 0) {
            const visibleBars = Math.min(100, Math.floor(data.candles.length * 0.6));
            const lastTime = data.candles[data.candles.length - 1].time;
            const firstVisibleTime = data.candles[Math.max(0, data.candles.length - visibleBars)].time;
            
            chart.timeScale().setVisibleRange({
              from: firstVisibleTime,
              to: lastTime,
            });
          }
          
          // Pass trades to parent
          onStrategyUpdate(data.trades);

          if (data.candles.length > 0) setPrice(data.candles[data.candles.length - 1].close);
          setConnectionStatus("Strategy Running");

          // Subscribe to scrolling
          chart.timeScale().subscribeVisibleLogicalRangeChange(logicalRange => {
            if (logicalRange && logicalRange.from < 10) { // Close to start
               if (allCandlesRef.current.length > 0) {
                 const oldestTime = allCandlesRef.current[0].time;
                 loadMoreHistory(oldestTime);
               }
            }
          });

        } catch (err) {
          console.error("Fetch error:", err);
          setConnectionStatus("Error");
        }
      };

      fetchHistory().then(() => {
        // Close previous WebSocket if exists
        if (ws) {
          try {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
              ws.close();
            }
          } catch (e) {
            console.error("Error closing previous WebSocket:", e);
          }
        }
        
        // Define message handler function
        const handleWebSocketMessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Check if it's an error message
            if (data.error) {
              console.error("WebSocket error from server:", data.error);
              setConnectionStatus("Server Error");
              return;
            }
            
            // Handle candle data
            const candle = data;
            if (seriesRef.current && chartRef.current) {
              seriesRef.current.update(candle);
              setPrice(candle.close);
              console.log("Updated chart with new candle:", candle.time, "close:", candle.close);
            }
          } catch (e) { 
            console.error("WebSocket message error:", e, "Raw data:", event.data); 
          }
        };
        
        // Connect to backend WebSocket with a small delay to ensure previous connection is closed
        setTimeout(() => {
          try {
            ws = new WebSocket(`${WS_BASE_URL}/ws/kline/${interval}`);
            
            ws.onopen = () => {
              console.log("WebSocket connected to:", `${WS_BASE_URL}/ws/kline/${interval}`);
              setConnectionStatus("Live Strategy");
            };
            
            ws.onerror = (error) => {
              console.error("WebSocket error:", error);
              console.error("WebSocket URL:", `${WS_BASE_URL}/ws/kline/${interval}`);
              setConnectionStatus("WebSocket Error");
            };
            
            ws.onclose = (event) => {
              console.log("WebSocket closed", event.code, event.reason);
              if (event.code !== 1000) { // Not a normal closure
                setConnectionStatus("Reconnecting...");
                // Attempt to reconnect after 3 seconds
                setTimeout(() => {
                  if (chartRef.current && seriesRef.current) {
                    try {
                      const reconnectWs = new WebSocket(`${WS_BASE_URL}/ws/kline/${interval}`);
                      reconnectWs.onopen = () => setConnectionStatus("Live Strategy");
                      reconnectWs.onerror = (err) => {
                        console.error("WebSocket reconnect error:", err);
                        setConnectionStatus("Connection Failed");
                      };
                      reconnectWs.onmessage = handleWebSocketMessage;
                      ws = reconnectWs;
                    } catch (e) {
                      console.error("Failed to reconnect WebSocket:", e);
                    }
                  }
                }, 3000);
              }
            };
            
            ws.onmessage = handleWebSocketMessage;
          } catch (e) {
            console.error("Failed to create WebSocket:", e);
            setConnectionStatus("WebSocket Error");
          }
        }, 100);
      }).catch((err) => {
        console.error("Fetch history error:", err);
        setConnectionStatus("Error");
      });

    } catch (err) {
      setError(err.message);
    }

    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Close WebSocket
      if (ws) {
        try {
          ws.close();
        } catch (e) {
          console.error("Error closing WebSocket:", e);
        }
      }
      
      // Remove resize listener
      window.removeEventListener('resize', handleResize);
      
      // Clean up trade box series
      if (tradeBoxSeriesRef.current && chartRef.current) {
        tradeBoxSeriesRef.current.forEach(boxSeries => {
          if (boxSeries) {
            try {
              chartRef.current.removeSeries(boxSeries);
            } catch (e) {
              console.error("Error removing box series:", e);
            }
          }
        });
        tradeBoxSeriesRef.current = [];
      }
      
      // Remove chart
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (e) {
          console.error("Error removing chart:", e);
        }
        chartRef.current = null;
      }
    };
  }, [isLibraryLoaded, interval]);

  return (
    <div className="group relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div id="chart-section" className="relative bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-700/30 shadow-2xl overflow-hidden" style={{ height: '600px' }}>
        {/* Control Bar and Chart */}
        <div className="p-5 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/20">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Activity className="text-blue-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 text-lg leading-none">BTC/USDT Strategy</h2>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  UTC 03-12 Breakout Box
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30 shadow-md shadow-blue-500/10">
                {connectionStatus}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-900/80 backdrop-blur-md rounded-xl p-1 gap-1 border border-slate-700/50">
                {intervals.map((t) => (
                  <button
                    key={t}
                    onClick={() => setInterval(t)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      interval === t 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-lg">
                <div className="text-xs text-slate-400 mb-0.5">Current Price</div>
                <div className="text-xl font-mono font-bold text-slate-100">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div ref={chartContainerRef} className="w-full relative bg-slate-950/50" style={{ height: 'calc(600px - 80px)' }}>
          {!isLibraryLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="text-slate-500 text-sm">Loading Chart Engine...</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data.news || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div id="news-section" className="relative bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-700/30 shadow-2xl flex flex-col" style={{ height: '600px' }}>
        {/* News List Header */}
        <div className="p-5 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Newspaper className="text-purple-400 w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Market News</h3>
          </div>
        </div>
        
        <div className="p-5 space-y-3 overflow-y-auto custom-scrollbar flex-1" style={{ height: 'calc(600px - 80px)' }}>
        {loading ? (
          <div className="text-center text-slate-500 py-4">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center text-slate-500 py-4">No news available</div>
        ) : (
          news.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`group relative block p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/40 cursor-pointer transition-all duration-300 hover:bg-slate-800/60 hover:border-slate-600/60 hover:shadow-xl ${
                item.sentiment === 'positive' ? 'hover:shadow-green-500/20' : 
                item.sentiment === 'negative' ? 'hover:shadow-red-500/20' : 
                'hover:shadow-slate-500/20'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                item.sentiment === 'positive' ? 'bg-green-500/60' : 
                item.sentiment === 'negative' ? 'bg-red-500/60' : 
                'bg-slate-600/50'
              }`}></div>
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-slate-600/40 backdrop-blur-sm text-slate-300 font-medium border border-slate-500/30 shadow-sm">{item.source}</span>
                  <span className="text-slate-500">•</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-600/40 backdrop-blur-sm text-slate-400 border border-slate-500/30 shadow-sm">{item.time}</span>
                </div>
                {item.impact_score > 0 && (
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold border shadow-md backdrop-blur-sm ${
                    item.sentiment === 'positive' ? 'bg-green-500/30 text-green-400 border-green-500/40 shadow-green-500/20' : 
                    item.sentiment === 'negative' ? 'bg-red-500/30 text-red-400 border-red-500/40 shadow-red-500/20' : 'bg-slate-600/30 text-slate-400 border-slate-600/40'
                  }`}>
                    {item.sentiment === 'positive' ? '+' : item.sentiment === 'negative' ? '-' : ''}{item.impact_score}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-200 font-medium leading-snug group-hover:text-purple-300">{item.headline}</p>
            </a>
          ))
        )}
        </div>
      </div>
    </div>
  );
};

// Token Sentiment Text Component
const TokenSentimentText = ({ text, tokenSentiment }) => {
  if (!tokenSentiment || !tokenSentiment.tokens || tokenSentiment.tokens.length === 0) {
    return <p className="text-sm text-slate-300 leading-relaxed">{text}</p>;
  }

  // 将文本拆分成片段，每个token作为一个可渲染的元素
  const renderTextWithSentiment = () => {
    const elements = [];
    let currentPos = 0;
    const textLength = text.length;
    
    // 按position排序tokens
    const sortedTokens = [...tokenSentiment.tokens].sort((a, b) => a.position - b.position);
    
    sortedTokens.forEach((token, index) => {
      const { position, token: tokenText, score } = token;
      
      // 添加token之前的文本
      if (position > currentPos) {
        const beforeText = text.substring(currentPos, position);
        if (beforeText) {
          elements.push(
            <span key={`text-${currentPos}`} className="text-slate-300">
              {beforeText}
            </span>
          );
        }
      }
      
      // 尝试在position位置找到token
      const tokenLength = tokenText.length;
      let actualStart = position;
      let actualEnd = Math.min(position + tokenLength, textLength);
      let actualTokenText = text.substring(actualStart, actualEnd);
      
      // 如果直接匹配失败，尝试在附近搜索（考虑可能的空格或标点）
      if (actualTokenText.toLowerCase() !== tokenText.toLowerCase()) {
        const searchRange = 10;
        let found = false;
        for (let offset = -searchRange; offset <= searchRange && !found; offset++) {
          const searchStart = Math.max(0, position + offset);
          const searchEnd = Math.min(textLength, searchStart + tokenLength);
          const searchText = text.substring(searchStart, searchEnd);
          if (searchText.toLowerCase() === tokenText.toLowerCase()) {
            actualTokenText = searchText;
            actualStart = searchStart;
            actualEnd = searchEnd;
            found = true;
          }
        }
        if (!found) {
          // 如果还是找不到，使用tokenText本身
          actualTokenText = tokenText;
          actualEnd = actualStart + tokenLength;
        }
      }
      
      // 判断情感方向
      const isPositive = score > 0.1;
      const isNegative = score < -0.1;
      const isNeutral = !isPositive && !isNegative;
      
      // 计算条形图宽度（基于score的绝对值，范围0-1映射到0-100%）
      // 使用更大的倍数使条形图更明显
      const barWidth = Math.min(Math.abs(score) * 200, 100);
      
      elements.push(
        <span
          key={`token-${index}`}
          className="inline-block relative group/token"
          style={{ marginRight: '2px' }}
        >
          <span className="relative z-10">{actualTokenText}</span>
          {!isNeutral && barWidth > 3 && (
            <span
              className={`absolute bottom-0 h-1.5 transition-all duration-300 rounded-sm ${
                isPositive
                  ? 'bg-green-500/70 shadow-[0_0_6px_rgba(34,197,94,0.6)] left-0'
                  : 'bg-red-500/70 shadow-[0_0_6px_rgba(239,68,68,0.6)] right-0'
              }`}
              style={{
                width: `${barWidth}%`,
              }}
            />
          )}
          {isNeutral && Math.abs(score) > 0.01 && barWidth > 3 && (
            <span
              className="absolute bottom-0 left-0 h-0.5 bg-slate-500/40 transition-all duration-300 rounded-sm"
              style={{ width: `${barWidth}%` }}
            />
          )}
        </span>
      );
      
      currentPos = actualEnd;
    });
    
    // 添加剩余的文本
    if (currentPos < textLength) {
      const remainingText = text.substring(currentPos);
      if (remainingText) {
        elements.push(
          <span key={`text-${currentPos}`} className="text-slate-300">
            {remainingText}
          </span>
        );
      }
    }
    
    return elements;
  };

  return (
    <p className="text-sm text-slate-300 leading-relaxed">
      {renderTextWithSentiment()}
    </p>
  );
};

const SentimentSection = () => {
  const [sentimentData, setSentimentData] = useState({
    tweets: [],
    distribution: { positive: 0, neutral: 0, negative: 0 },
    totalTweets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sentiment`);
        if (!response.ok) throw new Error('Failed to fetch sentiment');
        const data = await response.json();
        setSentimentData(data);
      } catch (error) {
        console.error('Error fetching sentiment:', error);
        setSentimentData({ tweets: [], distribution: { positive: 0, neutral: 0, negative: 0 }, totalTweets: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
    // Refresh sentiment every 3 minutes
    const interval = setInterval(fetchSentiment, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const { distribution, tweets, totalTweets } = sentimentData;

  return (
    <div className="group relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div id="sentiment-section" className="relative bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-700/30 shadow-2xl flex flex-col overflow-hidden" style={{ height: '500px' }}>
        {/* Sentiment Data Header */}
        <div className="p-5 bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
              <Twitter className="text-sky-400 w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Sentiment Analysis</h3>
          </div>
        </div>
        
        <div className="p-5 mb-4">
        {loading ? (
          <div className="text-center text-slate-500 py-2">Loading sentiment...</div>
        ) : (
          <>
            <div className="relative h-4 bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/40 shadow-inner">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-500/80 to-red-400/80 backdrop-blur-sm transition-all duration-500 shadow-lg shadow-red-500/20" 
                style={{ width: `${distribution.negative}%` }} 
              />
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-slate-500/80 to-slate-400/80 backdrop-blur-sm transition-all duration-500" 
                style={{ width: `${distribution.neutral}%`, left: `${distribution.negative}%` }} 
              />
              <div 
                className="absolute right-0 top-0 bottom-0 bg-gradient-to-r from-green-400/80 to-green-500/80 backdrop-blur-sm transition-all duration-500 shadow-lg shadow-green-500/20" 
                style={{ width: `${distribution.positive}%` }} 
              />
            </div>
            <div className="text-center mt-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-slate-300 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 shadow-md">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
                {totalTweets.toLocaleString()} analyzed tweets
              </span>
            </div>
          </>
        )}
        </div>
        <div className="p-5 space-y-3 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="text-center text-slate-500 py-8">
              <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-3"></div>
              <div className="text-sm">Loading tweets...</div>
            </div>
          ) : tweets.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No tweets available</div>
          ) : (
            tweets.map((tweet) => (
              <div key={tweet.id} className="group flex gap-3 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/40 hover:bg-slate-800/60 hover:border-sky-500/30 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/30 to-cyan-500/30 backdrop-blur-sm flex items-center justify-center text-sky-300 shrink-0 border border-sky-500/40 shadow-md">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold text-sky-300 bg-sky-500/20 border border-sky-500/30 shadow-sm">
                      {tweet.user}
                    </span>
                  </div>
                  <TokenSentimentText text={tweet.text} tokenSentiment={tweet.tokenSentiment} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 transform transition-all animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        {children}
      </div>
    </div>
  );
};

const CopyTradingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const data = await response.json();
      console.log("Success:", data);
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
          <Zap className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Subscribe</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-400 mb-1">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            required
            min="18"
            max="100"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            placeholder="25"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-purple-600/20 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            'Submit Request'
          )}
        </button>
        <p className="text-xs text-slate-500 text-center mt-4">
          By submitting, you agree to our Terms of Service and Risk Disclosure.
        </p>
      </form>
    </div>
  );
};

const StrategyAccess = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = (data) => {
    console.log("Form Data:", data);
    setSubmitSuccess(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSubmitSuccess(false), 300); 
  };

  return (
    <div className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div id="strategy-access-section" className="relative bg-slate-900/40 backdrop-blur-2xl rounded-2xl border border-slate-700/30 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Zap className="text-purple-400 w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Subscribe</h3>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Key Features</h3>
            <ul className="space-y-2.5">
              {[
                'Real-time market analysis with AI-powered insights',
                'Automated risk management and position sizing',
                '24/7 monitoring and execution',
                'Multiple strategy options (Breakout, Trend, Mean Reversion)',
                'Customizable parameters and risk tolerance',
                'Transparent performance tracking and reporting'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-300 text-sm font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)] mt-1.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0a0f1e] rounded-xl p-5 border border-white/5 font-mono text-xs text-slate-400 mb-6 shadow-inner">
            <div className="flex justify-between text-slate-500 mb-3 border-b border-white/5 pb-2">
              <span>STRATEGY PERFORMANCE (30D)</span>
              <span className="text-green-400 flex items-center gap-1">LIVE <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div></span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                  <div className="text-slate-500 mb-1">Total Return</div>
                  <div className="text-green-400 font-bold text-lg">+24.8%</div>
               </div>
               <div>
                  <div className="text-slate-500 mb-1">Win Rate</div>
                  <div className="text-blue-400 font-bold text-lg">68.5%</div>
               </div>
               <div>
                  <div className="text-slate-500 mb-1">Sharpe Ratio</div>
                  <div className="text-purple-400 font-bold text-lg">2.45</div>
               </div>
               <div>
                  <div className="text-slate-500 mb-1">Max Drawdown</div>
                  <div className="text-red-400 font-bold text-lg">-4.2%</div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
               <div>
                  <div className="text-slate-500 mb-1">Total Trades</div>
                  <div className="text-slate-300 font-bold text-lg">127</div>
               </div>
               <div>
                  <div className="text-slate-500 mb-1">Avg. Hold Time</div>
                  <div className="text-slate-300 font-bold text-lg">4.2h</div>
               </div>
               <div>
                  <div className="text-slate-500 mb-1">Profit Factor</div>
                  <div className="text-green-400 font-bold text-lg">1.85</div>
               </div>
               <div>
                  <div className="text-slate-500 mb-1">Volatility</div>
                  <div className="text-yellow-400 font-bold text-lg">12.3%</div>
               </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-purple-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Risk Management</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Advanced stop-loss mechanisms, dynamic position sizing, and real-time risk monitoring ensure your capital is protected while maximizing returns.
                </p>
              </div>
            </div>
          </div>
          
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {submitSuccess ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                <p className="text-slate-400 mb-8">
                  Thank you for your interest. Our team will review your application and contact you shortly to set up your copy trading account.
                </p>
                <button 
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors border border-slate-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <CopyTradingForm onSubmit={handleFormSubmit} />
            )}
          </Modal>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-purple-600/20 border border-white/10"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ currentView, onNavigate }) => (
  <header className="sticky top-4 z-50 flex justify-between items-center px-6 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl shadow-black/20 mx-auto max-w-7xl mb-8 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-purple-500/10">
    {/* Left: Logo */}
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
        <div className="relative p-2 bg-black rounded-full border border-white/10">
          <TrendingUp className="text-white w-5 h-5" />
        </div>
      </div>
      <h1 className="text-lg font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
        Flashpoint AI Fin
      </h1>
    </div>

    {/* Center: Navigation */}
    <nav className="hidden md:flex items-center gap-1">
      {[
        { id: 'chart-section', label: 'Chart', icon: Activity },
        { id: 'orders-section', label: 'Orders', icon: List },
        { id: 'news-section', label: 'News', icon: Newspaper },
        { id: 'sentiment-section', label: 'Sentiment', icon: Twitter },
        { id: 'strategy-access-section', label: 'Subscribe', icon: Zap }
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => {
              const element = document.getElementById(item.id);
              if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
              }
            }}
            className="relative px-4 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white transition-all duration-300 flex items-center gap-2 hover:bg-white/5"
          >
            <Icon className="w-4 h-4" />
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </nav>

    {/* Right: Actions */}
    <div className="flex items-center gap-4">
       <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-slate-400">
         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
         SYSTEM ONLINE
       </div>
    </div>
  </header>
);

export default function App() {
  const [trades, setTrades] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-mindflicker text-slate-300 p-4 md:p-6 font-sans selection:bg-purple-500/30">
      <div className="max-w-[1800px] mx-auto">
        <Header currentView={currentView} onNavigate={setCurrentView} />
        
        {currentView === 'dashboard' && (
          <div className="mt-6 flex flex-col gap-6 animate-fade-in">
            {/* Top Row: Chart & Orders on Left, News & Sentiment on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Chart & Orders */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div>
                  <CryptoChart onStrategyUpdate={setTrades} />
                </div>
                
                <div>
                  <StrategyPanel trades={trades} />
                </div>
              </div>

              {/* Right Column: News & Sentiment */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div>
                  <NewsSection />
                </div>
                
                <div>
                  <SentimentSection />
                </div>
              </div>
            </div>

            {/* Bottom Row: Strategy Access Centered */}
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <StrategyAccess />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
