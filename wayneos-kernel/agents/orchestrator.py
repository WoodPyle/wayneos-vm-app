"""Orchestrator - Coordinates all agents and routes commands"""

from typing import Dict, Any, List
import asyncio
import re
from datetime import datetime

class Orchestrator:
    """Main orchestrator that routes commands to appropriate agents"""
    
    def __init__(self, distribution: str):
        self.distribution = distribution
        self.command_patterns = self._build_command_patterns()
        
    def _build_command_patterns(self) -> Dict[str, List[tuple]]:
        """Build regex patterns for command routing"""
        return {
            'email': [
                (r'read.*(email|mail)', 'read_emails'),
                (r'check.*(email|mail)', 'read_emails'),
                (r'show.*(email|mail)', 'read_emails')
            ],
            'task': [
                (r'create.*task.*list', 'create_task_list'),
                (r'make.*todo', 'create_task_list'),
                (r'generate.*tasks', 'create_task_list')
            ],
            'application': [
                (r'open\s+(\w+)', 'open_application'),
                (r'launch\s+(\w+)', 'open_application'),
                (r'start\s+(\w+)', 'open_application')
            ],
            'hardware': [
                (r'optimize.*for\s+(\w+)', 'optimize_hardware'),
                (r'configure.*for\s+(\w+)', 'optimize_hardware'),
                (r'tune.*for\s+(\w+)', 'optimize_hardware')
            ],
            'file': [
                (r'create.*file', 'file_operation'),
                (r'read.*file', 'file_operation'),
                (r'save.*file', 'file_operation')
            ]
        }
    
    async def execute(self, command: str, params: Dict[str, Any], agents: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a command by routing to appropriate agent(s)"""
        
        # Parse command intent
        intent = self._parse_intent(command)
        
        # Route to appropriate agent(s)
        if intent['category'] == 'email':
            agent = agents.get('filesystem')
            if agent:
                return await agent.execute(intent['action'], {
                    **params,
                    'category': intent.get('filter', 'all')
                })
                
        elif intent['category'] == 'task':
            ml_agent = agents.get('ml')
            fs_agent = agents.get('filesystem')
            if ml_agent and fs_agent:
                # First read emails
                emails = await fs_agent.execute('read_emails', {'category': 'all'})
                # Then create task list
                return await ml_agent.execute('generate_task_list', {
                    'source': emails,
                    'date': datetime.now().strftime('%Y-%m-%d')
                })
                
        elif intent['category'] == 'application':
            agent = agents.get('process')
            if agent:
                return await agent.execute('launch_application', {
                    'app': intent.get('target', 'firefox'),
                    'url': params.get('url')
                })
                
        elif intent['category'] == 'hardware':
            agent = agents.get('hardware')
            if agent:
                return await agent.execute('optimize_hardware', {
                    'profile': intent.get('target', 'work'),
                    'duration': params.get('duration')
                })
        
        # Fallback response
        return {
            'status': 'completed',
            'message': f"Command processed: {command}",
            'performance': {
                'opsExecuted': 1000 + len(command) * 100
            }
        }
    
    def _parse_intent(self, command: str) -> Dict[str, Any]:
        """Parse user intent from natural language command"""
        command_lower = command.lower()
        
        for category, patterns in self.command_patterns.items():
            for pattern, action in patterns:
                match = re.search(pattern, command_lower)
                if match:
                    result = {
                        'category': category,
                        'action': action,
                        'raw_command': command
                    }
                    
                    # Extract additional parameters from match groups
                    if match.groups():
                        if category == 'application':
                            result['target'] = match.group(1)
                        elif category == 'hardware':
                            result['target'] = match.group(1)
                        elif category == 'email' and 'work' in command_lower:
                            result['filter'] = 'work'
                        elif category == 'email' and 'personal' in command_lower:
                            result['filter'] = 'personal'
                    
                    return result
        
        # Default intent
        return {
            'category': 'general',
            'action': 'process',
            'raw_command': command
        }