declare module "*.module.css" {
  const url: { [className: string]: string | undefined };
  export = url;
}
