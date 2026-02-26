import type { AnimalGenealogy, GenealogyNode } from '@/types';

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' fill='%23f2f2f2'/><circle cx='60' cy='46' r='18' fill='none' stroke='%23999' stroke-width='4'/><path d='M30 94c0-16 13-28 30-28s30 12 30 28' fill='none' stroke='%23999' stroke-width='4'/></svg>";

export interface GenealogyViewNode {
  id?: string;
  name: string;
  registry: string;
  imageUrl: string;
  isPlaceholder: boolean;
  isHistorical?: boolean;
}

export interface GenealogyView {
  root: GenealogyViewNode;
  parents: GenealogyViewNode[];
  grandparents: GenealogyViewNode[];
  greatGrandparents: GenealogyViewNode[];
}

interface HistoricalEntry {
  rowid?: string | null;
  nome?: string | null;
  registro?: string | null;
}

interface HistoricalGenealogyData {
  pais?: {
    paterno_pai?: HistoricalEntry | null;
    materno_mae?: HistoricalEntry | null;
  };
  avos?: {
    paterno_pai?: HistoricalEntry | null;
    paterno_mae?: HistoricalEntry | null;
    materno_pai?: HistoricalEntry | null;
    materno_mae?: HistoricalEntry | null;
  };
  bisavos?: {
    paipai_pai?: HistoricalEntry | null;
    paipai_mae?: HistoricalEntry | null;
    maepai_pai?: HistoricalEntry | null;
    maepai_mae?: HistoricalEntry | null;
    paimae_pai?: HistoricalEntry | null;
    paimae_mae?: HistoricalEntry | null;
    maemae_pai?: HistoricalEntry | null;
    maemae_mae?: HistoricalEntry | null;
  };
}

function isMeaningfulText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeHistoricalEntry(entry: HistoricalEntry | null | undefined): HistoricalEntry | null {
  if (!entry) return null;
  const nome = isMeaningfulText(entry.nome) ? entry.nome.trim() : null;
  const registro = isMeaningfulText(entry.registro) ? entry.registro.trim() : null;
  const rowid = isMeaningfulText(entry.rowid) ? entry.rowid.trim() : null;
  if (!nome && !registro && !rowid) return null;
  return { nome, registro, rowid };
}

function getHistoricalData(node: GenealogyNode | null | undefined): HistoricalGenealogyData | null {
  const raw = node?.dados_genealogicos;
  if (!raw || typeof raw !== 'object') return null;
  return raw as HistoricalGenealogyData;
}

function toMissingNode(fallbackName: string): GenealogyViewNode {
  return {
    name: fallbackName,
    registry: '-',
    imageUrl: PLACEHOLDER_IMAGE,
    isPlaceholder: true,
  };
}

function toHistoricalNode(entry: HistoricalEntry | null | undefined, fallbackName: string): GenealogyViewNode {
  const normalized = normalizeHistoricalEntry(entry);
  if (!normalized) return toMissingNode(fallbackName);
  return {
    name: normalized.nome || fallbackName,
    registry: normalized.registro || '-',
    imageUrl: PLACEHOLDER_IMAGE,
    isPlaceholder: false,
    isHistorical: true,
  };
}

function toViewNode(node: GenealogyNode | null, fallbackName: string): GenealogyViewNode {
  if (!node) return toMissingNode(fallbackName);
  return {
    id: node.id,
    name: node.name || fallbackName,
    registry: node.registry_number || '-',
    imageUrl: node.main_image_url || PLACEHOLDER_IMAGE,
    isPlaceholder: false,
    isHistorical: node.is_historical === true,
  };
}

function getNode(nodes: Record<string, GenealogyNode>, id?: string | null): GenealogyNode | null {
  if (!id) return null;
  return nodes[id] || null;
}

