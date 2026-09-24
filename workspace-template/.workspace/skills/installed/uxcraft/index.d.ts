export declare const name = "uxcraft";
export declare const version: string;
export declare const trigger = "/uxcraft";

export declare const bins: Readonly<{
  cli: string;
  mcp: string;
}>;

export declare const assets: Readonly<{
  skill: string;
  readme: string;
  llms: string;
  manifest: string;
}>;

export declare function assetPath(name: keyof typeof assets): string;
