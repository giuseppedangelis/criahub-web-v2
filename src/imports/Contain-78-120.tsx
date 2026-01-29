import svgPaths from "./svg-01p82ormz0";

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
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[30px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Funções</p>
      <Frame />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[30px] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0)] text-center text-nowrap whitespace-pre">Vitor Fernandes</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[24px] text-white w-full">Gestão da Equipe</p>
      <Breadcrumbs />
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Equipe</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[6px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Funções</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex h-[40px] items-start p-[4px] relative w-full">
          <Frame1 />
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
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

function Frame5() {
  return (
    <div className="basis-0 bg-[#1a1a1a] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame4 />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#6b6b6b] text-[14px] text-nowrap whitespace-pre">Pesquisar</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start px-[48px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Criar nova função</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame5 />
      <Frame13 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[36px] items-center relative shrink-0">
      <p className="relative shrink-0 w-[30px]">ID</p>
      <p className="relative shrink-0 w-[200px]">{` Nome da Função`}</p>
      <p className="relative shrink-0 text-nowrap whitespace-pre">Tipo de Usuário</p>
      <p className="relative shrink-0 w-[200px]">Módulos Permitidos</p>
      <p className="relative shrink-0 text-nowrap whitespace-pre">Pode Editar?</p>
      <p className="relative shrink-0 text-nowrap whitespace-pre">Pode Visualizar?</p>
      <p className="relative shrink-0 text-nowrap whitespace-pre">Pode Excluir?</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex font-['Inter:Semi_Bold',sans-serif] font-semibold items-center justify-between leading-[28px] not-italic px-[16px] py-0 relative text-[16px] text-white w-full">
          <Frame9 />
          <p className="relative shrink-0 text-center w-[76.5px]">Ações</p>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[36px] items-center leading-[20px] not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[30px]">01</p>
      <p className="relative shrink-0 w-[200px]">Criador (Administrador)</p>
      <p className="relative shrink-0 w-[122px]">Interno</p>
      <p className="relative shrink-0 w-[200px]">Todos</p>
      <p className="relative shrink-0 w-[98px]">Sim</p>
      <p className="relative shrink-0 w-[129px]">Sim</p>
      <p className="relative shrink-0 w-[112px]">Sim</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p35125f00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-[76.5px]">
      <Frame12 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
          <Frame10 />
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[36px] items-center leading-[20px] not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[30px]">02</p>
      <p className="relative shrink-0 w-[200px]">Colaborador (Editor)</p>
      <p className="relative shrink-0 w-[122px]">Interno</p>
      <p className="relative shrink-0 w-[200px]">Equipe de Design</p>
      <p className="relative shrink-0 w-[98px]">Sim</p>
      <p className="relative shrink-0 w-[129px]">Não</p>
      <p className="relative shrink-0 w-[112px]">Sim</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p35125f00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-[76.5px]">
      <Frame16 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
          <Frame15 />
          <Frame17 />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[36px] items-center leading-[20px] not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[30px]">03</p>
      <p className="relative shrink-0 w-[200px]">Visualizador (Leitor)</p>
      <p className="relative shrink-0 w-[122px]">Externo</p>
      <p className="relative shrink-0 w-[200px]">Clientes</p>
      <p className="relative shrink-0 w-[98px]">Não</p>
      <p className="relative shrink-0 w-[129px]">Não</p>
      <p className="relative shrink-0 w-[112px]">Sim</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p35125f00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-[76.5px]">
      <Frame20 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
          <Frame19 />
          <Frame21 />
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[36px] items-center leading-[20px] not-italic relative shrink-0 text-[14px] text-white">
      <p className="relative shrink-0 w-[30px]">04</p>
      <p className="relative shrink-0 w-[200px]">Gerente de Projeto</p>
      <p className="relative shrink-0 w-[122px]">Interno</p>
      <p className="relative shrink-0 w-[200px]">Gestão</p>
      <p className="relative shrink-0 w-[98px]">Sim</p>
      <p className="relative shrink-0 w-[129px]">Sim</p>
      <p className="relative shrink-0 w-[112px]">Não</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p35125f00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-[76.5px]">
      <Frame24 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#3a3a3a] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[16px] py-[8px] relative w-full">
          <Frame23 />
          <Frame25 />
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Frame">
      <Frame14 />
      <Frame18 />
      <Frame22 />
      <Frame26 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-[#1a1a1a] box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] shrink-0 w-[1346px]" data-name="Frame">
      <Frame8 />
      <Frame27 />
    </div>
  );
}

export default function Contain() {
  return (
    <div className="relative size-full" data-name="Contain">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[48px] relative size-full">
          <Frame29 />
          <Frame3 />
          <Frame7 />
          <Frame28 />
        </div>
      </div>
    </div>
  );
}