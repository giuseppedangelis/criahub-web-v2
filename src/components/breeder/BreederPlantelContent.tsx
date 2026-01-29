import { Search, Filter, Grid, List, Plus, Upload, Users, Eye, AlertTriangle, Info, FileUp, Edit, ChevronLeft, ChevronRight, GitBranch, Baby, Award, Video, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { NativeSelect } from '../ui/native-select';
import { BreederCadastrarAnimal } from './BreederCadastrarAnimal';
import { BreederAnimalDetails } from './BreederAnimalDetails';
import { BreederEditarAnimal } from './BreederEditarAnimal';
import { QuickGenealogyModal } from './QuickGenealogyModal';
import { AnimalCard } from './AnimalCard';
import { AdvancedFiltersModal } from './AdvancedFiltersModal';

// Função auxiliar para formatar data de nascimento
function formatBirthDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

// Função auxiliar para obter classes de cor baseado no status
function getStatusColorClasses(status: string): string {
  switch (status) {
    case 'Ativo':
      return 'bg-green-500 dark:bg-gray-600 text-white dark:text-gray-200';
    case 'Gestante':
      return 'bg-pink-500 dark:bg-gray-600 text-white dark:text-gray-200';
    case 'Em Cobertura':
      return 'bg-blue-500 dark:bg-gray-600 text-white dark:text-gray-200';
    case 'Em Crescimento':
      return 'bg-yellow-500 dark:bg-gray-600 text-white dark:text-gray-200';
    default:
      return 'bg-gray-500 dark:bg-gray-600 text-white dark:text-gray-200';
  }
}

interface Animal {
  id: number;
  name: string;
  registry: string;
  chip?: string; // Número do chip RFID
  marca?: string; // Número da marca/ferro
  sex?: 'Macho' | 'Fêmea'; // FASE 19: Sexo do animal
  birthDate?: string; // Data de nascimento (ISO format)
  harasOrigem?: string; // FASE 19: Haras de origem
  category: string;
  age: string;
  haras: string;
  status: string;
  statusColor: string;
  // NOVOS CAMPOS: Gestão de Status no Plantel (Ativo/Inativo)
  statusAtividade: 'Ativo' | 'Inativo'; // Status no Plantel
  motivoInativacao?: 'Vendido' | 'Óbito' | 'Doado' | 'Transferido'; // Motivo da inativação
  dataInativacao?: string; // Data da inativação (ISO format)
  statusHistorico?: Array<{ // Histórico de mudanças de status
    data: string;
    statusAnterior: string;
    statusNovo: string;
    motivo?: string;
    usuario: string;
  }>;
  localizacao?: string; // Baia, Pasto, Serviço
  servicoTipo?: string; // Reprodução, Trabalho, Repouso, Outro
  filhos?: number; // Contador de descendentes
  premiacoes?: number; // Contador de prêmios importados
  image: string;
  images: string[];
  imageCaptions?: string[];
  // FASE 25-27: Campos de Reprodução
  reproductionType?: 'Doadora' | 'Matriz' | 'Garanhão' | 'Castrado' | 'Receptora';
  activeForReproduction?: boolean;
  coverageCount?: number; // FASE 26: Contador de coberturas
  lastReproductiveEvent?: { // FASE 27: Último evento reprodutivo
    type: string;
    date: string;
  };
}

export function BreederPlantelContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAnimalDetails, setShowAnimalDetails] = useState(false);
  const [showEditarAnimal, setShowEditarAnimal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCadastrarAnimal, setShowCadastrarAnimal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [initialTab, setInitialTab] = useState<string>('overview');
  const [showQuickGenealogyModal, setShowQuickGenealogyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Estados dos filtros (FASES 12, 13, 14, 15)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSexo, setFilterSexo] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterIdade, setFilterIdade] = useState('todos');
  const [filterFilhos, setFilterFilhos] = useState('todos');
  const [filterPremiacoes, setFilterPremiacoes] = useState('todos');
  
  // Lista de animais (FASE 18 - Deletar animal)
  const [animalsList, setAnimalsList] = useState<Animal[]>([
    // Animais da Genealogia - Pais
    { 
      id: 101, 
      name: 'Ouro', 
      registry: 'ABCCMM 123456-78',
      chip: '982000123456789',
      marca: 'VV-101',
      sex: 'Macho',
      birthDate: '2016-05-10',
      category: 'Reprodutor', 
      age: '8 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo',
      localizacao: 'Pasto Norte',
      filhos: 12,
      premiacoes: 5,
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1757496798749-a5a9fc0b7c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwcnVubmluZ3xlbnwxfHx8fDE3NjQxMjA1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1650735900951-f05161d3799c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvcnNlJTIwaGVhZCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Reprodutor Ouro - Retrato oficial 2024',
        'Em movimento demonstrando marcha picada',
        'Detalhe da cabeça - Expressão e conformação'
      ]
    },
    { 
      id: 102, 
      name: 'Aurora', 
      registry: 'ABCCMM 654321-89',
      chip: '982000654321890',
      marca: 'VV-102',
      sex: 'Fêmea',
      birthDate: '2017-09-14',
      filhos: 8,
      premiacoes: 3,
      category: 'Reprodutora', 
      age: '7 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo',
      localizacao: 'Baia 3', 
      image: 'https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1685510543155-0ae0498a8c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwc2lkZSUyMHZpZXd8ZW58MXx8fHwxNzY0MTIwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Matriz Aurora - Retrato frontal',
        'Vista lateral - Conformação e estrutura',
        'No pasto - Alimentação natural'
      ]
    },
    // Animais da Genealogia - Avós
    { 
      id: 201, 
      name: 'Hércules', 
      registry: 'ABCCMM 111111-11',
      chip: '982000111111110',
      marca: 'VV-201',
      sex: 'Macho',
      birthDate: '2012-02-18',
      filhos: 23,
      premiacoes: 8,
      category: 'Reprodutor', 
      age: '12 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo',
      localizacao: 'Serviço',
      servicoTipo: 'Reprodução', 
      image: 'https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1685510543155-0ae0498a8c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwc2lkZSUyMHZpZXd8ZW58MXx8fHwxNzY0MTIwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Hércules - Patriarca da linhagem',
        'Vista lateral - 12 anos de idade'
      ]
    },
    { 
      id: 202, 
      name: 'Safira', 
      registry: 'ABCCMM 222222-22',
      chip: '982000222222220',
      marca: 'VV-202',
      sex: 'Fêmea',
      birthDate: '2013-07-25',
      filhos: 15,
      premiacoes: 6,
      category: 'Reprodutora', 
      age: '11 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo',
      localizacao: 'Pasto Sul', 
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Safira - Matriarca de excelência',
        'Em liberdade no campo'
      ]
    },
    { 
      id: 203, 
      name: 'Trovão', 
      registry: 'ABCCMM 333333-33',
      chip: '982000333333330',
      marca: 'VV-203',
      sex: 'Macho',
      birthDate: '2014-12-03',
      filhos: 18,
      premiacoes: 7,
      category: 'Reprodutor', 
      age: '10 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo',
      localizacao: 'Baia 1', 
      image: 'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1757496798749-a5a9fc0b7c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwcnVubmluZ3xlbnwxfHx8fDE3NjQxMjA1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1650735900951-f05161d3799c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvcnNlJTIwaGVhZCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Trovão - Linhagem de campeões',
        'Demonstração de andamento',
        'Perfil característico da raça'
      ]
    },
    { 
      id: 204, 
      name: 'Serena', 
      registry: 'ABCCMM 444444-44',
      chip: '982000444444440',
      marca: 'VV-204',
      sex: 'Fêmea',
      birthDate: '2015-06-15',
      filhos: 11,
      premiacoes: 4,
      category: 'Reprodutora', 
      age: '9 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo',
      localizacao: 'Pasto Oeste', 
      image: 'https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Serena - Elegância natural',
        'Pastando tranquilamente'
      ]
    },
    // Animais principais do plantel
    { 
      id: 1, 
      name: 'Estrela Mangalarga', 
      registry: 'MM-2020-1234',
      chip: '982000202012340',
      marca: 'VV-001',
      sex: 'Fêmea',
      birthDate: '2020-01-15',
      harasOrigem: 'Fazenda Santa Maria',
      filhos: 2,
      category: 'Reprodutora', 
      age: '4 anos', 
      haras: 'Vale Verde', 
      status: 'Gestante', 
      statusColor: 'bg-pink-500',
      statusAtividade: 'Ativo',
      localizacao: 'Baia 5',
      reproductionType: 'Doadora',
      activeForReproduction: true,
      coverageCount: 5,
      lastReproductiveEvent: {
        type: 'Coleta de Embrião',
        date: '15/11/2024'
      }, 
      image: 'https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1610137856583-e71966c4351d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzNDA4Njk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1685510543155-0ae0498a8c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwc2lkZSUyMHZpZXd8ZW58MXx8fHwxNzY0MTIwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Retrato oficial - Vista frontal para registro',
        'Vista lateral mostrando conformação',
        'Pastando no campo - Momento de descanso'
      ]
    },
    { 
      id: 2, 
      name: 'Relâmpago Negro', 
      registry: 'MM-2018-5678',
      chip: '982000201856780',
      marca: 'VV-002',
      sex: 'Macho',
      birthDate: '2018-03-20',
      filhos: 1, // FASE 28: Consistência com dados de filhos
      category: 'Reprodutor', 
      age: '6 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo',
      reproductionType: 'Garanhão',
      activeForReproduction: true,
      coverageCount: 18,
      lastReproductiveEvent: {
        type: 'Cobertura Natural',
        date: '10/12/2024'
      }, 
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1757496798749-a5a9fc0b7c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwcnVubmluZ3xlbnwxfHx8fDE3NjQxMjA1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1650735900951-f05161d3799c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvcnNlJTIwaGVhZCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Garanhão premiado - Campeão regional 2023',
        'Em movimento demonstrando marcha',
        'Close da cabeça mostrando características da raça'
      ]
    },
    { 
      id: 3, 
      name: 'Lua Dourada', 
      registry: 'MM-2019-9012',
      chip: '982000201990120',
      marca: 'VV-003',
      sex: 'Fêmea',
      birthDate: '2019-06-12',
      category: 'Reprodutora', 
      age: '5 anos', 
      haras: 'Vale Verde', 
      status: 'Em Cobertura', 
      statusColor: 'bg-blue-500',
      statusAtividade: 'Ativo', 
      image: 'https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1657150946362-3aee0bbc8163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxvbWlubyUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1685510543155-0ae0498a8c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwc2lkZSUyMHZpZXd8ZW58MXx8fHwxNzY0MTIwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Lua Dourada - Égua palomino de excelência',
        'Momento de descanso no piquete',
        'Conformação lateral - Estrutura física'
      ]
    },
    { 
      id: 4, 
      name: 'Vento Sul', 
      registry: 'MM-2023-3456',
      chip: '982000202334560',
      marca: 'VV-004',
      sex: 'Macho',
      birthDate: '2023-02-28',
      category: 'Potro', 
      age: '1 ano', 
      haras: 'Vale Verde', 
      status: 'Em Crescimento', 
      statusColor: 'bg-yellow-500',
      statusAtividade: 'Ativo', 
      image: 'https://images.unsplash.com/photo-1648242977013-6f21e5a695f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGhvcnNlJTIwZm9hbHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1648242977013-6f21e5a695f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGhvcnNlJTIwZm9hbHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Vento Sul - Potro com 1 ano',
        'Primeira fase de crescimento'
      ]
    },
    { 
      id: 5, 
      name: 'Bella Vista', 
      registry: 'MM-2021-7890',
      chip: '982000202178900',
      marca: 'VV-005',
      sex: 'Fêmea',
      birthDate: '2021-08-05',
      category: 'Reprodutora', 
      age: '3 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo', 
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1685510543155-0ae0498a8c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwc2lkZSUyMHZpZXd8ZW58MXx8fHwxNzY0MTIwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Bella Vista - Égua castanha jovem',
        'Vista lateral - Morfologia',
        'Alimentação no campo'
      ]
    },
    { 
      id: 6, 
      name: 'Trovão Branco', 
      registry: 'MM-2019-2468',
      chip: '982000201924680',
      marca: 'VV-006',
      sex: 'Macho',
      birthDate: '2019-11-18',
      category: 'Reprodutor', 
      age: '5 anos', 
      haras: 'Vale Verde', 
      status: 'Ativo', 
      statusColor: 'bg-green-500',
      statusAtividade: 'Ativo', 
      image: 'https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1724783483178-79f7ef970c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhvcnNlJTIwbWFyZXxlbnwxfHx8fDE3NjM1MDAxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1685510543155-0ae0498a8c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwc2lkZSUyMHZpZXd8ZW58MXx8fHwxNzY0MTIwNTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1757496798749-a5a9fc0b7c4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwcnVubmluZ3xlbnwxfHx8fDE3NjQxMjA1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Trovão Branco - Reprodutor branco',
        'Conformação lateral',
        'Em movimento livre'
      ]
    },
    { 
      id: 7, 
      name: 'Noite Estrelada', 
      registry: 'MM-2022-1357',
      chip: '982000202213570',
      marca: 'VV-007',
      sex: 'Fêmea',
      birthDate: '2022-04-22',
      category: 'Potra', 
      age: '2 anos', 
      haras: 'Vale Verde', 
      status: 'Em Crescimento', 
      statusColor: 'bg-yellow-500',
      statusAtividade: 'Ativo', 
      image: 'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1751715773655-2140695a3a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwaG9yc2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM1MDAxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1608710665474-ad5b01e0ebf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGhvcnNlJTIwZ3JhemluZyUyMGZpZWxkfGVufDF8fHx8MTc2NDEyMDU1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      imageCaptions: [
        'Noite Estrelada - Potra em desenvolvimento',
        'Fase juvenil - 2 anos'
      ]
    },
    { 
      id: 8, 
      name: 'Sol Nascente', 
      registry: 'MM-2020-9876',
      chip: '982000202098760',
      marca: 'VV-008',
      birthDate: '2020-07-30',
      category: 'Reprodutora', 
      age: '4 anos', 
      haras: 'Vale Verde', 
      status: 'Gestante', 
      statusColor: 'bg-pink-500', 
      statusAtividade: 'Ativo',
      image: 'https://images.unsplash.com/photo-1748212550010-74453d20e3ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXklMjBob3JzZSUyMHJ1bm5pbmd8ZW58MXx8fHwxNzYzNTAwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1748212550010-74453d20e3ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXklMjBob3JzZSUyMHJ1bm5pbmd8ZW58MXx8fHwxNzYzNTAwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ] 
    },
    // ANIMAIS INATIVOS - Exemplos de vendas
    { 
      id: 9, 
      name: 'Estrela da Manhã', 
      registry: 'MM-2018-5432',
      chip: '982000201854320',
      marca: 'VV-009',
      sex: 'Fêmea',
      birthDate: '2018-06-15',
      category: 'Reprodutora', 
      age: '6 anos', 
      haras: 'Vale Verde', 
      status: 'Inativo', 
      statusColor: 'bg-gray-500',
      statusAtividade: 'Inativo',
      motivoInativacao: 'Vendido',
      dataInativacao: '2024-11-20',
      statusHistorico: [
        {
          data: '2024-11-20',
          statusAnterior: 'Ativo',
          statusNovo: 'Inativo',
          motivo: 'Vendido',
          usuario: 'João Silva (Criador)'
        }
      ],
      filhos: 4,
      image: 'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1667992711873-4bd87cbfbb65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdG51dCUyMGhvcnNlfGVufDF8fHx8MTc2MzUwMDExNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ] 
    },
    { 
      id: 10, 
      name: 'Trovão Negro', 
      registry: 'MM-2017-3210',
      chip: '982000201732100',
      marca: 'VV-010',
      sex: 'Macho',
      birthDate: '2017-03-10',
      category: 'Reprodutor', 
      age: '7 anos', 
      haras: 'Vale Verde', 
      status: 'Inativo', 
      statusColor: 'bg-gray-500',
      statusAtividade: 'Inativo',
      motivoInativacao: 'Vendido',
      dataInativacao: '2024-10-05',
      statusHistorico: [
        {
          data: '2024-10-05',
          statusAnterior: 'Ativo',
          statusNovo: 'Inativo',
          motivo: 'Vendido',
          usuario: 'João Silva (Criador)'
        }
      ],
      filhos: 8,
      image: 'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
      images: [
        'https://images.unsplash.com/photo-1656964353220-99aa5acc47e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN0YWxsaW9uJTIwaG9yc2V8ZW58MXx8fHwxNzYzNTAwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ] 
    },
  ]);

  // FASE 11: Lógica de filtro de busca
  // FASES 12-15: Lógica de filtros (idade, categoria, filhos, premiações)
  const filteredAnimals = animalsList.filter((animal) => {
    // Filtro de busca (FASE 11)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      animal.name.toLowerCase().includes(searchLower) ||
      animal.registry.toLowerCase().includes(searchLower) ||
      (animal.chip && animal.chip.toLowerCase().includes(searchLower)) ||
      animal.haras.toLowerCase().includes(searchLower);

    // Filtro de sexo
    const matchesSexo = filterSexo === 'todos' || 
      (filterSexo === 'machos' && animal.sex === 'Macho') ||
      (filterSexo === 'femeas' && animal.sex === 'Fêmea');

    // Filtro de Status no Plantel (Ativos/Inativos)
    const matchesStatus = filterStatus === 'todos' || 
      (filterStatus === 'ativos' && (animal.statusAtividade === 'Ativo' || !animal.statusAtividade)) ||
      (filterStatus === 'inativos' && animal.statusAtividade === 'Inativo');

    // Filtro de categoria (FASE 13)
    const matchesCategoria = filterCategoria === 'todos' || 
      animal.category.toLowerCase().includes(filterCategoria.toLowerCase());

    // Filtro de idade (FASE 12)
    let matchesIdade = true;
    if (filterIdade !== 'todos' && animal.birthDate) {
      const birthYear = parseInt(animal.birthDate.split('-')[0]);
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      if (filterIdade === 'menos_1') matchesIdade = age < 1;
      else if (filterIdade === '1_3') matchesIdade = age >= 1 && age <= 3;
      else if (filterIdade === '3_5') matchesIdade = age >= 3 && age <= 5;
      else if (filterIdade === 'mais_5') matchesIdade = age > 5;
    }

    // Filtro de filhos (FASE 14)
    let matchesFilhos = true;
    if (filterFilhos === 'com_filhos') matchesFilhos = (animal.filhos || 0) > 0;
    else if (filterFilhos === 'sem_filhos') matchesFilhos = (animal.filhos || 0) === 0;

    // Filtro de premiações (FASE 15)
    let matchesPremiacoes = true;
    if (filterPremiacoes === 'com_premiacoes') matchesPremiacoes = (animal.premiacoes || 0) > 0;
    else if (filterPremiacoes === 'sem_premiacoes') matchesPremiacoes = (animal.premiacoes || 0) === 0;

    return matchesSearch && matchesSexo && matchesStatus && matchesCategoria && 
           matchesIdade && matchesFilhos && matchesPremiacoes;
  });

  // FASE 18: Função para deletar animal
  const handleDeleteAnimal = (animal: Animal) => {
    setAnimalToDelete(animal);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (animalToDelete) {
      setAnimalsList(animalsList.filter(a => a.id !== animalToDelete.id));
      setShowDeleteModal(false);
      setAnimalToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {showCadastrarAnimal ? (
        <BreederCadastrarAnimal onBack={() => setShowCadastrarAnimal(false)} />
      ) : showAnimalDetails && selectedAnimal ? (
        <BreederAnimalDetails
          key={selectedAnimal.id}
          animal={selectedAnimal}
          onBack={() => {
            setShowAnimalDetails(false);
            setSelectedAnimal(null);
            setInitialTab('overview');
          }}
          onEdit={() => {
            setShowAnimalDetails(false);
            setShowEditarAnimal(true);
          }}
          onViewAnimal={(animalId) => {
            // Simula carregar dados do animal da genealogia
            // Em produção, isso faria uma busca no banco de dados
            console.log('Navegando para animal ID:', animalId);
            const mockAnimal = animalsList.find(a => a.id === animalId);
            console.log('Animal encontrado:', mockAnimal);
            if (mockAnimal) {
              setSelectedAnimal(mockAnimal);
              setInitialTab('overview');
              setShowAnimalDetails(true);
              // Força uma re-renderização com o novo animal selecionado
            } else {
              console.warn('Animal não encontrado na lista. ID:', animalId);
            }
          }}
          initialTab={initialTab}
        />
      ) : showEditarAnimal && selectedAnimal ? (
        <BreederEditarAnimal
          animal={selectedAnimal}
          onBack={() => {
            setShowEditarAnimal(false);
            setSelectedAnimal(null);
          }}
          onSave={() => {
            // Simula o salvamento
            console.log('Animal atualizado:', selectedAnimal);
          }}
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SummaryCard title="Total" value="122" />
            <SummaryCard title="Machos" value="74" />
            <SummaryCard title="Fêmeas" value="48" />
            <SummaryCard title="Ativos" value="34" />
          </div>

          {/* Actions and Filters */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <button
                  className="w-full lg:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  onClick={() => setShowImportModal(true)}
                >
                  <Upload className="w-5 h-5" />
                  Importar Planilha
                </button>
                <button
                  className="w-full lg:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  onClick={() => setShowCadastrarAnimal(true)}
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Animal
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch">
              <div className="relative flex-[2]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#6b6b6b] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nome, registro, chip ou haras..."
                  className="w-full h-12 pl-10 pr-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <NativeSelect
                  value={filterSexo}
                  onChange={(e) => setFilterSexo(e.target.value)}
                >
                  <option value="todos">Todos os Sexos</option>
                  <option value="machos">Machos</option>
                  <option value="femeas">Fêmeas</option>
                </NativeSelect>
              </div>
              <div className="w-full md:w-48">
                <NativeSelect
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="todos">Status no Plantel</option>
                  <option value="ativos">Ativos</option>
                  <option value="inativos">Inativos</option>
                </NativeSelect>
              </div>
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="w-full md:w-auto h-12 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4 flex-shrink-0" />
                Filtros Avançados
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 h-12 rounded-xl transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary dark:bg-white text-white dark:text-black'
                      : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white border border-border dark:border-[#3a3a3a]'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 h-12 rounded-xl transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary dark:bg-white text-white dark:text-black'
                      : 'bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white border border-border dark:border-[#3a3a3a]'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Animals Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredAnimals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('overview');
                      setShowAnimalDetails(true);
                    }}
                    onEdit={() => {
                      setSelectedAnimal(animal);
                      setShowEditarAnimal(true);
                    }}
                    onViewGenealogy={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('genealogy');
                      setShowAnimalDetails(true);
                    }}
                    onViewVideo={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('videos');
                      setShowAnimalDetails(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAnimals.map((animal) => (
                  <AnimalListItem
                    key={animal.id}
                    animal={animal}
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('overview');
                      setShowAnimalDetails(true);
                    }}
                    onEdit={() => {
                      setSelectedAnimal(animal);
                      setShowEditarAnimal(true);
                    }}
                    onViewGenealogy={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('genealogy');
                      setShowAnimalDetails(true);
                    }}
                    onViewVideo={() => {
                      setSelectedAnimal(animal);
                      setInitialTab('videos');
                      setShowAnimalDetails(true);
                    }}
                    onDelete={() => handleDeleteAnimal(animal)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Import Modal */}
          {showImportModal && (
            <ImportModal
              onClose={() => setShowImportModal(false)}
            />
          )}

          {/* Advanced Filters Modal */}
          {showAdvancedFilters && (
            <AdvancedFiltersModal
              onClose={() => setShowAdvancedFilters(false)}
              filterCategoria={filterCategoria}
              setFilterCategoria={setFilterCategoria}
              filterIdade={filterIdade}
              setFilterIdade={setFilterIdade}
              filterFilhos={filterFilhos}
              setFilterFilhos={setFilterFilhos}
              filterPremiacoes={filterPremiacoes}
              setFilterPremiacoes={setFilterPremiacoes}
            />
          )}

          {/* FASE 18: Delete Confirmation Modal */}
          {showDeleteModal && animalToDelete && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-border dark:border-[rgba(255,255,255,0.1)]">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg text-foreground dark:text-white mb-2">Confirmar Exclusão</h3>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Tem certeza que deseja excluir o animal <span className="font-semibold text-foreground dark:text-white">{animalToDelete.name}</span>?
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-2">
                      Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setAnimalToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <p className="text-muted-foreground dark:text-[#99a1af] mb-2">{title}</p>
      <p className="text-3xl text-foreground dark:text-white">{value}</p>
    </div>
  );
}

function AnimalListItem({ animal, onClick, onEdit, onViewGenealogy, onViewVideo, onDelete }: any) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors relative"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground dark:text-white mb-1">{animal.name}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {animal.registry} • {animal.category} • {animal.age}
        </p>
        {animal.chip && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
            Chip: {animal.chip}
          </p>
        )}
        {animal.marca && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
            Marca: {animal.marca}
          </p>
        )}
        {animal.birthDate && (
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
            Nascimento: {formatBirthDate(animal.birthDate)}
          </p>
        )}
        {animal.filhos !== undefined && animal.filhos > 0 && (
          <p className="text-xs text-primary dark:text-white mt-1 flex items-center gap-1">
            <Baby className="w-3 h-3" /> {animal.filhos} {animal.filhos === 1 ? 'filho' : 'filhos'}
          </p>
        )}
        {animal.premiacoes !== undefined && animal.premiacoes > 0 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1 flex items-center gap-1">
            <Award className="w-3 h-3" /> {animal.premiacoes} {animal.premiacoes === 1 ? 'premiação' : 'premiações'}
          </p>
        )}
      </div>
      <span className={`px-3 py-1 ${getStatusColorClasses(animal.status)} text-xs rounded-full flex-shrink-0`}>
        {animal.status}
      </span>
      {/* FASE 17: Botão Ver Vídeos */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewVideo();
        }}
        className="bg-purple-600 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full p-1.5 hover:opacity-90 transition-opacity ml-2"
        title="Ver Vídeos"
      >
        <Video className="w-4 h-4" />
      </button>
      {/* FASE 10: Botão Ver Genealogia */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewGenealogy();
        }}
        className="bg-green-600 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full p-1.5 hover:opacity-90 transition-opacity"
        title="Ver Genealogia"
      >
        <GitBranch className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="bg-primary dark:bg-white text-white dark:text-black rounded-full p-1.5 hover:opacity-90 transition-opacity"
        title="Editar"
      >
        <Edit className="w-4 h-4" />
      </button>
      {/* FASE 18: Botão Deletar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="bg-red-600 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full p-1.5 hover:opacity-90 transition-opacity"
        title="Excluir Animal"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function ImportModal({ onClose }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border dark:border-[#3a3a3a]">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl text-foreground dark:text-white mb-2">Importar Planilha</h3>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Instruções */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-500 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-white dark:text-gray-200" />
              </div>
              <h4 className="text-xl text-foreground dark:text-white">Instruções para Importação</h4>
            </div>

            {/* Formato do Arquivo */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Formato do Arquivo aceito</label>
              <div className="bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-lg px-4 py-2.5">
                <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">Arquivos Excel (.xlsx) com dados organizados em colunas</p>
              </div>
            </div>

            {/* Colunas Recomendadas */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Colunas Recomendadas</label>
              <div className="bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-lg px-4 py-3">
                <div className="grid grid-cols-2 gap-x-16">
                  <ul className="text-sm text-muted-foreground dark:text-[#6b6b6b] space-y-1">
                    <li>• Nome do Animal</li>
                    <li>• Registro</li>
                    <li>• Data de Nascimento</li>
                    <li>• Sexo</li>
                  </ul>
                  <ul className="text-sm text-muted-foreground dark:text-[#6b6b6b] space-y-1">
                    <li>• Pelagem</li>
                    <li>• Status</li>
                    <li>• Categoria</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Limitações do Plano Free */}
            <div className="border border-border dark:border-[#616161] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-muted-foreground dark:text-[#6b6b6b]" />
                <h5 className="text-sm text-foreground dark:text-white">Limitações do Plano Free</h5>
              </div>
              <ul className="text-sm text-muted-foreground dark:text-[#6b6b6b] space-y-1 pl-6">
                <li>• Máximo 1 importação por mês</li>
                <li>• Limite total de 100 animais</li>
                <li>• Animais atuais: 6/100</li>
              </ul>
            </div>

            {/* Selecionar Arquivo */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Selecionar Arquivo</label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-border dark:border-[#616161] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-white/50 transition-colors"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <FileUp className="w-12 h-12 text-muted-foreground dark:text-[#616161] mb-3" />
                <p className="text-foreground dark:text-white mb-1">Arraste e solte o arquivo aqui</p>
                <p className="text-sm text-muted-foreground dark:text-[#6b6b6b]">ou clique para selecionar o arquivo</p>
                {selectedFile && (
                  <p className="text-sm text-primary dark:text-white mt-3">✓ {selectedFile.name}</p>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-transparent border border-muted-foreground dark:border-[#b0b0b0] text-muted-foreground dark:text-[#b0b0b0] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!selectedFile}
            className="px-8 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
}