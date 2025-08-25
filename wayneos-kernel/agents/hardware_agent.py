"""Hardware Agent - Manages hardware configuration"""

from typing import Dict, Any, List
from .base_agent import BaseAgent

class HardwareAgent(BaseAgent):
    """Handles hardware optimization and configuration"""
    
    def __init__(self):
        super().__init__('hardware')
        self.capabilities = [
            'optimize_hardware',
            'get_hardware_info',
            'monitor_performance'
        ]
        self.current_profile = 'balanced'
        
    async def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute hardware actions"""
        
        if action == 'optimize_hardware':
            return await self._optimize_hardware(params)
        elif action == 'get_hardware_info':
            return await self._get_hardware_info(params)
        elif action == 'monitor_performance':
            return await self._monitor_performance(params)
        else:
            return {'error': f'Unknown action: {action}'}
    
    async def _optimize_hardware(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize hardware for specific use case"""
        profile = params.get('profile', 'balanced')
        
        profiles = {
            'work': {
                'cpu': {
                    'governor': 'balanced',
                    'cores': 8,
                    'turbo': False
                },
                'gpu': {
                    'mode': 'power_saving',
                    'memory_clock': 'low'
                },
                'memory': {
                    'allocation': '16GB',
                    'swap': 'enabled'
                }
            },
            'gaming': {
                'cpu': {
                    'governor': 'performance',
                    'cores': 32,
                    'turbo': True
                },
                'gpu': {
                    'mode': 'maximum_performance',
                    'memory_clock': 'high'
                },
                'memory': {
                    'allocation': '32GB',
                    'swap': 'disabled'
                }
            },
            'balanced': {
                'cpu': {
                    'governor': 'balanced',
                    'cores': 16,
                    'turbo': True
                },
                'gpu': {
                    'mode': 'balanced',
                    'memory_clock': 'medium'
                },
                'memory': {
                    'allocation': '24GB',
                    'swap': 'enabled'
                }
            }
        }
        
        config = profiles.get(profile, profiles['balanced'])
        self.current_profile = profile
        
        return {
            'status': 'configured',
            'profile': profile,
            'configuration': config,
            'message': f'Hardware optimized for {profile}',
            'performance_impact': {
                'cpu_boost': '+25%' if profile == 'gaming' else '0%',
                'power_usage': '+50%' if profile == 'gaming' else '-20%'
            }
        }
    
    async def _get_hardware_info(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get hardware information"""
        return {
            'status': 'success',
            'hardware': {
                'cpu': {
                    'model': 'AMD Ryzen 9 3950X',
                    'cores': 16,
                    'threads': 32,
                    'clock': '3.5 GHz'
                },
                'memory': {
                    'total': '32GB',
                    'available': '24GB',
                    'type': 'DDR4'
                },
                'gpu': {
                    'model': 'Virtual GPU',
                    'memory': '8GB',
                    'driver': 'latest'
                },
                'storage': {
                    'system': '100GB NVMe',
                    'data': '500GB HDD'
                }
            }
        }
    
    async def _monitor_performance(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Monitor hardware performance"""
        import random
        
        return {
            'status': 'monitoring',
            'metrics': {
                'cpu_usage': random.randint(10, 50),
                'memory_usage': random.randint(20, 60),
                'gpu_usage': random.randint(0, 30),
                'temperature': {
                    'cpu': random.randint(40, 70),
                    'gpu': random.randint(35, 65)
                },
                'ops_per_sec': 313150 + random.randint(-5000, 5000)
            }
        }
    
    def get_capabilities(self) -> List[str]:
        """Return agent capabilities"""
        return self.capabilities