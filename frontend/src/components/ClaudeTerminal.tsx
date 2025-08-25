import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '../stores/authStore'
import 'xterm/css/xterm.css'

export default function ClaudeTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminal, setTerminal] = useState<Terminal | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user, distribution } = useAuthStore()

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        black: '#0d1117',
        red: '#ff7b72',
        green: '#7ee787',
        yellow: '#ffa657',
        blue: '#79c0ff',
        magenta: '#d2a8ff',
        cyan: '#7dddd8',
        white: '#c9d1d9',
        brightBlack: '#6e7681',
        brightRed: '#ff8e8e',
        brightGreen: '#9aff9a',
        brightYellow: '#ffc777',
        brightBlue: '#99d1ff',
        brightMagenta: '#e1c8ff',
        brightCyan: '#9de8e3',
        brightWhite: '#ffffff'
      }
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(terminalRef.current)
    fitAddon.fit()

    // Welcome message
    term.writeln('Welcome to WayneOS - AI-Native Operating System')
    term.writeln(`Distribution: ${distribution}`)
    term.writeln('Performance: 313,150 ops/sec')
    term.writeln('')
    term.writeln('Type your commands in natural language:')
    term.writeln('Examples:')
    term.writeln('  - "Read my work emails and create a task list"')
    term.writeln('  - "Open Firefox and go to wayneia.com"')
    term.writeln('  - "Optimize my PC for gaming"')
    term.writeln('')
    term.write('wayneos> ')

    // Connect to backend
    const ws = io(import.meta.env.VITE_WS_URL || 'ws://localhost:8000', {
      auth: {
        token: user?.uid,
        distribution
      }
    })

    ws.on('connect', () => {
      console.log('Connected to WayneOS backend')
    })

    ws.on('output', (data: string) => {
      term.write(data)
    })

    ws.on('claude-response', (response: string) => {
      term.writeln('')
      term.writeln(response)
      term.write('wayneos> ')
    })

    // Handle terminal input
    let commandBuffer = ''
    term.onData((data) => {
      if (data === '\r') { // Enter key
        if (commandBuffer.trim()) {
          term.writeln('')
          ws.emit('command', commandBuffer)
          commandBuffer = ''
        } else {
          term.writeln('')
          term.write('wayneos> ')
        }
      } else if (data === '\u007f') { // Backspace
        if (commandBuffer.length > 0) {
          commandBuffer = commandBuffer.slice(0, -1)
          term.write('\b \b')
        }
      } else if (data >= ' ') { // Printable characters
        commandBuffer += data
        term.write(data)
      }
    })

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleResize)

    setTerminal(term)
    setSocket(ws)

    return () => {
      window.removeEventListener('resize', handleResize)
      ws.close()
      term.dispose()
    }
  }, [user, distribution])

  return <div ref={terminalRef} className="h-full w-full" />
}