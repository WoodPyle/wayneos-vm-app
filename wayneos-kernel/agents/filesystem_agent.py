"""FileSystem Agent - Manages file operations and email simulation"""

from typing import Dict, Any, List
from datetime import datetime
import random
from .base_agent import BaseAgent

class FileSystemAgent(BaseAgent):
    """Handles filesystem operations including email simulation"""
    
    def __init__(self):
        super().__init__('filesystem')
        self.capabilities = [
            'read_emails',
            'file_operations',
            'directory_management'
        ]
        
    async def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute filesystem actions"""
        
        if action == 'read_emails':
            return await self._read_emails(params)
        elif action == 'file_operation':
            return await self._file_operation(params)
        else:
            return {'error': f'Unknown action: {action}'}
    
    async def _read_emails(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate reading emails"""
        category = params.get('category', 'all')
        
        # Simulate email data
        work_emails = [
            {
                'from': 'ceo@company.com',
                'subject': 'Q3 Projections Review',
                'date': datetime.now().isoformat(),
                'important': True
            },
            {
                'from': 'team@tanoak.com',
                'subject': 'Contract Review - Urgent',
                'date': datetime.now().isoformat(),
                'important': True
            }
        ]
        
        personal_emails = [
            {
                'from': 'dentist@clinic.com',
                'subject': 'Appointment Reminder',
                'date': datetime.now().isoformat(),
                'important': True
            },
            {
                'from': 'friend@email.com',
                'subject': 'Weekend Plans',
                'date': datetime.now().isoformat(),
                'important': False
            }
        ]
        
        # Filter based on category
        if category == 'work':
            emails = work_emails
        elif category == 'personal':
            emails = personal_emails
        else:
            emails = work_emails + personal_emails
        
        # Add more random emails
        for i in range(random.randint(10, 20)):
            emails.append({
                'from': f'sender{i}@example.com',
                'subject': f'Email subject {i}',
                'date': datetime.now().isoformat(),
                'important': random.choice([True, False])
            })
        
        return {
            'status': 'success',
            'emails': emails,
            'count': len(emails),
            'unread': random.randint(5, 15),
            'important': len([e for e in emails if e.get('important')])
        }
    
    async def _file_operation(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle file operations"""
        operation = params.get('operation', 'read')
        path = params.get('path', '/home/user/document.txt')
        
        if operation == 'read':
            return {
                'status': 'success',
                'content': 'File content would be here',
                'size': 1024,
                'modified': datetime.now().isoformat()
            }
        elif operation == 'write':
            return {
                'status': 'success',
                'message': f'File written to {path}',
                'size': len(params.get('content', ''))
            }
        else:
            return {
                'status': 'error',
                'message': f'Unknown operation: {operation}'
            }
    
    def get_capabilities(self) -> List[str]:
        """Return agent capabilities"""
        return self.capabilities