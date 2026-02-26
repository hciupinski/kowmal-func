type EnvMap = Record<string, string | undefined>;

const viteEnv = import.meta.env as unknown as EnvMap;
const runtimeEnv = (typeof process !== 'undefined' ? (process as {env?: EnvMap}).env : {}) ?? {};

export const getEnv = (name: string, fallback = ''): string => {
  return (
    viteEnv[`VITE_${name}`] ??
    runtimeEnv[`VITE_${name}`] ??
    runtimeEnv[`REACT_APP_${name}`] ??
    fallback
  );
};
