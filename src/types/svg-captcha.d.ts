declare module "svg-captcha" {
  export interface Captcha {
    text: String,
    data: String
  }
  export function create(): Captcha;
}
