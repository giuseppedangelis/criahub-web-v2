function Frame5() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center not-italic px-[10px] py-0 relative text-nowrap w-full whitespace-pre">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[36px] text-white">Logs da Conexão ABCCMM</p>
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[36px] relative shrink-0 text-[16px] text-gray-500">Visualização em tempo real dos logs de importação e sincronização.</p>
        </div>
      </div>
    </div>
  );
}

function LabelText() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="label-text">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[14px] text-gray-400 text-nowrap whitespace-pre">
        [15:45:01] INFO: Conexão ABCCMM estabelecida com sucesso.
        <br aria-hidden="true" />
        {`[15:45:10] WARN: Erro na sincronização do haras 'Haras Trovão'. (Time Out)`}
        <br aria-hidden="true" />
        {`[15:45:12] SUCCESS: Importação da planilha 'Plantel' finalizada. 120 novos animais registrados.`}
        <br aria-hidden="true" />
        [15:45:15] DEBUG: Próxima tentativa de sincronização agendada para 00:00.
      </p>
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 box-border content-stretch flex flex-col grow h-full items-start min-h-px min-w-px px-0 py-[8px] relative shrink-0" data-name="content">
      <LabelText />
    </div>
  );
}

function StateLayer() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" data-name="state-layer">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start pl-[16px] pr-0 py-[4px] relative size-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

function TextField() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative rounded-[4px] shrink-0 w-full" data-name="text field">
      <StateLayer />
    </div>
  );
}

function TextField1() {
  return (
    <div className="content-stretch flex flex-col h-[169px] items-start opacity-[0.88] relative rounded-[8px] shrink-0 w-full" data-name="Text field">
      <div aria-hidden="true" className="absolute border border-[#6b6b6b] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <TextField />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <TextField1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-start justify-center pl-0 pr-[10px] py-0 relative w-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="box-border content-stretch flex flex-col items-center justify-center px-[48px] py-[8px] relative rounded-[8px] shrink-0 w-[396px]" data-name="Frame">
      <div aria-hidden="true" className="absolute border border-[#b0b0b0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#b0b0b0] text-[16px] text-nowrap whitespace-pre">Fechar</p>
    </div>
  );
}

function Popup() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-full" data-name="Popup">
      <Frame />
    </div>
  );
}

export default function LogsDaConexaoAbccmm() {
  return (
    <div className="bg-[#1a1a1a] relative rounded-[16px] size-full" data-name="Logs da Conexão ABCCMM">
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-center justify-center p-[48px] relative size-full">
          <Frame5 />
          <Frame4 />
          <Popup />
        </div>
      </div>
    </div>
  );
}