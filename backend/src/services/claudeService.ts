import axios from 'axios'
import { logger } from '../utils/logger.js'

interface ClaudeResponse {
  action: string
  params: any
  message: string
}

class ClaudeService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || ''
    this.baseUrl = 'https://api.anthropic.com/v1'
  }

  async processCommand(command: string, distribution: string): Promise<ClaudeResponse> {
    try {
      const systemPrompt = this.getSystemPrompt(distribution)
      
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: command
          }],
          system: systemPrompt
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        }
      )

      // Parse Claude's response
      const content = response.data.content[0].text
      const parsed = this.parseResponse(content)
      
      return parsed
    } catch (error) {
      logger.error('Claude API error:', error)
      return {
        action: 'error',
        params: {},
        message: 'I encountered an error processing your request. Please try again.'
      }
    }
  }

  private getSystemPrompt(distribution: string): string {
    const basePrompt = `You are the WayneOS kernel, an AI-native operating system with 313,150 ops/sec performance.
You process natural language commands and convert them into system actions.
Current distribution: ${distribution}

When the user gives a command, respond with a JSON object containing:
- action: the system action to perform
- params: parameters for the action
- message: a human-friendly response

Available actions:
- read_emails: Read and summarize emails
- create_task_list: Generate a task list from various inputs
- open_application: Launch an application
- optimize_hardware: Configure hardware for specific use case
- file_operation: Create, read, update, or delete files
- system_info: Get system information
- network_operation: Network-related tasks`

    const distributionPrompts: Record<string, string> = {
      'wayneos-top': '\n\nAdditional TOP Automotive capabilities:\n- reconcile_invoices\n- track_inventory\n- manage_payroll',
      'wayneos-sspb': '\n\nAdditional SS-PB Healthcare capabilities:\n- schedule_shifts\n- verify_credentials\n- compliance_check',
      'wayneos-financial': '\n\nAdditional Financial capabilities:\n- reconcile_accounts\n- generate_reports\n- analyze_trends',
      'wayneos-enterprise': '\n\nAll capabilities enabled with enterprise features'
    }

    return basePrompt + (distributionPrompts[distribution] || '')
  }

  private parseResponse(content: string): ClaudeResponse {
    try {
      // Extract JSON from Claude's response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      logger.error('Failed to parse Claude response:', error)
    }

    // Fallback response
    return {
      action: 'message',
      params: {},
      message: content
    }
  }
}

export const claudeService = new ClaudeService()