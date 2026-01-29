import svgPaths from "./svg-l2jev5do8y";

function Text() {
  return (
    <div className="h-[32px] relative shrink-0 w-[32.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[32px] items-center justify-center relative w-[32.953px]">
        <div className="w-[20px] h-[20px] bg-black rounded-full"></div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-center justify-center left-[159px] pl-0 pr-[0.016px] py-0 rounded-[14px] size-[64px] top-0" data-name="Container">
      <Text />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[36px] left-0 top-[80px] w-[382px]" data-name="Heading 1">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[36px] left-[191.77px] not-italic text-[30px] text-center text-nowrap text-white top-[-3px] translate-x-[-50%] whitespace-pre">CriaHub</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-[124px] w-[382px]" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#99a1af] text-[14px] text-center">Gestão completa de haras</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[144px] relative shrink-0 w-full" data-name="Container">
      <Container />
      <Heading />
      <Paragraph />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Usuário</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[#0d0d0d] h-[48px] relative rounded-[14px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[48px] items-center px-[16px] py-0 relative w-full">
          <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[16px] text-nowrap whitespace-pre">Digite seu usuário</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[76px] items-start left-0 top-0 w-[382px]" data-name="Container">
      <Label />
      <TextInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-white">Senha</p>
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="absolute bg-[#0d0d0d] h-[48px] left-0 rounded-[14px] top-0 w-[382px]" data-name="Password Input">
      <div className="box-border content-stretch flex h-[48px] items-center overflow-clip pl-[16px] pr-[48px] py-0 relative rounded-[inherit] w-[382px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6b6b6b] text-[16px] text-nowrap whitespace-pre">Digite sua senha</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#3a3a3a] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 14">
            <path d={svgPaths.pcb0000} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[346px] size-[20px] top-[14px]" data-name="Button">
      <Icon />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <PasswordInput />
      <Button />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[76px] items-start left-0 top-[92px] w-[382px]" data-name="Container">
      <Label1 />
      <Container3 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-[253.31px] top-[187px] w-[128.688px]" data-name="Button">
      <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre">Esqueci minha senha</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-white h-[48px] left-0 rounded-[14px] top-[224px] w-[382px]" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-[191.08px] not-italic text-[16px] text-black text-center text-nowrap top-[10px] translate-x-[-50%] whitespace-pre">Entrar</p>
    </div>
  );
}

function Form() {
  return (
    <div className="h-[272px] relative shrink-0 w-full" data-name="Form">
      <Container2 />
      <Container4 />
      <Button1 />
      <Button2 />
    </div>
  );
}

function BoldText() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[209.86px] top-0 w-[35.563px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">admin</p>
    </div>
  );
}

function BoldText1() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-[256.67px] top-0 w-[27.609px]" data-name="Bold Text">
      <p className="font-['Arial:Bold',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] text-center text-nowrap whitespace-pre">1234</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[154.2px] not-italic text-[#99a1af] text-[12px] text-center text-nowrap top-[-1px] translate-x-[-50%] whitespace-pre">Credenciais de teste:</p>
      <BoldText />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[251.42px] not-italic text-[#99a1af] text-[12px] text-center text-nowrap top-[-1px] translate-x-[-50%] whitespace-pre">/</p>
      <BoldText1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="box-border content-stretch flex flex-col h-[33px] items-start pb-0 pt-[17px] px-0 relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Paragraph1 />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-[#1a1a1a] box-border content-stretch flex flex-col gap-[24px] h-[563px] items-start left-[484.5px] pb-px pt-[33px] px-[33px] rounded-[16px] top-[199.5px] w-[448px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Container1 />
      <Form />
      <Container5 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <path d={svgPaths.p3ffa2780} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[83.33%] left-1/2 right-1/2 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d="M0.833333 0.833333V2.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[83.33%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d="M0.833333 0.833333V2.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.54%_73.58%_73.58%_20.54%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p30e8c300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[73.58%_20.54%_20.54%_73.58%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p30e8c300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[8.33%] right-[83.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
            <path d="M0.833333 0.833333H2.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[83.33%] right-[8.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
            <path d="M0.833333 0.833333H2.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[73.58%_73.58%_20.54%_20.54%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p2061fa80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.54%_20.54%_73.58%_73.58%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p2061fa80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#1a1a1a] box-border content-stretch flex flex-col items-start left-[1347px] pb-px pt-[13px] px-[13px] rounded-[14px] size-[46px] top-[24px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Icon1 />
    </div>
  );
}

function LoginScreen() {
  return (
    <div className="absolute bg-[#0d0d0d] h-[962px] left-0 top-0 w-[1417px]" data-name="LoginScreen">
      <Container6 />
      <Button3 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[18px] left-0 top-[-20000px] w-[6.469px]" data-name="Text">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[18px] left-0 not-italic text-[12px] text-neutral-50 text-nowrap top-[-1px] whitespace-pre">0</p>
    </div>
  );
}

export default function CriaHubWeb() {
  return (
    <div className="bg-neutral-950 relative size-full" data-name="CriaHub (Web)">
      <LoginScreen />
      <Text1 />
    </div>
  );
}