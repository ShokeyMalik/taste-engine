/**
 * Dashboard Block Variants
 *
 * All block definitions for dashboard and admin interfaces.
 */

export { sidebarBlock, default as sidebar } from './sidebar';
export { headerBlock, default as header } from './header';
export { dataTableBlock, default as dataTable } from './data-table';
export { metricCardsBlock, default as metricCards } from './metric-cards';
export { chartSectionBlock, default as chartSection } from './chart-section';
export { activityFeedBlock, default as activityFeed } from './activity-feed';
export { settingsPanelBlock, default as settingsPanel } from './settings-panel';
export { commandPaletteBlock, default as commandPalette } from './command-palette';

import { sidebarBlock } from './sidebar';
import { headerBlock } from './header';
import { dataTableBlock } from './data-table';
import { metricCardsBlock } from './metric-cards';
import { chartSectionBlock } from './chart-section';
import { activityFeedBlock } from './activity-feed';
import { settingsPanelBlock } from './settings-panel';
import { commandPaletteBlock } from './command-palette';

import type { BlockDefinition } from '../../types';

/**
 * All dashboard block definitions
 */
export const dashboardBlocks: BlockDefinition[] = [
  sidebarBlock,
  headerBlock,
  dataTableBlock,
  metricCardsBlock,
  chartSectionBlock,
  activityFeedBlock,
  settingsPanelBlock,
  commandPaletteBlock,
];

export default dashboardBlocks;
