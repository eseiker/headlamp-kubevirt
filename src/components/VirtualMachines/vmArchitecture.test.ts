import {
  DEFAULT_VM_ARCHITECTURE,
  isCPUModelCompatible,
  isMachineTypeCompatible,
  MACHINE_TYPE_OPTIONS,
  supportsCPUModelSelection,
  VM_ARCHITECTURES,
} from './vmArchitecture';

describe('VM architecture options', () => {
  it('keeps amd64 as the default for new VMs', () => {
    expect(DEFAULT_VM_ARCHITECTURE).toBe('amd64');
  });

  it('only offers architectures supported by KubeVirt', () => {
    expect(VM_ARCHITECTURES.map(option => option.value)).toEqual(['amd64', 'arm64', 's390x']);
  });

  it('matches CPU models to their architecture', () => {
    expect(isCPUModelCompatible('EPYC-Milan', 'amd64')).toBe(true);
    expect(isCPUModelCompatible('EPYC-Milan', 'arm64')).toBe(false);
    expect(isCPUModelCompatible('host-passthrough', 'arm64')).toBe(true);
    expect(isCPUModelCompatible('host-model', 'arm64')).toBe(false);
    expect(isCPUModelCompatible('z15', 's390x')).toBe(true);
  });

  it('hides CPU model selection for host-passthrough-only architectures', () => {
    expect(supportsCPUModelSelection('amd64')).toBe(true);
    expect(supportsCPUModelSelection('arm64')).toBe(false);
    expect(supportsCPUModelSelection('s390x')).toBe(true);
  });

  it('matches machine types to their architecture', () => {
    expect(isMachineTypeCompatible('q35', 'amd64')).toBe(true);
    expect(isMachineTypeCompatible('q35', 'arm64')).toBe(false);
    expect(isMachineTypeCompatible('virt', 'arm64')).toBe(true);
    expect(isMachineTypeCompatible('s390-ccw-virtio', 's390x')).toBe(true);
  });

  it('includes the default machine type as a selectable option', () => {
    expect(MACHINE_TYPE_OPTIONS.amd64[0]).toEqual({ value: '', label: 'Default (q35)' });
    expect(MACHINE_TYPE_OPTIONS.arm64[0]).toEqual({ value: '', label: 'Default (virt)' });
  });
});
