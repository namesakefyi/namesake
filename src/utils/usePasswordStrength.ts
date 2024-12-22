import { type ZxcvbnResult, zxcvbnAsync } from "@zxcvbn-ts/core";
import { zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { useDeferredValue, useEffect, useState } from "react";

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
};
zxcvbnOptions.setOptions(options);

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
