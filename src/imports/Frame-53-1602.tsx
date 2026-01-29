import svgPaths from "./svg-ustlon2n3u";

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[36px] not-italic relative shrink-0 text-nowrap w-full whitespace-pre" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[24px] text-white">Configurações</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] text-gray-500">Gerencie suas preferências e configurações da conta</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Perfil</p>
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
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Segurança</p>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Gerais</p>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Colaboradores</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Frame">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Plano</p>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex h-[40px] items-start p-[4px] relative w-full">
          <Frame1 />
          <Frame2 />
          <Frame3 />
          <Frame4 />
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[36px] not-italic relative shrink-0 text-nowrap whitespace-pre" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[24px] text-white">Configurações de Segurança</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] text-gray-500">Mantenha sua conta protegida com configurações avançadas de segurança</p>
    </div>
  );
}

function Frame55() {
  return (
    <div className="bg-emerald-500 box-border content-stretch flex gap-[10px] h-[20px] items-center justify-center px-[10px] py-0 relative rounded-[6px] shrink-0">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[30px] not-italic relative shrink-0 text-[12px] text-nowrap text-right text-white whitespace-pre">Premium</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Frame55 />
    </div>
  );
}

function Frame57() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame7 />
      <Frame57 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <Frame59 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame9 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame11 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[36px] not-italic relative shrink-0 text-nowrap whitespace-pre" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[24px] text-white">Senha e Autenticação</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] text-gray-500">Configure suas opções de autenticação</p>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame14 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[36px] not-italic relative shrink-0 text-nowrap whitespace-pre" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[20px] text-white">Senha e Autenticação</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] text-gray-500">Mantenha sua conta segura com uma senha forte</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-white box-border content-stretch flex items-start px-[48px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Alterar Senha</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0">
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Frame13 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame17 />
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame15 />
      <Frame56 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p1c8fa880} fill="var(--fill-0, #F59E0B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Autenticação em Dois Fatores</p>
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <Frame62 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] not-italic relative shrink-0 text-[16px] text-gray-500 text-nowrap whitespace-pre">Adicione uma camada extra de segurança à sua conta</p>
    </div>
  );
}

function Group() {
  return (
    <div className="h-[18px] relative shrink-0 w-[40px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 18">
        <g id="Group 13">
          <rect fill="var(--fill-0, #10B981)" height="18" id="Rectangle 34624139" rx="8" width="40" />
          <circle cx="31" cy="9" fill="var(--fill-0, white)" id="Ellipse 1" r="7" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Group />
    </div>
  );
}

function Frame58() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame20 />
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame19 />
      <Frame58 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <Frame64 />
          <Frame60 />
          <Frame61 />
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame21 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow items-start min-h-px min-w-px relative rounded-[16px] shrink-0" data-name="Frame">
      <Frame22 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame23 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p1c8fa880} fill="var(--fill-0, #F59E0B)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">Sessões e Dispositivos</p>
      <Frame25 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <Frame63 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] not-italic relative shrink-0 text-[16px] text-gray-500 text-nowrap whitespace-pre">Gerencie suas sessões ativas e dispositivos conectados</p>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame26 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[36px] not-italic relative shrink-0 text-nowrap whitespace-pre" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[20px] text-white">Visualizar Sessões Ativas</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] text-gray-500">Veja todos os dispositivos onde sua conta está conectada</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-white box-border content-stretch flex items-start px-[48px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Ver Sessões</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0">
      <Frame28 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Frame29 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame30 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame27 />
      <Frame66 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Timeout Automático de Sessão</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <Frame68 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] not-italic relative shrink-0 text-[16px] text-gray-500 text-nowrap whitespace-pre">Encerra automaticamente a sessão após período de inatividade</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="h-[18px] relative shrink-0 w-[40px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 18">
        <g id="Group 13">
          <rect fill="var(--fill-0, #10B981)" height="18" id="Rectangle 34624139" rx="8" width="40" />
          <circle cx="31" cy="9" fill="var(--fill-0, white)" id="Ellipse 1" r="7" />
        </g>
      </svg>
    </div>
  );
}

function Frame32() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Group1 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame32 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame31 />
      <Frame69 />
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[20px] text-nowrap text-white whitespace-pre">Alertas de Login</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <Frame71 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] not-italic relative shrink-0 text-[16px] text-gray-500 text-nowrap whitespace-pre">Receba notificações quando alguém acessar sua conta</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[40px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 18">
        <g id="Group 13">
          <rect fill="var(--fill-0, #10B981)" height="18" id="Rectangle 34624139" rx="8" width="40" />
          <circle cx="31" cy="9" fill="var(--fill-0, white)" id="Ellipse 1" r="7" />
        </g>
      </svg>
    </div>
  );
}

function Frame34() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Group2 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame34 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame33 />
      <Frame72 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <Frame65 />
          <Frame67 />
          <Frame70 />
          <Frame73 />
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame35 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <Frame36 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p349df780} fill="var(--fill-0, #9CA3AF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Frame38 />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[24px] text-nowrap text-white whitespace-pre">Alertas de Login</p>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Frame">
      <Frame74 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] not-italic relative shrink-0 text-[16px] text-gray-500 text-nowrap whitespace-pre">Ações importantes para proteger sua conta</p>
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame39 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[36px] not-italic relative shrink-0 text-nowrap whitespace-pre" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[20px] text-red-500">Encerrar Todas as Sessões</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] text-gray-500">Desconecta sua conta de todos os dispositivos</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-white box-border content-stretch flex items-start px-[48px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[16px] text-nowrap whitespace-pre">Encerrar Todas</p>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0">
      <Frame41 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Frame42 />
    </div>
  );
}

function Frame76() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame43 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame40 />
      <Frame76 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[36px] not-italic relative shrink-0 text-nowrap whitespace-pre" data-name="Frame">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[20px] text-red-500">Sair da Conta</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[16px] text-gray-500">Encerra sua sessão atual</p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p3089d000} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame46() {
  return (
    <div className="bg-red-500 box-border content-stretch flex gap-[8px] items-start px-[48px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
      <Frame45 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Sair</p>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0">
      <Frame46 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Frame">
      <Frame47 />
    </div>
  );
}

function Frame78() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center justify-end min-h-px min-w-px relative shrink-0">
      <Frame48 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44 />
      <Frame78 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[16px] px-[24px] relative w-full">
          <Frame75 />
          <Frame77 />
          <Frame79 />
        </div>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame">
      <Frame49 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative rounded-[16px] shrink-0 w-full" data-name="Frame">
      <Frame50 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start justify-center relative shrink-0 w-[1215px]" data-name="Frame">
      <Frame />
      <Frame6 />
      <Frame12 />
      <Frame24 />
      <Frame37 />
      <Frame51 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="box-border content-stretch flex flex-col items-start pl-[48px] pr-[24px] py-[48px] relative shrink-0" data-name="Frame">
      <Frame52 />
    </div>
  );
}

export default function Frame54() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Frame">
      <Frame53 />
    </div>
  );
}