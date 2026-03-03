interface EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}

declare var EyeDropper: {
  prototype: EyeDropper;
  new (): EyeDropper;
};
