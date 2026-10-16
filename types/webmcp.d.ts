// Declarative WebMCP attributes (Chrome origin trial) that expose forms as tools to
// browser agents. Browsers without WebMCP ignore them.
// https://developer.chrome.com/docs/ai/webmcp/declarative-api
import "react";

declare module "react" {
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
  }
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparamdescription?: string;
  }
  interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparamdescription?: string;
  }
}
