declare module "@streamdown/mermaid" {
  export interface Mermaid {
    initialize: (config?: any) => void;
    render: (id: string, text: string) => Promise<{ svg: string } | { svg: string }>;
  }

  const mermaid: Mermaid;
  export default mermaid;
}

