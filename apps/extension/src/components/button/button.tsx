import React, { FunctionComponent } from "react";
import { ButtonProps } from "./types";
import { Styles } from "./styles";
import { LoadingIcon } from "../icon";
import { Box } from "../box";

export const Button: FunctionComponent<ButtonProps> = ({
  onClick,
  style,
  buttonStyle,
  textColor,
  disabledTextColor,
  fontWeight,
  className,
  left,
  text,
  right,
  isLoading,
  textOverrideIcon,
  type,
  ...otherProps
}) => {
  return (
    <Styles.Container
      style={style}
      className={className}
      mode={otherProps.mode}
    >
      <Styles.Button
        style={buttonStyle}
        isLoading={isLoading}
        type={type || "button"}
        {...otherProps}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();

            if (!isLoading) {
              onClick();
            }
          }
        }}
      >
        {left ? <Styles.Left>{left}</Styles.Left> : null}

        {isLoading ? (
          <Styles.Loading buttonColor={otherProps.color}>
            <LoadingIcon width="1rem" height="1rem" />
          </Styles.Loading>
        ) : null}

        {!isLoading && textOverrideIcon ? (
          <Styles.TextOverrideIcon>{textOverrideIcon}</Styles.TextOverrideIcon>
        ) : null}

        <Box style={{ opacity: isLoading || textOverrideIcon ? 0 : 1, color: textColor || '#201B13', fontWeight: fontWeight || 400 }} >
          {text}
        </Box>

        {right ? <Styles.Right>{right}</Styles.Right> : null}
      </Styles.Button>
    </Styles.Container>
  );
};
