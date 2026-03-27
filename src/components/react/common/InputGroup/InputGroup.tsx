import { useId } from "react";
import {
  composeRenderProps,
  Group,
  type GroupProps,
  InputContext,
} from "react-aria-components";
import "./InputGroup.css";

export interface InputGroupProps extends GroupProps {
  label?: string;
}

export function InputGroup({ label, ...groupProps }: InputGroupProps) {
  const labelId = useId();
  return (
    <div className="input-group">
      {label ? <span id={labelId}>{label}</span> : null}
      <Group
        {...groupProps}
        aria-labelledby={label ? labelId : groupProps["aria-labelledby"]}
      >
        {composeRenderProps(groupProps.children, (children, renderProps) => (
          <InputContext.Provider value={{ disabled: renderProps.isDisabled }}>
            {children}
          </InputContext.Provider>
        ))}
      </Group>
    </div>
  );
}
