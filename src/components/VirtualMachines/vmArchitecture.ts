export type VMArchitecture = 'amd64' | 'arm64' | 's390x';

export const DEFAULT_VM_ARCHITECTURE: VMArchitecture = 'amd64';

export const VM_ARCHITECTURES: Array<{ value: VMArchitecture; label: string }> = [
  { value: 'amd64', label: 'x86_64 (amd64)' },
  { value: 'arm64', label: 'ARM64 (arm64)' },
  { value: 's390x', label: 'IBM Z (s390x)' },
];

export interface CPUModelGroup {
  label: string;
  models: Array<{ value: string; label: string }>;
}

export const CPU_MODEL_GROUPS: Record<VMArchitecture, CPUModelGroup[]> = {
  amd64: [
    {
      label: 'Intel x86_64',
      models: [
        { value: 'Conroe', label: 'Conroe' },
        { value: 'Penryn', label: 'Penryn' },
        { value: 'Nehalem', label: 'Nehalem' },
        { value: 'Westmere', label: 'Westmere' },
        { value: 'SandyBridge', label: 'SandyBridge' },
        { value: 'IvyBridge', label: 'IvyBridge' },
        { value: 'Haswell', label: 'Haswell' },
        { value: 'Broadwell', label: 'Broadwell' },
        { value: 'Skylake-Client', label: 'Skylake-Client' },
        { value: 'Skylake-Server', label: 'Skylake-Server' },
        { value: 'Cascadelake-Server', label: 'Cascadelake-Server' },
        { value: 'Cooperlake', label: 'Cooperlake' },
        { value: 'Icelake-Server', label: 'Icelake-Server' },
        { value: 'Sapphirerapids', label: 'Sapphirerapids' },
      ],
    },
    {
      label: 'AMD x86_64',
      models: [
        { value: 'Opteron_G1', label: 'Opteron G1' },
        { value: 'Opteron_G2', label: 'Opteron G2' },
        { value: 'Opteron_G3', label: 'Opteron G3' },
        { value: 'Opteron_G4', label: 'Opteron G4' },
        { value: 'Opteron_G5', label: 'Opteron G5' },
        { value: 'EPYC', label: 'EPYC' },
        { value: 'EPYC-Rome', label: 'EPYC-Rome' },
        { value: 'EPYC-Milan', label: 'EPYC-Milan' },
        { value: 'EPYC-Genoa', label: 'EPYC-Genoa' },
      ],
    },
  ],
  arm64: [],
  s390x: [
    {
      label: 'IBM Z',
      models: [
        { value: 'z13', label: 'z13' },
        { value: 'z14', label: 'z14' },
        { value: 'z15', label: 'z15' },
      ],
    },
  ],
};

export const MACHINE_TYPE_OPTIONS: Record<
  VMArchitecture,
  Array<{ value: string; label: string }>
> = {
  amd64: [
    { value: '', label: 'Default (q35)' },
    { value: 'pc-q35-rhel9.2.0', label: 'pc-q35-rhel9.2.0' },
    { value: 'pc-q35-rhel9.0.0', label: 'pc-q35-rhel9.0.0' },
    { value: 'q35', label: 'q35' },
    { value: 'pc-i440fx-rhel7.6.0', label: 'pc-i440fx-rhel7.6.0' },
    { value: 'pc', label: 'pc (i440fx)' },
  ],
  arm64: [
    { value: '', label: 'Default (virt)' },
    { value: 'virt', label: 'virt' },
  ],
  s390x: [
    { value: '', label: 'Default (s390-ccw-virtio)' },
    { value: 's390-ccw-virtio', label: 's390-ccw-virtio' },
  ],
};

const ARCHITECTURE_INDEPENDENT_CPU_MODELS = new Set(['', 'host-passthrough', 'host-model']);
const HOST_PASSTHROUGH_ONLY_ARCHITECTURES = new Set<VMArchitecture>(['arm64']);

export function supportsCPUModelSelection(architecture: VMArchitecture): boolean {
  return !HOST_PASSTHROUGH_ONLY_ARCHITECTURES.has(architecture);
}

export function isCPUModelCompatible(model: string, architecture: VMArchitecture): boolean {
  if (!supportsCPUModelSelection(architecture)) {
    return model === '' || model === 'host-passthrough';
  }

  return (
    ARCHITECTURE_INDEPENDENT_CPU_MODELS.has(model) ||
    CPU_MODEL_GROUPS[architecture].some(group =>
      group.models.some(candidate => candidate.value === model)
    )
  );
}

export function isMachineTypeCompatible(type: string, architecture: VMArchitecture): boolean {
  return MACHINE_TYPE_OPTIONS[architecture].some(option => option.value === type);
}
