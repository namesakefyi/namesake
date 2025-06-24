import { type ZxcvbnResult, zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";
import { useDeferredValue, useEffect, useState } from "react";

export function usePasswordStrength(password: string) {
  const [result, setResult] = useState<ZxcvbnResult>();
  const deferredPassword = useDeferredValue(password);

  const loadOptions = async () => {
    const zxcvbnCommonPackage = await import(
      /* webpackChunkName: "zxcvbnCommonPackage" */ "@zxcvbn-ts/language-common"
    );
    const zxcvbnEnPackage = await import(
      /* webpackChunkName: "zxcvbnEnPackage" */ "@zxcvbn-ts/language-en"
    );

    return {
      dictionary: {
        ...zxcvbnCommonPackage.default.dictionary,
        ...zxcvbnEnPackage.default.dictionary,
      },
      graphs: zxcvbnCommonPackage.default.adjacencyGraphs,
      translations: zxcvbnEnPackage.default.translations,
    };
  };

  useEffect(() => {
    if (!password) {
      setResult(undefined);
      return;
    }

    loadOptions().then((options) => {
      zxcvbnOptions.setOptions(options);
      zxcvbnAsync(deferredPassword).then((response) => setResult(response));
    });
  }, [password, deferredPassword]);

  return result;
}
