declare module 'katex/dist/contrib/auto-render' {
  import { KatexOptions } from 'katex';

  interface AutoRenderOptions {
    delimiters?: { left: string; right: string; display: boolean; }[];
    ignoredTags?: string[];
    ignoredClasses?: string[];
    errorCallback?: (msg: string, err: Error) => void;
    preProcess?: (math: string) => string;
  }

  type RenderOptions = KatexOptions & AutoRenderOptions;

  const renderMathInElement: (element: HTMLElement, options?: RenderOptions) => void;
  export default renderMathInElement;
}
