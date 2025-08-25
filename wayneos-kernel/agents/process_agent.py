"""Process Agent - Manages application processes"""

from typing import Dict, Any, List
import random
from .base_agent import BaseAgent

class ProcessAgent(BaseAgent):
    """Handles process and application management"""
    
    def __init__(self):
        super().__init__('process')
        self.capabilities = [
            'launch_application',
            'kill_process',
            'list_processes'
        ]
        self.running_processes = {}
        self.next_pid = 10000
        
    async def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute process-related actions"""
        
        if action == 'launch_application':
            return await self._launch_application(params)
        elif action == 'kill_process':
            return await self._kill_process(params)
        elif action == 'list_processes':
            return await self._list_processes(params)
        else:
            return {'error': f'Unknown action: {action}'}
    
    async def _launch_application(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Launch an application"""
        app_name = params.get('app', 'firefox')
        url = params.get('url', '')
        
        # Simulate launching
        pid = self.next_pid
        self.next_pid += 1
        
        self.running_processes[pid] = {
            'name': app_name,
            'pid': pid,
            'memory': random.randint(100, 500),
            'cpu': random.uniform(0.1, 5.0),
            'url': url
        }
        
        return {
            'status': 'launched',
            'pid': pid,
            'app': app_name,
            'url': url,
            'message': f'{app_name.capitalize()} launched successfully'
        }
    
    async def _kill_process(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Kill a process"""
        pid = params.get('pid')
        
        if pid in self.running_processes:
            process = self.running_processes.pop(pid)
            return {
                'status': 'killed',
                'pid': pid,
                'name': process['name']
            }
        else:
            return {
                'status': 'error',
                'message': f'Process {pid} not found'
            }
    
    async def _list_processes(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """List running processes"""
        return {
            'status': 'success',
            'processes': list(self.running_processes.values()),
            'count': len(self.running_processes)
        }
    
    def get_capabilities(self) -> List[str]:
        """Return agent capabilities"""
        return self.capabilities