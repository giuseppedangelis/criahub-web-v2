import svgPaths from "./svg-hsk7dn0zgm";

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame">
          <g id="Vector"></g>
        </g>
      </svg>
    </div>
  );
}

function Breadcrumbs() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="breadcrumbs">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Log de erros, falhas de sincronização e problemas de integração.</p>
      <Frame />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0)] text-center text-nowrap whitespace-pre">Vitor Fernandes</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[24px] text-white w-full">Alertas Críticos do Sistema</p>
      <Breadcrumbs />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p12e4ca00} fill="var(--fill-0, #6B6B6B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#1a1a1a] box-border content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[628px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame1 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Buscar por cliente...</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Frame">
          <path d={svgPaths.p21a38600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="dropdown">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[16px] py-0 relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Filtrar por urgência</p>
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function TextField() {
  return (
    <div className="bg-[#3a3a3a] content-stretch flex flex-col h-[40px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <Dropdown />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <TextField />
    </div>
  );
}

function Frame18() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame19 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Frame">
          <path d={svgPaths.p21a38600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Dropdown1() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="dropdown">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[16px] py-0 relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Filtrar por módulo</p>
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function TextField1() {
  return (
    <div className="basis-0 bg-[#3a3a3a] content-stretch flex flex-col grow h-[40px] items-start min-h-px min-w-px opacity-[0.88] relative rounded-[8px] shrink-0" data-name="Text field">
      <div aria-hidden="true" className="absolute border-0 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <Dropdown1 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0">
      <Frame18 />
      <TextField1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-name="Frame">
      <Frame2 />
      <Frame21 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="basis-0 content-stretch flex font-['Inter:Semi_Bold',sans-serif] font-semibold grow items-center leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-white">
      <p className="relative shrink-0 w-[300px]">Tipo de Alerta</p>
      <p className="relative shrink-0 w-[195px]">Cliente Afetado</p>
      <p className="relative shrink-0 w-[180px]">Módulo</p>
      <p className="relative shrink-0 w-[172px]">Data</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Status</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[36px] items-center px-[16px] py-0 relative w-full">
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="basis-0 content-stretch flex font-['Inter:Regular',sans-serif] font-normal grow items-center leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[300px]">Falha de Sincronização</p>
      <p className="relative shrink-0 w-[195px]">Haras Aurora</p>
      <p className="relative shrink-0 w-[180px]">Plantel</p>
      <p className="relative shrink-0 w-[172px]">25/09/2025</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Aberto</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[36px] items-center px-[16px] py-[8px] relative w-full">
          <Frame10 />
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 content-stretch flex font-['Inter:Regular',sans-serif] font-normal grow items-center leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[300px]">Falha na Cobrança Recorrente</p>
      <p className="relative shrink-0 w-[195px]">Haras Vanguarda</p>
      <p className="relative shrink-0 w-[180px]">Assinaturas</p>
      <p className="relative shrink-0 w-[172px]">25/09/2025</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Aberto</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[36px] items-center px-[16px] py-[8px] relative w-full">
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="basis-0 content-stretch flex font-['Inter:Regular',sans-serif] font-normal grow items-center leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[300px]">Limite de Mídia Atingido</p>
      <p className="relative shrink-0 w-[195px]">Haras Esperança</p>
      <p className="relative shrink-0 w-[180px]">Plantel</p>
      <p className="relative shrink-0 w-[172px]">25/09/2025</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Fechado</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[36px] items-center px-[16px] py-[8px] relative w-full">
          <Frame12 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="basis-0 content-stretch flex font-['Inter:Regular',sans-serif] font-normal grow items-center leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[300px]">Erro no Envio de E-mail</p>
      <p className="relative shrink-0 w-[195px]">Haras Trovão</p>
      <p className="relative shrink-0 w-[180px]">Assinaturas</p>
      <p className="relative shrink-0 w-[172px]">25/09/2025</p>
      <p className="basis-0 grow min-h-px min-w-px relative shrink-0">Fechado</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[36px] items-center px-[16px] py-[8px] relative w-full">
          <Frame14 />
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Frame">
      <Frame6 />
      <Frame7 />
      <Frame13 />
      <Frame15 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          <Frame8 />
          <Frame16 />
        </div>
      </div>
    </div>
  );
}

export default function Contain() {
  return (
    <div className="relative size-full" data-name="Contain">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[48px] relative size-full">
          <Frame20 />
          <Frame5 />
          <Frame17 />
        </div>
      </div>
    </div>
  );
}