export interface PerformanceDataPoint {
  time: string;
  efficiency: number;
  energy: number;
}

export interface ConveyorThroughput {
  processed: number;
  target: number;
  percentage: number;
}

export interface ActuatorStatus {
  active_arms: number;
  total_arms: number;
  health_percentage: number;
}

export interface DashboardKPIs {
  current_task: string;
  total_waste_kg: number;
  recyclable_percentage: number;
  anomaly_variance: number;
}

export interface DashboardTelemetry {
  timestamp: string;
  efficiency: number;
  energy_kwh: number;
  conveyor_throughput: ConveyorThroughput;
  actuator_status: ActuatorStatus;
  kpi: DashboardKPIs;
  performance_series: PerformanceDataPoint[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBMGraniteRAG {
  ref_id: string;
  citation: string;
  confidence_score: number;
  explanation: string;
}

export interface ScannerResult {
  item_name: string;
  category: string;
  confidence: number;
  bounding_box: BoundingBox;
  destination: string;
  ibm_granite_rag: IBMGraniteRAG;
}

export interface BuildingUsage {
  building: string;
  electricity_kwh: number;
  water_liters: number;
}

export interface MaterialPurity {
  name: string;
  value: number;
  color: string;
}

export interface EnergyBreakdown {
  category: string;
  consumption: number;
}

export interface AnalyticsSummary {
  date_range: string;
  building_usage: BuildingUsage[];
  material_purity: MaterialPurity[];
  energy_breakdown: EnergyBreakdown[];
}

export interface EcoActionAdvisory {
  action_id: string;
  timestamp: string;
  severity: string;
  anomaly: {
    title: string;
    location: string;
    detected_at: string;
    variance: string;
  };
  root_cause_analysis: string;
  interventions: string[];
  target_kpis: {
    contamination_reduction: string;
    pet_recovery: string;
    energy_efficiency: string;
    custom_note?: string;
  };
  status: 'pending_approval' | 'approved' | 'modified' | 'rejected';
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'DETECT' | 'SYSTEM';
  message: string;
}
