import { Search } from 'lucide-react';

function EmptyTabState({
  searchPlaceholder,
  title,
  description,
}: {
  searchPlaceholder: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
        />
      </div>

      <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6 text-center">
        <p className="text-foreground dark:text-white mb-1">{title}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{description}</p>
      </div>
    </div>
  );
}

export function CondominiumAnimalsTab() {
  return (
    <EmptyTabState
      searchPlaceholder="Buscar por animal ou condomínio..."
      title="Nenhum animal em condomínio encontrado"
      description="Os dados serão exibidos aqui conforme os vínculos forem registrados no sistema."
    />
  );
}

export function AnimalAwardsTab() {
  return (
    <EmptyTabState
      searchPlaceholder="Buscar por animal ou evento..."
      title="Nenhuma premiação de animais associada"
      description="As premiações aparecerão aqui após importação ABCCMM e vinculação dos animais."
    />
  );
}

export function AssociatedCondominiumsTab() {
  return (
    <EmptyTabState
      searchPlaceholder="Buscar por condomínio..."
      title="Nenhum condomínio associado"
      description="Condomínios vinculados ao assessor serão listados nesta aba."
    />
  );
}

export function AssociatedAwardsTab() {
  return (
    <EmptyTabState
      searchPlaceholder="Buscar por premiação..."
      title="Nenhuma premiação associada"
      description="Premiações vinculadas ao assessor aparecerão aqui conforme forem registradas."
    />
  );
}
