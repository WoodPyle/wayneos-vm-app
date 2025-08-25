"""Base Agent class for all WayneOS agents"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List
import asyncio
import logging

class BaseAgent(ABC):
    """Abstract base class for all agents"""
    
    def __init__(self, name: str):
        self.name = name
        self.logger = logging.getLogger(f'wayneos.agent.{name}')
        self.capabilities = []
        
    @abstractmethod
    async def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute an action with given parameters"""
        pass
    
    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return list of capabilities this agent provides"""
        pass
    
    async def validate_params(self, action: str, params: Dict[str, Any]) -> bool:
        """Validate parameters for an action"""
        return True
    
    def log_action(self, action: str, result: Any):
        """Log action execution"""
        self.logger.info(f"Action: {action}, Result: {result}")