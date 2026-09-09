import { useState } from 'react';
import { Zap, Gauge, Activity, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SpeedTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'download' | 'upload' | 'ping'>('idle');
  const [history, setHistory] = useState<Array<{ download: number; upload: number; ping: number }>>([]);

  const simulateSpeedTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);

    // Simulate ping test (0-3 seconds)
    setStage('ping');
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    const simulatedPing = Math.floor(Math.random() * 50) + 5;
    setPing(simulatedPing);

    // Simulate download test (3-6 seconds)
    setStage('download');
    for (let i = 100; i <= 200; i += 20) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    const simulatedDownload = Math.floor(Math.random() * 400) + 50;
    setDownloadSpeed(simulatedDownload);

    // Simulate upload test (6-9 seconds)
    setStage('upload');
    for (let i = 200; i <= 300; i += 20) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    const simulatedUpload = Math.floor(Math.random() * 150) + 20;
    setUploadSpeed(simulatedUpload);

    // Add to history
    setHistory(prev => [...prev, {
      download: simulatedDownload,
      upload: simulatedUpload,
      ping: simulatedPing
    }].slice(-5)); // Keep last 5 results

    setStage('idle');
    setIsRunning(false);
    setProgress(0);
  };

  const handleReset = () => {
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setProgress(0);
    setStage('idle');
    setHistory([]);
  };

  const getProgressPercentage = () => {
    return Math.min((progress / 300) * 100, 100);
  };

  const getSpeedColor = (speed: number) => {
    if (speed >= 100) return 'text-green-500';
    if (speed >= 50) return 'text-blue-500';
    if (speed >= 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStageLabel = () => {
    switch (stage) {
      case 'ping': return 'Testing Ping...';
      case 'download': return 'Testing Download...';
      case 'upload': return 'Testing Upload...';
      default: return 'Ready';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">SpeedTest</h1>
          </div>
          <p className="text-slate-300 text-sm">Check your internet connection</p>
        </div>

        {/* Main Speed Display */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6 p-8">
          <div className="text-center">
            {/* Current Speed or Idle State */}
            {isRunning ? (
              <div>
                <div className="text-5xl font-bold text-blue-400 mb-2">
                  {Math.floor((progress / 300) * 100)}%
                </div>
                <p className="text-slate-300 text-lg mb-4">{getStageLabel()}</p>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            ) : downloadSpeed !== null ? (
              <div>
                <div className={`text-5xl font-bold mb-2 ${getSpeedColor(downloadSpeed)}`}>
                  {downloadSpeed}
                </div>
                <p className="text-slate-300 text-sm">Mbps Download</p>
              </div>
            ) : (
              <div>
                <Gauge className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Tap Start to begin</p>
              </div>
            )}
          </div>
        </Card>

        {/* Results Grid */}
        {downloadSpeed !== null && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Download */}
            <Card className="bg-slate-800/50 border-slate-700 p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-slate-400">Download</p>
              </div>
              <p className={`text-2xl font-bold ${getSpeedColor(downloadSpeed)}`}>
                {downloadSpeed}
              </p>
              <p className="text-xs text-slate-500">Mbps</p>
            </Card>

            {/* Upload */}
            <Card className="bg-slate-800/50 border-slate-700 p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <p className="text-xs text-slate-400">Upload</p>
              </div>
              <p className={`text-2xl font-bold ${getSpeedColor(uploadSpeed || 0)}`}>
                {uploadSpeed}
              </p>
              <p className="text-xs text-slate-500">Mbps</p>
            </Card>

            {/* Ping */}
            <Card className="bg-slate-800/50 border-slate-700 p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Gauge className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-slate-400">Ping</p>
              </div>
              <p className={`text-2xl font-bold ${ping && ping < 30 ? 'text-green-500' : ping && ping < 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                {ping}
              </p>
              <p className="text-xs text-slate-500">ms</p>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={simulateSpeedTest}
            disabled={isRunning}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold h-12 text-lg"
          >
            {isRunning ? 'Testing...' : 'Start Test'}
          </Button>
          {downloadSpeed !== null && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white h-12 w-12 p-0"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Tests</h3>
            <div className="space-y-2">
              {history.map((result, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-slate-400 bg-slate-700/30 p-2 rounded">
                  <span>Test {history.length - idx}</span>
                  <div className="flex gap-3">
                    <span className="text-blue-400">{result.download}M</span>
                    <span className="text-green-400">{result.upload}M</span>
                    <span className="text-purple-400">{result.ping}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>🚀 Fast, accurate speed testing</p>
          <p className="mt-1">Results are simulated for demo purposes</p>
        </div>
      </div>
    </div>
  );
}
