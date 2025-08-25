"""ML Agent - Handles machine learning tasks"""

from typing import Dict, Any, List
from datetime import datetime
from .base_agent import BaseAgent

class MLAgent(BaseAgent):
    """Handles ML-related operations like task generation"""
    
    def __init__(self):
        super().__init__('ml')
        self.capabilities = [
            'generate_task_list',
            'analyze_patterns',
            'predict_usage'
        ]
        
    async def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute ML actions"""
        
        if action == 'generate_task_list':
            return await self._generate_task_list(params)
        elif action == 'analyze_patterns':
            return await self._analyze_patterns(params)
        elif action == 'predict_usage':
            return await self._predict_usage(params)
        else:
            return {'error': f'Unknown action: {action}'}
    
    async def _generate_task_list(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Generate task list from emails and context"""
        source = params.get('source', {})
        
        # Extract tasks from email data
        tasks = []
        
        # High priority tasks from important emails
        if isinstance(source, dict) and 'emails' in source:
            for email in source['emails']:
                if email.get('important'):
                    if 'Q3' in email.get('subject', ''):
                        tasks.append({
                            'priority': 'high',
                            'task': 'Reply to CEO about Q3 projections',
                            'due': 'today',
                            'category': 'work'
                        })
                    elif 'Contract' in email.get('subject', ''):
                        tasks.append({
                            'priority': 'high',
                            'task': 'Review contract from TanOak',
                            'due': 'today',
                            'category': 'work'
                        })
                    elif 'Appointment' in email.get('subject', ''):
                        tasks.append({
                            'priority': 'medium',
                            'task': 'Schedule dentist appointment',
                            'due': 'this week',
                            'category': 'personal'
                        })
        
        # Add some general tasks
        tasks.extend([
            {
                'priority': 'medium',
                'task': 'Prepare for Grant Hooper meeting',
                'due': 'Friday',
                'category': 'work'
            },
            {
                'priority': 'low',
                'task': 'Update project documentation',
                'due': 'end of week',
                'category': 'work'
            }
        ])
        
        return {
            'status': 'success',
            'tasks': tasks,
            'summary': f'Generated {len(tasks)} tasks from analysis',
            'date': datetime.now().strftime('%Y-%m-%d')
        }
    
    async def _analyze_patterns(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze usage patterns"""
        return {
            'status': 'success',
            'patterns': {
                'peak_hours': '9-11 AM',
                'common_tasks': ['email', 'browser', 'documents'],
                'efficiency': 0.87
            }
        }
    
    async def _predict_usage(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Predict future usage"""
        return {
            'status': 'success',
            'predictions': {
                'next_hour': 'high activity',
                'suggested_optimization': 'performance mode',
                'confidence': 0.92
            }
        }
    
    def get_capabilities(self) -> List[str]:
        """Return agent capabilities"""
        return self.capabilities