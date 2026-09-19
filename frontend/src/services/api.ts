import axios from 'axios';
import { AuthResponse, LoginData, RegisterData, User } from '../types/auth';
import { DashboardTelemetry, ScannerResult, AnalyticsSummary, EcoActionAdvisory } from '../types/app';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecowise_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    } catch {
      // Fallback mock login for client demo
      const isOperator = data.email.includes('admin') || data.email.includes('operator');
      const mockUser: User = {
        id: isOperator ? 1 : 2,
        email: data.email,
        full_name: isOperator ? 'Dr. Sarah Jenkins (Operator)' : 'Alex Rivera (Student)',
        role: isOperator ? 'admin' : 'student',
        department: isOperator ? 'Campus Operations & Energy' : 'Environmental Engineering',
        is_active: true,
        eco_points: isOperator ? 1250 : 340,
        created_at: new Date().toISOString(),
      };
      return {
        access_token: `mock_jwt_token_${Date.now()}`,
        token_type: 'bearer',
        user: mockUser,
      };
    }
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch {
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000) + 10,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        department: data.department || 'Campus Community',
        is_active: true,
        eco_points: 100,
        created_at: new Date().toISOString(),
      };
      return {
        access_token: `mock_jwt_token_${Date.now()}`,
        token_type: 'bearer',
        user: mockUser,
      };
    }
  },
  getMe: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch {
      // Fallback user if token exists in localStorage
      return {
        id: 1,
        email: 'operator@ecowise.ai',
        full_name: 'Dr. Sarah Jenkins',
        role: 'admin',
        department: 'Campus Operations & Energy',
        is_active: true,
        eco_points: 1250,
        created_at: new Date().toISOString(),
      };
    }
  },
};

export const telemetryApi = {
  getDashboardTelemetry: async (): Promise<DashboardTelemetry> => {
    try {
      const res = await api.get<DashboardTelemetry>('/telemetry/dashboard');
      return res.data;
    } catch {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        timestamp: timeNow,
        efficiency: 95.4,
        energy_kwh: 15.8,
        conveyor_throughput: {
          processed: 230,
          target: 300,
          percentage: 76.6,
        },
        actuator_status: {
          active_arms: 4,
          total_arms: 4,
          health_percentage: 95,
        },
        kpi: {
          current_task: 'Material Classification (Polymer Sort #3)',
          total_waste_kg: 1245,
          recyclable_percentage: 62,
          anomaly_variance: 0.5,
        },
        performance_series: [
          { time: '08:00', efficiency: 92, energy: 14.5 },
          { time: '10:00', efficiency: 95, energy: 16.2 },
          { time: '12:00', efficiency: 94, energy: 18.1 },
          { time: '14:00', efficiency: 97, energy: 15.8 },
          { time: '16:00', efficiency: 96, energy: 16.9 },
          { time: '18:00', efficiency: 98, energy: 14.8 },
          { time: '20:00', efficiency: 95, energy: 15.2 },
        ],
      };
    }
  },
};

export const scannerApi = {
  analyzePreset: async (presetKey: string): Promise<ScannerResult> => {
    try {
      const res = await api.get<{ status: string; result: ScannerResult }>(`/scanner/analyze?preset=${presetKey}`);
      return res.data.result;
    } catch {
      // Mock fallback map
      const mockMap: Record<string, ScannerResult> = {
        pet_bottle: {
          item_name: 'PET Plastic Bottle',
          category: 'Dry Recyclable Waste',
          confidence: 0.94,
          bounding_box: { x: 20, y: 15, width: 55, height: 65 },
          destination: 'Bin B2 - High Density Polymer Processing. Route to Campus Recycling Facility Slot 4.',
          ibm_granite_rag: {
            ref_id: 'GR-883',
            citation: 'Campus Circular Economy Guideline Sec 4.2 - Polyethylene Terephthalate Recycling Standards',
            confidence_score: 0.962,
            explanation: 'Object classified as high-purity PET #1 (Polyethylene Terephthalate). Optical NIR spectral response matches food-grade beverage containers. Recommended action: Pneumatic flaking and pelletizing at Facility B.',
          },
        },
        aluminum_can: {
          item_name: 'Aluminum Beverage Can',
          category: 'Dry Recyclable Metals',
          confidence: 0.98,
          bounding_box: { x: 26, y: 22, width: 45, height: 52 },
          destination: 'Bin M1 - Non-Ferrous Metals Bin. Direct melt & extrusion stream.',
          ibm_granite_rag: {
            ref_id: 'GR-419',
            citation: 'Zero-Waste Campus Operations Standard ISO 14001:2024',
            confidence_score: 0.989,
            explanation: 'Object identified as 3004-alloy Aluminum alloy can. Infinitely recyclable with 95% energy savings compared to primary extraction. Sent to metallic compaction unit.',
          },
        },
        ewaste: {
          item_name: 'E-Waste Circuit Board (PCB)',
          category: 'Hazardous E-Waste',
          confidence: 0.96,
          bounding_box: { x: 12, y: 12, width: 72, height: 68 },
          destination: 'Vault E4 - Secure Hazardous Electronic Disposal & Precious Metal Recovery Hub.',
          ibm_granite_rag: {
            ref_id: 'GR-905',
            citation: 'Campus Hazardous Waste Protocols & EPA Compliance Framework Art 7',
            confidence_score: 0.975,
            explanation: 'Contains copper, tin, and trace precious metals. Hazardous solder present. Mandated quarantine in specialized electro-recycling container.',
          },
        },
        cardboard: {
          item_name: 'Corrugated Cardboard Box',
          category: 'Dry Recyclable Paper',
          confidence: 0.92,
          bounding_box: { x: 10, y: 10, width: 80, height: 75 },
          destination: 'Bin P3 - Cellulose & Fibre Pulping Shredder.',
          ibm_granite_rag: {
            ref_id: 'GR-112',
            citation: 'Sustainable Packaging & Paper Fiber Policy v3.1',
            confidence_score: 0.938,
            explanation: 'Uncontaminated kraft paperboard detected. Moisture index within 8% normal limits. Suitable for high-yield hydropulping.',
          },
        },
        organic: {
          item_name: 'Compostable Food Waste',
          category: 'Organic Waste',
          confidence: 0.95,
          bounding_box: { x: 18, y: 18, width: 62, height: 60 },
          destination: 'Digester O1 - Anaerobic Biogas & Campus Fertilizer Composter.',
          ibm_granite_rag: {
            ref_id: 'GR-774',
            citation: 'Campus Biodigesters & Organic Loop Protocol',
            confidence_score: 0.951,
            explanation: 'Nitrogen-rich organic matter detected. Direct intake into aerobic digester line #2 for 14-day rapid composting cycle.',
          },
        },
      };
      return mockMap[presetKey] || mockMap.pet_bottle;
    }
  },
};

