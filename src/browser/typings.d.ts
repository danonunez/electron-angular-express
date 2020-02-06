/* SystemJS module definition */
export{}

declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}

declare var window: Window;
declare global {
  interface Window {
    process: any;
    require: any;
  }
}
