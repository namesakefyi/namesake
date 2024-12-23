import { type ZxcvbnResult, zxcvbnAsync } from "@zxcvbn-ts/core";
import { zxcvbnOptions } from "@zxcvbn-ts/core";
import { useDeferredValue, useEffect, useState } from "react";

const loadOptions = async () => {
  const zxcvbnCommonPackage = await import(
    /* webpackChunkName: "zxcvbnCommonPackage" */ "@zxcvbn-ts/language-common"
  );
  const zxcvbnEnPackage = await import(
    /* webpackChunkName: "zxcvbnEnPackage" */ "@zxcvbn-ts/language-en"
  );
  return {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
    translations: zxcvbnEnPackage.translations,
  };
};

loadOptions().then((options) => {
  zxcvbnOptions.setOptions(options);
});

export function usePasswordStrength(password: string) {
  const [result, setResult] = useState<ZxcvbnResult>();
  const deferredPassword = useDeferredValue(password);

  useEffect(() => {
    if (password) {
      zxcvbnAsync(deferredPassword).then((response) => setResult(response));
    }
  }, [password, deferredPassword]);

  return result;
}
