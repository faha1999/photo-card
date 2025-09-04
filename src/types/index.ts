// Image filter settings
export interface FilterSettings {
  brightness: number;
  contrast: number;
  grayscale: number;
  sepia: number;
}

// Position coordinates
export interface Position {
  x: number;
  y: number;
}

// State snapshot for undo/redo
export interface CardState {
  pos: Position;
  rotation: number;
  scale: number;
  filters: FilterSettings;
  bgColor: string;
  blendMode: GlobalCompositeOperation;
}

// Scale option definition
export interface ScaleOption {
  value: number;
  label: string;
}

// Props for components
export interface CardPreviewProps {
  file: File | null;
  templateUrl: string;
  onConfirm: (
    dataUrl: string,
    filters?: FilterSettings,
    bgColor?: string,
    blendMode?: string,
  ) => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  filters?: FilterSettings;
}

export interface ControlsProps {
  scale: number;
  setScale: (scale: number) => void;
  fileName: string;
  setFileName: (name: string) => void;
  filters: FilterSettings;
  setFilters: React.Dispatch<React.SetStateAction<FilterSettings>>;
  showGuides: boolean;
  setShowGuides: React.Dispatch<React.SetStateAction<boolean>>;
  exportFormat: 'png' | 'jpeg';
  setExportFormat: React.Dispatch<React.SetStateAction<'png' | 'jpeg'>>;
}

export interface UploadAreaProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  isTemplate?: boolean;
}

export interface TemplateManagerProps {
  selectedTemplate: string;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>;
}

// generateCard utility types
export interface GenerateCardOptions {
  userFile: File | Blob;
  templateUrl: string;
  scale?: number;
  filters?: FilterSettings;
}
