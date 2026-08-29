import {
  DEFAULT_VM_ARCHITECTURE,
  isCPUModelCompatible,
  isMachineTypeCompatible,
  MACHINE_TYPE_OPTIONS,
} from './vmArchitecture';

describe('VM architecture options', () => {
  it('keeps amd64 as the default for new VMs', () => {
    expect(DEFAULT_VM_ARCHITECTURE).toBe('amd64');
  });

  it('matches CPU models to their architecture', () => {
    expect(isCPUModelCompatible('EPYC-Milan', 'amd64')).toBe(true);
    expect(isCPUModelCompatible('EPYC-Milan', 'arm64')).toBe(false);
    expect(isCPUModelCompatible('cortex-a72', 'arm64')).toBe(true);
    expect(isCPUModelCompatible('cortex-a72', 'amd64')).toBe(false);
    expect(isCPUModelCompatible('POWER10', 'ppc64le')).toBe(true);
    expect(isCPUModelCompatible('z15', 's390x')).toBe(true);
  });

  it('allows host CPU modes on every architecture', () => {
    expect(isCPUModelCompatible('host-passthrough', 'amd64')).toBe(true);
    expect(isCPUModelCompatible('host-passthrough', 'arm64')).toBe(true);
    expect(isCPUModelCompatible('host-model', 'ppc64le')).toBe(true);
  });

  it('matches machine types to their architecture', () => {
    expect(isMachineTypeCompatible('q35', 'amd64')).toBe(true);
    expect(isMachineTypeCompatible('q35', 'arm64')).toBe(false);
    expect(isMachineTypeCompatible('virt', 'arm64')).toBe(true);
    expect(isMachineTypeCompatible('pseries', 'ppc64le')).toBe(true);
    expect(isMachineTypeCompatible('s390-ccw-virtio', 's390x')).toBe(true);
  });

  it('includes the default machine type as a selectable option', () => {
    expect(MACHINE_TYPE_OPTIONS.amd64[0]).toEqual({ value: '', label: 'Default (q35)' });
    expect(MACHINE_TYPE_OPTIONS.arm64[0]).toEqual({ value: '', label: 'Default (virt)' });
  });
});