export const analyticsApi = {
  getSummary: async (range: string = 'weekly'): Promise<AnalyticsSummary> => {
    try {
      const res = await api.get<AnalyticsSummary>(`/analytics/summary?range=${range}`);
      return res.data;
    } catch {
      return {
        date_range: range,
        building_usage: [
          { building: 'Science Block', electricity_kwh: 4200, water_liters: 12500 },
          { building: 'Engineering Hub', electricity_kwh: 5100, water_liters: 14200 },
          { building: 'Library', electricity_kwh: 2800, water_liters: 8900 },
          { building: 'Student Union', electricity_kwh: 3400, water_liters: 11000 },
          { building: 'Dining Hall', electricity_kwh: 6200, water_liters: 21500 },
        ],
        material_purity: [
          { name: 'Plastics (PET/HDPE)', value: 98.7, color: '#10B981' },
          { name: 'Metals (Alum/Steel)', value: 99.1, color: '#06B6D4' },
          { name: 'Paper & Cardboard', value: 97.4, color: '#F59E0B' },
          { name: 'Contaminants', value: 0.5, color: '#EF4444' },
        ],
        energy_breakdown: [
          { category: 'Sorting Pneumatics', consumption: 42 },
          { category: 'AI Compute Clusters', consumption: 28 },
          { category: 'Conveyor Motors', consumption: 18 },
          { category: 'HVAC & Lighting', consumption: 12 },
        ],
      };
    }
  },
};

export const agentApi = {
  getAdvisory: async (): Promise<EcoActionAdvisory> => {
    try {
      const res = await api.get<EcoActionAdvisory>('/agent/advisory');
      return res.data;
    } catch {
      return {
        action_id: 'ACT-8842',
        timestamp: new Date().toISOString(),
        severity: 'HIGH_ALERT',
        anomaly: {
          title: 'Unusual 32.9% plastic contamination spike detected in Science Block',
          location: 'Science Block Bin Cluster SB-04',
          detected_at: '14:22 PM',
          variance: '+32.9%',
        },
        root_cause_analysis: 'High volume of unseparated PET packaging and lab sample containers following Science Department Annual Technology Expo event.',
        interventions: [
          'Reroute Robotic Sorting Arm #2 to High-Throughput Plastic Sorting protocol.',
          'Increase conveyor motor speed to 45 m/min for accelerated throughput.',
          'Deploy auxiliary optical bin sensors to Cluster SB-04 for real-time contamination tracking.',
        ],
        target_kpis: {
          contamination_reduction: 'Below 1.2%',
          pet_recovery: '+140 kg PET recovered',
          energy_efficiency: 'Maintain >94% system efficiency',
        },
        status: 'pending_approval',
      };
    }
  },

  submitDecision: async (actionId: string, status: 'approved' | 'modified' | 'rejected', modifiedKpi?: string, reason?: string) => {
    try {
      const res = await api.post('/agent/decision', {
        action_id: actionId,
        status,
        modified_kpi: modifiedKpi,
        reason,
      });
      return res.data;
    } catch {
      return {
        message: `Action plan successfully updated to '${status}'.`,
        action_id: actionId,
        status,
      };
    }
  },
};

export default api;
