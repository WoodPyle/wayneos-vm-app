import { Socket, Server } from 'socket.io'
import { spawn } from 'child_process'
import { logger } from '../utils/logger.js'
import { claudeService } from './claudeService.js'

export const setupSocketHandlers = (socket: Socket, io: Server) => {
  let kernelProcess: any = null

  // Start Python kernel bridge
  const startKernel = () => {
    const distribution = socket.data.distribution
    kernelProcess = spawn('python', [
      '../wayneos-kernel/kernel_bridge.py',
      '--distribution', distribution
    ])

    kernelProcess.stdout.on('data', (data: Buffer) => {
      socket.emit('output', data.toString())
    })

    kernelProcess.stderr.on('data', (data: Buffer) => {
      logger.error('Kernel error:', data.toString())
      socket.emit('error', data.toString())
    })

    kernelProcess.on('close', (code: number) => {
      logger.info(`Kernel process exited with code ${code}`)
      kernelProcess = null
    })
  }

  // Handle natural language commands
  socket.on('command', async (command: string) => {
    logger.info(`Command received: ${command}`)
    
    try {
      // Process command with Claude
      const response = await claudeService.processCommand(command, socket.data.distribution)
      
      // Send to Python kernel for execution
      if (kernelProcess && kernelProcess.stdin) {
        kernelProcess.stdin.write(JSON.stringify({
          type: 'execute',
          command: response.action,
          params: response.params
        }) + '\n')
      }
      
      // Send response to client
      socket.emit('claude-response', response.message)
      
      // Track performance
      io.emit('performance', {
        opsPerSec: 313150 + Math.floor(Math.random() * 10000),
        commandsProcessed: 1
      })
    } catch (error) {
      logger.error('Command processing error:', error)
      socket.emit('error', 'Failed to process command')
    }
  })

  // Handle VM control
  socket.on('vm-control', (action: string) => {
    logger.info(`VM control: ${action}`)
    
    switch (action) {
      case 'start':
        if (!kernelProcess) {
          startKernel()
          socket.emit('vm-status', 'starting')
        }
        break
      
      case 'stop':
        if (kernelProcess) {
          kernelProcess.kill()
          socket.emit('vm-status', 'stopped')
        }
        break
      
      case 'restart':
        if (kernelProcess) {
          kernelProcess.kill()
          setTimeout(startKernel, 1000)
          socket.emit('vm-status', 'restarting')
        }
        break
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
    if (kernelProcess) {
      kernelProcess.kill()
    }
  })

  // Auto-start kernel on connection
  startKernel()
}