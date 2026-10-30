export type FlowNodeType = 'terminator' | 'process' | 'decision' | 'input_output' | 'subroutine';

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  title: string;
  subtitle?: string;
  category: 'lifecycle' | 'caching' | 'sync' | 'install' | 'fallback';
  codeSnippet?: string;
  technicalDetails?: string[];
  yesTarget?: string;
  noTarget?: string;
  nextTarget?: string;
  yesLabel?: string;
  noLabel?: string;
  // Canvas coordinate positioning
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: 'YA' | 'TIDAK' | string;
  type?: 'primary' | 'yes' | 'no' | 'fallback';
}

export interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  path: string[];
}
