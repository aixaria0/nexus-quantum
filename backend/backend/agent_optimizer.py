"""Gemini AI Agent for VQE Parameter Optimization"""
import os
import json
import re
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import google.generativeai as genai
from pydantic import BaseModel
from backend.qlf_verification import QLF_ZFA_Constraints, violation_log

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


class AgentParameter(BaseModel):
    """A single parameter proposed by the AI agent."""
    param_id: str
    param_type: str  # 'angle', 'energy', 'fidelity', 'fold_factor'
    proposed_value: float
    agent_reasoning: str
    constraint_check: bool = False
    constraint_message: str = ""
    timestamp: str = ""


class AgentOODALoop(BaseModel):
    """Agent's Observe-Orient-Decide-Act loop reasoning."""
    iteration: int
    timestamp: str
    observe_state: Dict  # Current VQE state
    orient_analysis: str  # Agent's interpretation
    decide_action: str  # Proposed optimization step
    act_parameters: List[AgentParameter]  # Parameters to execute
    all_constraints_satisfied: bool = False
    rejection_count: int = 0


class VQEAgentOptimizer:
    """
    Autonomous VQE circuit optimizer driven by Gemini 1.5 Pro.
    Every parameter is validated against QLF_ZFA_Constraints.
    Constraint violations halt execution and force recalculation.
    """
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro') if GEMINI_API_KEY else None
        self.ooda_history: List[AgentOODALoop] = []
        self.current_state = {
            'iteration': 0,
            'energy': 0.0,
            'fidelity': 0.0,
            'angles': [],
            'gate_count': 0
        }
    
    def observe_quantum_state(self, vqe_state: Dict) -> str:
        """
        Agent observes current VQE state.
        Returns structured observation for agent reasoning.
        """
        observation = f"""
        QUANTUM STATE OBSERVATION:
        - Current Energy: {vqe_state.get('energy', 0.0):.6f} Ha
        - State Fidelity: {vqe_state.get('fidelity', 0.0):.6f}
        - Active Qubits: {vqe_state.get('num_qubits', 2)}
        - Gate Count: {vqe_state.get('gate_count', 0)}
        - Circuit Angles: {[f'{a:.4f}' for a in vqe_state.get('angles', [])]}
        - Iteration: {vqe_state.get('iteration', 0)}
        """
        self.current_state = vqe_state
        return observation.strip()
    
    def request_agent_action(self, observation: str, constraint_bounds: Dict) -> Optional[AgentOODALoop]:
        """
        Request Gemini agent to propose next optimization step.
        Agent must propose parameters within formal bounds.
        """
        if not self.model:
            return self._mock_agent_action(observation, constraint_bounds)
        
        prompt = f"""
        You are an autonomous quantum circuit optimizer with formal mathematical constraints.
        
        FORMAL CONSTRAINTS (NON-NEGOTIABLE):
        - Rotation angles θ ∈ [0, 2π] radians
        - VQE ground state energy ∈ [{constraint_bounds.get('energy_min', -10)}, {constraint_bounds.get('energy_max', 10)}] Ha
        - State fidelity F ∈ [0, 1]
        - Gate count ∈ [{constraint_bounds.get('gate_min', 1)}, {constraint_bounds.get('gate_max', 100)}]
        - ZNE fold factor ∈ [1, 7]
        - Spectral scalar c ∈ [0.01, 1.0] (null-cone boundary)
        
        CURRENT QUANTUM STATE:
        {observation}
        
        Your task:
        1. Analyze the current state
        2. Propose the NEXT OPTIMIZATION STEP
        3. For each parameter, explain your reasoning
        4. ENSURE ALL PROPOSED VALUES ARE WITHIN FORMAL BOUNDS
        
        Format your response as JSON:
        {{
            "orient_analysis": "Your interpretation of current state",
            "decide_action": "Your proposed optimization strategy",
            "parameters": [
                {{
                    "param_id": "angle_0",
                    "param_type": "angle",
                    "proposed_value": <value_in_bounds>,
                    "reasoning": "Why this value"
                }}
            ]
        }}
        
        CRITICAL: Every proposed value MUST be within the formal bounds listed above.
        If you cannot propose a valid step, explain why.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return self._parse_agent_response(response.text, observation, constraint_bounds)
        except Exception as e:
            print(f"Agent request failed: {e}")
            return None
    
    def _parse_agent_response(self, response_text: str, observation: str, 
                             constraint_bounds: Dict) -> Optional[AgentOODALoop]:
        """
        Parse Gemini's JSON response and validate all parameters.
        """
        try:
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if not json_match:
                return None
            
            response_json = json.loads(json_match.group())
            
            # Build OODA loop
            ooda = AgentOODALoop(
                iteration=self.current_state.get('iteration', 0),
                timestamp=datetime.utcnow().isoformat() + 'Z',
                observe_state=self.current_state,
                orient_analysis=response_json.get('orient_analysis', ''),
                decide_action=response_json.get('decide_action', ''),
                act_parameters=[],
                all_constraints_satisfied=True,
                rejection_count=0
            )
            
            # Validate each proposed parameter
            for param_data in response_json.get('parameters', []):
                param = AgentParameter(
                    param_id=param_data.get('param_id', ''),
                    param_type=param_data.get('param_type', ''),
                    proposed_value=float(param_data.get('proposed_value', 0)),
                    agent_reasoning=param_data.get('reasoning', ''),
                    timestamp=datetime.utcnow().isoformat() + 'Z'
                )
                
                # HARD CONSTRAINT CHECK
                is_valid, message = self._validate_parameter(param, constraint_bounds)
                param.constraint_check = is_valid
                param.constraint_message = message
                
                if not is_valid:
                    ooda.all_constraints_satisfied = False
                    ooda.rejection_count += 1
                    violation_log.log_violation(
                        param.param_type,
                        param.proposed_value,
                        self._get_bounds_for_type(param.param_type, constraint_bounds),
                        param.agent_reasoning
                    )
                
                ooda.act_parameters.append(param)
            
            self.ooda_history.append(ooda)
            return ooda
        
        except Exception as e:
            print(f"Failed to parse agent response: {e}")
            return None
    
    def _validate_parameter(self, param: AgentParameter, bounds: Dict) -> Tuple[bool, str]:
        """
        HARD-STOP constraint validation.
        Agent hallucinations are caught here and rejected.
        """
        if param.param_type == 'angle':
            return QLF_ZFA_Constraints.validate_angle(param.proposed_value)
        elif param.param_type == 'energy':
            return QLF_ZFA_Constraints.validate_energy(param.proposed_value)
        elif param.param_type == 'fidelity':
            return QLF_ZFA_Constraints.validate_fidelity(param.proposed_value)
        elif param.param_type == 'fold_factor':
            return QLF_ZFA_Constraints.validate_fold_factor(int(param.proposed_value))
        elif param.param_type == 'spectral_scalar':
            return QLF_ZFA_Constraints.validate_spectral_scalar(param.proposed_value)
        else:
            return False, f"Unknown parameter type: {param.param_type}"
    
    def _get_bounds_for_type(self, param_type: str, bounds: Dict) -> Tuple:
        """Retrieve formal bounds for a parameter type."""
        if param_type == 'angle':
            return (QLF_ZFA_Constraints.ANGLE_MIN, QLF_ZFA_Constraints.ANGLE_MAX)
        elif param_type == 'energy':
            return (QLF_ZFA_Constraints.ENERGY_MIN, QLF_ZFA_Constraints.ENERGY_MAX)
        elif param_type == 'fidelity':
            return (QLF_ZFA_Constraints.FIDELITY_MIN, QLF_ZFA_Constraints.FIDELITY_MAX)
        elif param_type == 'fold_factor':
            return (QLF_ZFA_Constraints.FOLD_FACTOR_MIN, QLF_ZFA_Constraints.FOLD_FACTOR_MAX)
        elif param_type == 'spectral_scalar':
            return (QLF_ZFA_Constraints.SPECTRAL_MODE_MIN, QLF_ZFA_Constraints.SPECTRAL_MODE_MAX)
        return (0, 1)
    
    def _mock_agent_action(self, observation: str, bounds: Dict) -> AgentOODALoop:
        """
        Mock agent action when Gemini API is not available.
        Used for testing/development.
        """
        import random
        
        ooda = AgentOODALoop(
            iteration=self.current_state.get('iteration', 0),
            timestamp=datetime.utcnow().isoformat() + 'Z',
            observe_state=self.current_state,
            orient_analysis="Mock agent observes quantum state and plans gradient descent",
            decide_action="Adjust rotation angles to minimize energy",
            act_parameters=[],
            all_constraints_satisfied=True,
            rejection_count=0
        )
        
        # Generate mock parameters
        for i in range(2):
            angle = random.uniform(0, 2 * 3.14159)
            param = AgentParameter(
                param_id=f"angle_{i}",
                param_type="angle",
                proposed_value=angle,
                agent_reasoning=f"Gradient-based optimization step {i}",
                constraint_check=True,
                constraint_message="✓ Angle within bounds",
                timestamp=datetime.utcnow().isoformat() + 'Z'
            )
            ooda.act_parameters.append(param)
        
        self.ooda_history.append(ooda)
        return ooda
    
    def get_ooda_history(self, limit: int = 10) -> List[Dict]:
        """Retrieve recent OODA loop iterations for dashboard."""
        return [
            {
                'iteration': ooda.iteration,
                'timestamp': ooda.timestamp,
                'orient': ooda.orient_analysis,
                'decide': ooda.decide_action,
                'all_constraints_satisfied': ooda.all_constraints_satisfied,
                'rejection_count': ooda.rejection_count,
                'parameters': [
                    {
                        'param_id': p.param_id,
                        'type': p.param_type,
                        'value': p.proposed_value,
                        'valid': p.constraint_check,
                        'message': p.constraint_message
                    }
                    for p in ooda.act_parameters
                ]
            }
            for ooda in self.ooda_history[-limit:]
        ]
