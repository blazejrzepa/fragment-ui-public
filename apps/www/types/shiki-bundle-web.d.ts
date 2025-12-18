declare module "shiki/bundle/web" {
  export function codeToHtml(
    code: string,
    options: any
  ): Promise<string>;
}