export function buildGenealogyView(
  genealogy: AnimalGenealogy | null | undefined,
  rootFallback: { id?: string | number | null; name?: string | null; registry?: string | null; imageUrl?: string | null }
): GenealogyView {
  const nodes = genealogy?.nodes || {};
  const rootNode = genealogy?.root || null;

  const root: GenealogyViewNode = rootNode
    ? {
        id: rootNode.id,
        name: rootNode.name || rootFallback.name || 'Animal',
        registry: rootNode.registry_number || rootFallback.registry || '-',
        imageUrl: rootNode.main_image_url || rootFallback.imageUrl || PLACEHOLDER_IMAGE,
        isPlaceholder: false,
      }
    : {
        id: rootFallback.id ? String(rootFallback.id) : undefined,
        name: rootFallback.name || 'Animal',
        registry: rootFallback.registry || '-',
        imageUrl: rootFallback.imageUrl || PLACEHOLDER_IMAGE,
        isPlaceholder: true,
      };

  const fatherNode = getNode(nodes, rootNode?.father_id);
  const motherNode = getNode(nodes, rootNode?.mother_id);
  const historicalData = getHistoricalData(rootNode);

  const fatherViewNode = fatherNode
    ? toViewNode(fatherNode, rootNode?.father_name || 'Pai nao registrado')
    : rootNode?.father_name
      ? toHistoricalNode({ nome: rootNode.father_name }, 'Pai nao registrado')
      : toMissingNode('Pai nao registrado');

  const motherViewNode = motherNode
    ? toViewNode(motherNode, rootNode?.mother_name || 'Mae nao registrada')
    : rootNode?.mother_name
      ? toHistoricalNode({ nome: rootNode.mother_name }, 'Mae nao registrada')
      : toMissingNode('Mae nao registrada');

  const parents = [fatherViewNode, motherViewNode];

  const grandparentNodes: Array<GenealogyNode | null> = [
    fatherNode ? getNode(nodes, fatherNode.father_id) : null,
    fatherNode ? getNode(nodes, fatherNode.mother_id) : null,
    motherNode ? getNode(nodes, motherNode.father_id) : null,
    motherNode ? getNode(nodes, motherNode.mother_id) : null,
  ];

  const grandparents = [
    grandparentNodes[0]
      ? toViewNode(grandparentNodes[0], fatherNode?.father_name || 'Avo (paterno) nao registrado')
      : toHistoricalNode(historicalData?.avos?.paterno_pai, fatherNode?.father_name || 'Avo (paterno) nao registrado'),
    grandparentNodes[1]
      ? toViewNode(grandparentNodes[1], fatherNode?.mother_name || 'Avo (paterna) nao registrada')
      : toHistoricalNode(historicalData?.avos?.paterno_mae, fatherNode?.mother_name || 'Avo (paterna) nao registrada'),
    grandparentNodes[2]
      ? toViewNode(grandparentNodes[2], motherNode?.father_name || 'Avo (materno) nao registrado')
      : toHistoricalNode(historicalData?.avos?.materno_pai, motherNode?.father_name || 'Avo (materno) nao registrado'),
    grandparentNodes[3]
      ? toViewNode(grandparentNodes[3], motherNode?.mother_name || 'Avo (materna) nao registrada')
      : toHistoricalNode(historicalData?.avos?.materno_mae, motherNode?.mother_name || 'Avo (materna) nao registrada'),
  ];

  const greatGrandparentEntries: Array<{
    node: GenealogyNode | null;
    fallbackName: string;
    historical: HistoricalEntry | null | undefined;
  }> = [
    {
      node: grandparentNodes[0] ? getNode(nodes, grandparentNodes[0].father_id) : null,
      fallbackName: grandparentNodes[0]?.father_name || 'Bisavo nao registrado',
      historical: historicalData?.bisavos?.paipai_pai,
    },
    {
      node: grandparentNodes[0] ? getNode(nodes, grandparentNodes[0].mother_id) : null,
      fallbackName: grandparentNodes[0]?.mother_name || 'Bisava nao registrada',
      historical: historicalData?.bisavos?.paipai_mae,
    },
    {
      node: grandparentNodes[1] ? getNode(nodes, grandparentNodes[1].father_id) : null,
      fallbackName: grandparentNodes[1]?.father_name || 'Bisavo nao registrado',
      historical: historicalData?.bisavos?.maepai_pai,
    },
    {
      node: grandparentNodes[1] ? getNode(nodes, grandparentNodes[1].mother_id) : null,
      fallbackName: grandparentNodes[1]?.mother_name || 'Bisava nao registrada',
      historical: historicalData?.bisavos?.maepai_mae,
    },
    {
      node: grandparentNodes[2] ? getNode(nodes, grandparentNodes[2].father_id) : null,
      fallbackName: grandparentNodes[2]?.father_name || 'Bisavo nao registrado',
      historical: historicalData?.bisavos?.paimae_pai,
    },
    {
      node: grandparentNodes[2] ? getNode(nodes, grandparentNodes[2].mother_id) : null,
      fallbackName: grandparentNodes[2]?.mother_name || 'Bisava nao registrada',
      historical: historicalData?.bisavos?.paimae_mae,
    },
    {
      node: grandparentNodes[3] ? getNode(nodes, grandparentNodes[3].father_id) : null,
      fallbackName: grandparentNodes[3]?.father_name || 'Bisavo nao registrado',
      historical: historicalData?.bisavos?.maemae_pai,
    },
    {
      node: grandparentNodes[3] ? getNode(nodes, grandparentNodes[3].mother_id) : null,
      fallbackName: grandparentNodes[3]?.mother_name || 'Bisava nao registrada',
      historical: historicalData?.bisavos?.maemae_mae,
    },
  ];

  const greatGrandparents = greatGrandparentEntries.map((entry) => {
    if (entry.node) return toViewNode(entry.node, entry.fallbackName);
    return toHistoricalNode(entry.historical, entry.fallbackName);
  });

  return { root, parents, grandparents, greatGrandparents };
}
