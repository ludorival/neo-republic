import { resolve as resolveTs } from "ts-node/esm";
import * as tsConfigPaths from "tsconfig-paths";


const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

export function resolve(specifier, context, nextResolve) {
  const matched = matchPath(specifier);
  if (matched) {
    const matchedWithExt = matched.endsWith(".ts") || matched.endsWith(".js") ? matched : `${matched}.ts`;
    return resolveTs(matchedWithExt, context, nextResolve)
  }

  return resolveTs(specifier, context, nextResolve);
}

export { load, transformSource } from "ts-node/esm";
