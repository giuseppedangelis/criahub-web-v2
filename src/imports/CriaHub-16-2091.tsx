import svgPaths from "./svg-wwnz43gc24";
import { imgVector } from "./svg-uyv5z";

function Container() {
  return (
    <div className="absolute h-[962px] left-0 top-0 w-[256px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[255px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[22px] w-[58.688px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">CriaHub</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[50px] w-[98.703px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Administrador</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[255px]" data-name="Container">
      <Container1 />
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[12.5%]" data-name="Group">
      <div className="absolute bottom-1/2 left-[12.5%] right-[58.33%] top-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 10">
            <path d={svgPaths.p24f1fc00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_12.5%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-20%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d={svgPaths.p2e4e2580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[12.5%] left-[58.33%] right-[12.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-11.11%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 10">
            <path d={svgPaths.p344107f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.67%_58.33%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-20%_-14.29%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 6">
            <path d={svgPaths.p3df1dd80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] size-[20px] top-[14px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[24px] left-[48px] top-[10px] w-[78.281px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Dashboard</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[48px] left-0 rounded-[10px] top-0 w-[223px]" data-name="Container">
      <Container3 />
      <Paragraph2 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[20.83%_8.33%]" data-name="Group">
      <div className="absolute inset-[20.83%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 14">
            <path d={svgPaths.p2684dd40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_8.33%_58.33%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 2">
            <path d="M0.833335 0.833335H17.5" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group1 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] size-[20px] top-[14px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[24px] left-[48px] top-[10px] w-[83.594px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Assinaturas</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[48px] left-0 rounded-[10px] top-[56px] w-[223px]" data-name="Container">
      <Container5 />
      <Paragraph3 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[12.5%]" data-name="Group">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
            <path d={svgPaths.p3d172d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-3/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-12.5%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 9">
            <path d="M0.833335 7.50004V0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_45.83%_29.17%_54.17%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 12">
            <path d="M0.833335 10.8334V0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_66.67%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-33.33%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 5">
            <path d="M0.833335 3.33333V0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group2 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] size-[20px] top-[14px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[24px] left-[48px] top-[10px] w-[132.516px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Uso da Plataforma</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[48px] left-0 rounded-[10px] top-[112px] w-[223px]" data-name="Container">
      <Container7 />
      <Paragraph4 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Group">
      <div className="absolute inset-[12.44%_8.34%_12.5%_8.26%]" data-name="Vector">
        <div className="absolute inset-[-5.55%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 17">
            <path d={svgPaths.p3f04fe80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[45.83%] left-1/2 right-1/2 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 5">
            <path d="M0.833335 0.833335V4.16663" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 2">
            <path d="M0.833335 0.833335H0.841635" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group3 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] size-[20px] top-[14px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[24px] left-[48px] top-[10px] w-[108.469px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Alertas Críticos</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[48px] left-0 rounded-[10px] top-[168px] w-[223px]" data-name="Container">
      <Container9 />
      <Paragraph5 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[8.41%_12.68%]" data-name="Group">
      <div className="absolute inset-[8.41%_12.68%]" data-name="Vector">
        <div className="absolute inset-[-5.01%_-5.58%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 19">
            <path d={svgPaths.p345bc700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p3d26e2c0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group4 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[16px] size-[20px] top-[14px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[24px] left-[48px] top-[10px] w-[103.172px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Configurações</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-[#333333] h-[48px] left-0 rounded-[10px] top-[224px] w-[223px]" data-name="Container">
      <Container11 />
      <Paragraph6 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[272px] left-[16px] top-[117px] w-[223px]" data-name="Container">
      <Container4 />
      <Container6 />
      <Container8 />
      <Container10 />
      <Container12 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[962px] left-0 top-0 w-[256px]" data-name="Container">
      <Container2 />
      <Container13 />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[962px] left-0 top-0 w-[256px]" data-name="Sidebar">
      <Container />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[1161px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#1a1a1a] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[69.344px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Olá, Rick!</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[24px] left-0 top-[26px] w-[233.922px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Bem-vindo de volta ao seu haras</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[52px] left-[48px] top-[24px] w-[230.688px]" data-name="Container">
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[8.33%]" data-name="Group">
      <div className="absolute inset-[33.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-5.333px] mask-size-[16px_16px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p34d99a00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[83.33%] left-1/2 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-1.333px] mask-size-[16px_16px] right-1/2 top-[8.33%]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-50%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 3">
            <path d="M0.666665 0.666665V2.00001" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-1/2 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8px_-13.333px] mask-size-[16px_16px] right-1/2 top-[83.33%]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-50%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 3">
            <path d="M0.666665 0.666665V2.00007" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.54%_73.58%_73.58%_20.54%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.287px] mask-size-[16px_16px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p31dd1580} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[73.58%_20.54%_20.54%_73.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11.773px] mask-size-[16px_16px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p31dd1580} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.333px_-8px] mask-size-[16px_16px] right-[83.33%] top-1/2" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-0.67px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 2">
            <path d="M0.666665 0.666665H2.00001" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[83.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-13.333px_-8px] mask-size-[16px_16px] right-[8.33%] top-1/2" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-0.67px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 2">
            <path d="M0.666665 0.666665H2.00007" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[73.58%_73.58%_20.54%_20.54%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.287px_-11.773px] mask-size-[16px_16px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p120ecd00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.54%_20.54%_73.58%_73.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11.773px_-3.287px] mask-size-[16px_16px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p120ecd00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[10px] size-[16px] top-[10px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute left-0 rounded-[8px] size-[36px] top-0" data-name="Button">
      <Container17 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[8.33%_12.5%]" data-name="Group">
      <div className="absolute inset-[87.5%_42.78%_8.33%_42.78%]" data-name="Vector">
        <div className="absolute inset-[-100.03%_-28.87%_-100.01%_-28.87%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 2">
            <path d={svgPaths.p3ccb47c0} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%_29.17%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.67%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 12">
            <path d={svgPaths.p316ee600} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group6 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[10px] size-[16px] top-[10px]" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Container19() {
  return <div className="absolute bg-[#fb2c36] left-[20px] rounded-[3.35544e+07px] size-[8px] top-[8px]" data-name="Container" />;
}

function Container20() {
  return (
    <div className="absolute left-[52px] rounded-[8px] size-[36px] top-0" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[24px] left-[6.44px] top-[6px] w-[23.109px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">RH</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute bg-[#333333] left-0 rounded-[3.35544e+07px] size-[36px] top-0" data-name="Container">
      <Paragraph9 />
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute left-[104px] overflow-clip rounded-[3.35544e+07px] size-[36px] top-0" data-name="Container">
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[36px] left-[973px] top-[32px] w-[140px]" data-name="Container">
      <Button />
      <Container20 />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[1161px]" data-name="Container">
      <Container16 />
      <Container23 />
    </div>
  );
}

function Topbar() {
  return (
    <div className="absolute bg-[#0d0d0d] h-[101px] left-0 top-0 w-[1161px]" data-name="Topbar">
      <Container15 />
      <Container24 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute h-[36px] left-0 top-[-2px] w-[281.484px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[36px] left-0 not-italic text-[24px] text-nowrap text-white top-0 whitespace-pre">Configurações do Sistema</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="absolute h-[24px] left-0 top-[42px] w-[443.781px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Gerencie integrações, permissões e parâmetros da plataforma</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[68px] left-[32px] top-[32px] w-[1082px]" data-name="Container">
      <Paragraph10 />
      <Paragraph11 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" data-name="Group">
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-20%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 6">
            <path d="M0.833335 4.99993V0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_62.5%_66.67%_37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 7">
            <path d="M0.833335 5.83333V0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_37.5%_66.67%_62.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 7">
            <path d="M0.833335 5.83333V0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/4 right-1/4 top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 10">
            <path d={svgPaths.p8b7c100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="SettingsPage">
      <Group7 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[20px] top-0" data-name="Container">
      <SettingsPage />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="absolute h-[16px] left-[32px] top-0 w-[151.203px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Integrações Externas</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[20px] left-[25px] top-[25px] w-[1032px]" data-name="Container">
      <Container26 />
      <Paragraph12 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[138.719px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Conexão ABCCMM</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[35.578px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Ativa</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph13 />
      <Paragraph14 />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph15 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container29 />
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <Container28 />
      <Button1 />
    </div>
  );
}

function Container32() {
  return <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-full" data-name="Container" />;
}

function Container33() {
  return (
    <div className="absolute content-stretch flex flex-col h-[73px] items-start left-0 top-0 w-[101.969px]" data-name="Container">
      <Container31 />
      <Container32 />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[171.672px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Gateway de Pagamento</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[120.078px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Stripe conectado</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph16 />
      <Paragraph17 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph18 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container35 />
      <Container36 />
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <Container34 />
      <Button2 />
    </div>
  );
}

function Container38() {
  return <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-full" data-name="Container" />;
}

function Container39() {
  return (
    <div className="absolute content-stretch flex flex-col h-[73px] items-start left-0 top-[85px] w-[101.969px]" data-name="Container">
      <Container37 />
      <Container38 />
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[164.5px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Notificações por E-mail</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[67.594px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">SendGrid</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph19 />
      <Paragraph20 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph21 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container41 />
      <Container42 />
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute h-[72px] left-0 top-[170px] w-[101.969px]" data-name="Container">
      <Container40 />
      <Button3 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute h-px left-[25px] top-[75px] w-[1032px]" data-name="Container">
      <Container33 />
      <Container39 />
      <Container43 />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[1082px]" data-name="Container">
      <Container27 />
      <Container44 />
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute h-[257px] left-0 rounded-[14px] top-0 w-[1082px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function SettingsCard() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[257px] left-0 rounded-[14px] top-0 w-[1082px]" data-name="SettingsCard">
      <Container45 />
      <Container46 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[8.33%_16.67%_8.32%_16.67%]" data-name="Group">
      <div className="absolute inset-[8.33%_16.67%_8.32%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 19">
            <path d={svgPaths.p2dab1100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SettingsPage1() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="SettingsPage">
      <Group8 />
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[20px] top-0" data-name="Container">
      <SettingsPage1 />
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="absolute h-[16px] left-[32px] top-0 w-[161.859px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Gestão de Permissões</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute h-[20px] left-[25px] top-[25px] w-[1032px]" data-name="Container">
      <Container47 />
      <Paragraph22 />
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[91.609px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Super Admin</p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[94.25px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Admin (você)</p>
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph23 />
      <Paragraph24 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph25 />
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container50 />
      <Container51 />
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <Container49 />
      <Button4 />
    </div>
  );
}

function Container53() {
  return <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-full" data-name="Container" />;
}

function Container54() {
  return (
    <div className="absolute content-stretch flex flex-col h-[73px] items-start left-0 top-0 w-[101.969px]" data-name="Container">
      <Container52 />
      <Container53 />
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[116.219px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Suporte Técnico</p>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[55.141px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">2 ativos</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph26 />
      <Paragraph27 />
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph28 />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute h-[72px] left-0 top-[85px] w-[101.969px]" data-name="Container">
      <Container55 />
      <Button5 />
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-px left-[25px] top-[75px] w-[1032px]" data-name="Container">
      <Container54 />
      <Container58 />
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[1082px]" data-name="Container">
      <Container48 />
      <Container59 />
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute h-[257px] left-0 rounded-[14px] top-0 w-[1082px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function SettingsCard1() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[257px] left-0 rounded-[14px] top-[281px] w-[1082px]" data-name="SettingsCard">
      <Container60 />
      <Container61 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[16.67%]" data-name="Group">
      <div className="absolute inset-[70.83%_41.67%_29.17%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-11.11%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
            <path d="M8.33337 0.833335H0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_20.83%_70.83%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-11.11%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
            <path d="M8.3333 0.833335H0.833335" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_16.67%_16.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p30844b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.67%_58.33%_58.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p19220680} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SettingsPage2() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="SettingsPage">
      <Group9 />
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[20px] top-0" data-name="Container">
      <SettingsPage2 />
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="absolute h-[16px] left-[32px] top-0 w-[207.234px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Configurações da Plataforma</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute h-[20px] left-[25px] top-[25px] w-[1032px]" data-name="Container">
      <Container62 />
      <Paragraph29 />
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[112.953px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Período de Trial</p>
    </div>
  );
}

function Paragraph31() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[51.594px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">14 dias</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph30 />
      <Paragraph31 />
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph32() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph32 />
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container65 />
      <Container66 />
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <Container64 />
      <Button6 />
    </div>
  );
}

function Container68() {
  return <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-full" data-name="Container" />;
}

function Container69() {
  return (
    <div className="absolute content-stretch flex flex-col h-[73px] items-start left-0 top-0 w-[101.969px]" data-name="Container">
      <Container67 />
      <Container68 />
    </div>
  );
}

function Paragraph33() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[172.531px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Limite Padrão de Mídias</p>
    </div>
  );
}

function Paragraph34() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[104.063px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">5GB por haras</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph33 />
      <Paragraph34 />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph35() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph35 />
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container71 />
      <Container72 />
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute h-[72px] left-0 top-[85px] w-[101.969px]" data-name="Container">
      <Container70 />
      <Button7 />
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute h-px left-[25px] top-[75px] w-[1032px]" data-name="Container">
      <Container69 />
      <Container73 />
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[1082px]" data-name="Container">
      <Container63 />
      <Container74 />
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute h-[257px] left-0 rounded-[14px] top-0 w-[1082px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function SettingsCard2() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[257px] left-0 rounded-[14px] top-[562px] w-[1082px]" data-name="SettingsCard">
      <Container75 />
      <Container76 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[8.33%_12.5%]" data-name="Group">
      <div className="absolute inset-[87.5%_42.78%_8.33%_42.78%]" data-name="Vector">
        <div className="absolute inset-[-100.02%_-28.87%_-100%_-28.87%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 3">
            <path d={svgPaths.p1e9bcc80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%_29.17%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.67%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 15">
            <path d={svgPaths.p1fc2e100} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SettingsPage3() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="SettingsPage">
      <Group10 />
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[20px] top-0" data-name="Container">
      <SettingsPage3 />
    </div>
  );
}

function Paragraph36() {
  return (
    <div className="absolute h-[16px] left-[32px] top-0 w-[213.438px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">{`Notificações & Monitoramento`}</p>
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute h-[20px] left-[25px] top-[25px] w-[1032px]" data-name="Container">
      <Container77 />
      <Paragraph36 />
    </div>
  );
}

function Paragraph37() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[108.469px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Alertas Críticos</p>
    </div>
  );
}

function Paragraph38() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[83.578px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">E-mail ativo</p>
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph37 />
      <Paragraph38 />
    </div>
  );
}

function Container80() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph39() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container81() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph39 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container80 />
      <Container81 />
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <Container79 />
      <Button8 />
    </div>
  );
}

function Container83() {
  return <div className="bg-[rgba(255,255,255,0.1)] h-px shrink-0 w-full" data-name="Container" />;
}

function Container84() {
  return (
    <div className="absolute content-stretch flex flex-col h-[73px] items-start left-0 top-0 w-[101.969px]" data-name="Container">
      <Container82 />
      <Container83 />
    </div>
  );
}

function Paragraph40() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[147.625px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Relatórios Semanais</p>
    </div>
  );
}

function Paragraph41() {
  return (
    <div className="absolute h-[24px] left-0 top-[22px] w-[71.156px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Habilitado</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="absolute h-[48px] left-0 top-[12px] w-0" data-name="Container">
      <Paragraph40 />
      <Paragraph41 />
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-0 w-[101.969px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Paragraph42() {
  return (
    <div className="absolute h-[20px] left-[18.3px] top-[8px] w-[65.375px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-0 not-italic text-[14px] text-nowrap text-white top-0 whitespace-pre">Configurar</p>
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[101.969px]" data-name="Container">
      <Paragraph42 />
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[36px] left-0 rounded-[8px] top-[18px] w-[101.969px]" data-name="Button">
      <Container86 />
      <Container87 />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute h-[72px] left-0 top-[85px] w-[101.969px]" data-name="Container">
      <Container85 />
      <Button9 />
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute h-px left-[25px] top-[75px] w-[1032px]" data-name="Container">
      <Container84 />
      <Container88 />
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute h-[101px] left-0 top-0 w-[1082px]" data-name="Container">
      <Container78 />
      <Container89 />
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute h-[257px] left-0 rounded-[14px] top-0 w-[1082px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function SettingsCard3() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[257px] left-0 rounded-[14px] top-[843px] w-[1082px]" data-name="SettingsCard">
      <Container90 />
      <Container91 />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute h-[1100px] left-[32px] top-[132px] w-[1082px]" data-name="Container">
      <SettingsCard />
      <SettingsCard1 />
      <SettingsCard2 />
      <SettingsCard3 />
    </div>
  );
}

function Paragraph43() {
  return (
    <div className="absolute h-[16px] left-[25px] top-[23px] w-[172.531px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Informações do Sistema</p>
    </div>
  );
}

function Paragraph44() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[153.875px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Versão da Plataforma</p>
    </div>
  );
}

function Paragraph45() {
  return (
    <div className="absolute h-[24px] left-0 top-[26px] w-[43.594px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">v1.0.0</p>
    </div>
  );
}

function Container93() {
  return (
    <div className="[grid-area:1_/_1] relative shrink-0" data-name="Container">
      <Paragraph44 />
      <Paragraph45 />
    </div>
  );
}

function Paragraph46() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[131.625px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Última Atualização</p>
    </div>
  );
}

function Paragraph47() {
  return (
    <div className="absolute h-[24px] left-0 top-[26px] w-[164.563px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">2 de setembro de 2025</p>
    </div>
  );
}

function Container94() {
  return (
    <div className="[grid-area:1_/_2] relative shrink-0" data-name="Container">
      <Paragraph46 />
      <Paragraph47 />
    </div>
  );
}

function Paragraph48() {
  return (
    <div className="absolute h-[24px] left-0 top-[-2px] w-[67.594px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[#99a1af] text-[16px] text-nowrap top-0 whitespace-pre">Ambiente</p>
    </div>
  );
}

function Paragraph49() {
  return (
    <div className="absolute h-[24px] left-0 top-[26px] w-[68.5px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">Produção</p>
    </div>
  );
}

function Container95() {
  return (
    <div className="[grid-area:1_/_3] relative shrink-0" data-name="Container">
      <Paragraph48 />
      <Paragraph49 />
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute gap-[24px] grid grid-cols-[repeat(3,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[52px] left-[25px] top-[71px] w-[1032px]" data-name="Container">
      <Container93 />
      <Container94 />
      <Container95 />
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute h-[148px] left-0 top-0 w-[1082px]" data-name="Container">
      <Paragraph43 />
      <Container96 />
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute h-[148px] left-0 rounded-[14px] top-0 w-[1082px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function SystemInfoCard() {
  return (
    <div className="absolute bg-[#1a1a1a] h-[148px] left-[32px] rounded-[14px] top-[1264px] w-[1082px]" data-name="SystemInfoCard">
      <Container97 />
      <Container98 />
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute bg-[#0d0d0d] h-[1521px] left-0 top-0 w-[1146px]" data-name="Container">
      <Container25 />
      <Container92 />
      <SystemInfoCard />
    </div>
  );
}

function Container100() {
  return (
    <div className="absolute h-[861px] left-0 overflow-clip top-[101px] w-[1161px]" data-name="Container">
      <Container99 />
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute h-[962px] left-0 overflow-clip top-0 w-[1161px]" data-name="Container">
      <Topbar />
      <Container100 />
    </div>
  );
}

function Container102() {
  return (
    <div className="absolute h-px left-[256px] overflow-clip top-0 w-[1161px]" data-name="Container">
      <Container101 />
    </div>
  );
}

export default function CriaHub() {
  return (
    <div className="bg-[#0d0d0d] relative size-full" data-name="CriaHub">
      <Sidebar />
      <Container102 />
    </div>
  );
}