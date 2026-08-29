import { FEATURE_GATE_CATEGORIES, getGateStateForVersion } from './FeatureGatesSection';
import type { FeatureGateInfo, FeatureGateState } from './FeatureGatesSection';

vi.mock('@kinvolk/headlamp-plugin/lib/components/common', () => ({
  SectionBox: () => null,
}));

const gates = Object.values(FEATURE_GATE_CATEGORIES).flatMap(category => category.gates);

function getGate(name: string): FeatureGateInfo {
  const gate = gates.find(candidate => candidate.name === name);
  if (!gate) throw new Error(`Unknown feature gate: ${name}`);
  return gate;
}

describe('KubeVirt 1.9 feature gates', () => {
  it.each<[string, FeatureGateState]>([
    ['VMExport', 'GA'],
    ['HotplugVolumes', 'Deprecated'],
    ['DeclarativeHotplugVolumes', 'Beta'],
    ['LiveUpdateNADRef', 'GA'],
    ['RebootPolicy', 'Beta'],
    ['VmiMemoryOverheadReport', 'Beta'],
    ['GPUsWithDRA', 'Beta'],
    ['HostDevicesWithDRA', 'Beta'],
    ['PanicDevices', 'GA'],
    ['WorkloadEncryptionSEV', 'Beta'],
    ['SecureExecution', 'GA'],
    ['OptOutRoleAggregation', 'Beta'],
    ['MigrationPriorityQueue', 'GA'],
    ['LibvirtHooksServerAndClient', 'Beta'],
    ['VideoConfig', 'GA'],
    ['PersistentReservation', 'GA'],
    ['Template', 'Beta'],
  ])('marks %s as %s', (name, state) => {
    expect(getGateStateForVersion(getGate(name), '1.9.0')).toBe(state);
  });

  it.each([
    'NetworkDevicesWithDRA',
    'VMStatsCollector',
    'OCIExport',
    'Plugins',
    'GraceIOVirtualization',
    'IOMMUFD',
    'FirmwareAutoSelection',
    'MigrationStallDetection',
    'CrossArchitectureVirtualization',
    'PortRangesSpec',
  ])('introduces %s as Alpha in 1.9', name => {
    const gate = getGate(name);
    expect(getGateStateForVersion(gate, '1.8.0')).toBeNull();
    expect(getGateStateForVersion(gate, '1.9.0')).toBe('Alpha');
  });

  it('keeps the ExpandDisks GA transition introduced in 1.8', () => {
    expect(getGateStateForVersion(getGate('ExpandDisks'), '1.8.0')).toBe('GA');
  });
});
