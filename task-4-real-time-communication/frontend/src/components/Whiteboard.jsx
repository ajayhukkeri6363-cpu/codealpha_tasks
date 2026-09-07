import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  Square,
  Circle,
  Minus,
  Trash2,
  Download,
  X,
  Palette,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const COLORS = [
  '#ffffff', // White
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
];

export default function Whiteboard({ roomId, onClose }) {
  const { socket } = useSocket();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser' | 'line' | 'rect' | 'circle'
  const [color, setColor] = useState('#6366f1');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Socket listeners for remote drawing
    if (socket) {
      const handleRemoteStroke = (stroke) => {
        drawRemoteStroke(ctx, stroke);
      };

      const handleRemoteClear = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };

      const handleWhiteboardHistory = (history) => {
        history.forEach((stroke) => drawRemoteStroke(ctx, stroke));
      };

      socket.on('draw_stroke_remote', handleRemoteStroke);
      socket.on('clear_whiteboard_remote', handleRemoteClear);
      socket.on('whiteboard_history', handleWhiteboardHistory);

      return () => {
        socket.off('draw_stroke_remote', handleRemoteStroke);
        socket.off('clear_whiteboard_remote', handleRemoteClear);
        socket.off('whiteboard_history', handleWhiteboardHistory);
      };
    }
  }, [socket]);

  const drawRemoteStroke = (ctx, stroke) => {
    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();

    if (stroke.tool === 'pen' || stroke.tool === 'eraser') {
      ctx.moveTo(stroke.prevX, stroke.prevY);
      ctx.lineTo(stroke.currX, stroke.currY);
      ctx.stroke();
    } else if (stroke.tool === 'line') {
      ctx.moveTo(stroke.prevX, stroke.prevY);
      ctx.lineTo(stroke.currX, stroke.currY);
      ctx.stroke();
    } else if (stroke.tool === 'rect') {
      ctx.strokeRect(stroke.prevX, stroke.prevY, stroke.currX - stroke.prevX, stroke.currY - stroke.prevY);
    } else if (stroke.tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(stroke.currX - stroke.prevX, 2) + Math.pow(stroke.currY - stroke.prevY, 2)
      );
      ctx.arc(stroke.prevX, stroke.prevY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCanvasCoords(e);

    const activeColor = tool === 'eraser' ? '#0f172a' : color;
    const activeWidth = tool === 'eraser' ? strokeWidth * 4 : strokeWidth;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = activeWidth;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      if (socket) {
        socket.emit('draw_stroke', {
          roomId,
          stroke: {
            prevX: startPos.x,
            prevY: startPos.y,
            currX: coords.x,
            currY: coords.y,
            color: activeColor,
            width: activeWidth,
            tool,
          },
        });
      }

      setStartPos(coords);
    } else {
      // Shape drawing with snapshot restore for preview
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = activeWidth;
      ctx.beginPath();

      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2)
        );
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool !== 'pen' && tool !== 'eraser') {
      const coords = getCanvasCoords(e);
      if (socket) {
        socket.emit('draw_stroke', {
          roomId,
          stroke: {
            prevX: startPos.x,
            prevY: startPos.y,
            currX: coords.x,
            currY: coords.y,
            color,
            width: strokeWidth,
            tool,
          },
        });
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (socket) {
      socket.emit('clear_whiteboard', { roomId });
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `nexus-whiteboard-${roomId}.png`;
    link.href = image;
    link.click();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Whiteboard Floating Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-2 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-slate-800 shadow-2xl">
        {/* Tool selectors */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-800">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-xl transition-all ${
              tool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Pencil"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-xl transition-all ${
              tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('line')}
            className={`p-2 rounded-xl transition-all ${
              tool === 'line' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Line"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-2 rounded-xl transition-all ${
              tool === 'rect' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Rectangle"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded-xl transition-all ${
              tool === 'circle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Circle"
          >
            <Circle className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5 px-2 border-r border-slate-800">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                if (tool === 'eraser') setTool('pen');
              }}
              className={`w-5 h-5 rounded-full transition-transform ${
                color === c && tool !== 'eraser' ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Stroke Width Slider */}
        <div className="flex items-center gap-2 px-2 border-r border-slate-800">
          <input
            type="range"
            min="1"
            max="12"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            title="Stroke Width"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-1">
          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Clear Board"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-slate-400 hover:text-emerald-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Export Image"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Close Whiteboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="flex-1 w-full h-full cursor-crosshair relative">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full block bg-slate-950"
        />
      </div>
    </div>
  );
}