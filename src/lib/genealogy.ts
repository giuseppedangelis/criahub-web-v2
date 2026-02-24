import type { AnimalGenealogy, GenealogyNode } from '@/types';

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' fill='%23f2f2f2'/><circle cx='60' cy='46' r='18' fill='none' stroke='%23999' stroke-width='4'/><path d='M30 94c0-16 13-28 30-28s30 12 30 28' fill='none' stroke='%23999' stroke-width='4'/></svg>";

export interface GenealogyViewNode {
  id?: string;
  name: string;
  registry: string;
  imageUrl: string;
  isPlaceholder: boolean;
}

export interface GenealogyView {
  root: GenealogyViewNode;
  parents: GenealogyViewNode[];
  grandparents: GenealogyViewNode[];
  greatGrandparents: GenealogyViewNode[];
}

function toViewNode(node: GenealogyNode | null, fallbackName: string): GenealogyViewNode {
  if (!node) {
    return {
      name: fallbackName,
      registry: '-',
      imageUrl: PLACEHOLDER_IMAGE,
      isPlaceholder: true,
    };
  }

  return {
    id: node.id,
    name: node.name || fallbackName,
    registry: node.registry_number || '-',
    imageUrl: node.main_image_url || PLACEHOLDER_IMAGE,
    isPlaceholder: false,
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

  const parents = [
    toViewNode(fatherNode, rootNode?.father_name || 'Pai nao registrado'),
    toViewNode(motherNode, rootNode?.mother_name || 'Mae nao registrada'),
  ];

  const grandparentNodes = [
    fatherNode ? getNode(nodes, fatherNode.father_id) : null,
    fatherNode ? getNode(nodes, fatherNode.mother_id) : null,
    motherNode ? getNode(nodes, motherNode.father_id) : null,
    motherNode ? getNode(nodes, motherNode.mother_id) : null,
  ];

  const grandparents = [
    toViewNode(grandparentNodes[0], fatherNode?.father_name || 'Avo (paterno) nao registrado'),
    toViewNode(grandparentNodes[1], fatherNode?.mother_name || 'Avo (paterna) nao registrada'),
    toViewNode(grandparentNodes[2], motherNode?.father_name || 'Avo (materno) nao registrado'),
    toViewNode(grandparentNodes[3], motherNode?.mother_name || 'Avo (materna) nao registrada'),
  ];

  const greatGrandparents: GenealogyViewNode[] = [];
  grandparentNodes.forEach((grandparent) => {
    greatGrandparents.push(
      toViewNode(
        grandparent ? getNode(nodes, grandparent.father_id) : null,
        grandparent?.father_name || 'Bisavo nao registrado'
      ),
      toViewNode(
        grandparent ? getNode(nodes, grandparent.mother_id) : null,
        grandparent?.mother_name || 'Bisava nao registrada'
      )
    );
  });

  return { root, parents, grandparents, greatGrandparents };
}
